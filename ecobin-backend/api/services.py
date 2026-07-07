"""
EcoBin Business Logic Services

All rule-based computations live here and are called from views.
This keeps views thin and logic testable in isolation.

Rules implemented:
  Rule 1 — Compound Cleanup Trigger (10+ requests by one citizen)
  Rule 2 — Street Cleanup Trigger (5+ collective requests on same street)
  Rule 3 — Collector Bonus (10 recyclable + 2 compound + 1 street per cycle)
  Rule 4 — Collector Increment (3 bonus cycles → increment_qualified)
  Rule 5 — Points update from citizen rating
"""

from django.db import transaction
from django.utils import timezone


# ──────────────────────────────────────────────
# Constants (tweak here without touching logic)
# ──────────────────────────────────────────────

# Rule 1
COMPOUND_CLEANUP_THRESHOLD = 10  # requests by one citizen

# Rule 2
STREET_CLEANUP_THRESHOLD = 5  # collective requests on same street

# Rule 3 — Bonus cycle requirements
BONUS_RECYCLABLE_THRESHOLD = 10
BONUS_COMPOUND_THRESHOLD = 2
BONUS_STREET_THRESHOLD = 1

# Rule 4
INCREMENT_CYCLE_THRESHOLD = 3  # bonus cycles needed to qualify for increment

# Rule 5 — Bonus formula: base × (points/5)
BASE_BONUS_AMOUNT = 500.0


# ──────────────────────────────────────────────
# Rule 1: Compound Cleanup Trigger
# ──────────────────────────────────────────────

def check_compound_cleanup_trigger(user):
    """
    Check if a citizen's total non-cancelled/non-rejected pickup requests
    have reached COMPOUND_CLEANUP_THRESHOLD. If so, schedule a compound cleanup
    (unless one is already pending/in_progress for this citizen).

    Returns the CompoundCleanup instance if one was just created, else None.
    """
    from .models import PickupRequest, CompoundCleanup, Notification

    # Count all submitted requests (exclude cancelled and rejected)
    excluded_statuses = ['cancelled', 'rejected']
    request_count = PickupRequest.objects.filter(
        user=user
    ).exclude(status__in=excluded_statuses).count()

    if request_count < COMPOUND_CLEANUP_THRESHOLD:
        return None

    # Check if there's already an active cleanup for this citizen
    already_exists = CompoundCleanup.objects.filter(
        citizen=user,
        status__in=['pending', 'in_progress']
    ).exists()

    if already_exists:
        return None

    # Create the compound cleanup
    with transaction.atomic():
        cleanup = CompoundCleanup.objects.create(
            citizen=user,
            trigger_request_count=request_count
        )

        # Notify citizen
        Notification.objects.create(
            user=user,
            title='Compound Cleanup Scheduled',
            message=(
                f'You have submitted {request_count} pickup requests. '
                'A compound cleanup has been automatically scheduled for your premises. '
                'An admin will assign a collector shortly.'
            )
        )

    return cleanup


# ──────────────────────────────────────────────
# Rule 2: Street Cleanup Trigger
# ──────────────────────────────────────────────

def normalize_street(street_value):
    """
    Normalize a street name for consistent grouping.
    Strips whitespace and lowercases for comparison.
    """
    if not street_value:
        return None
    return street_value.strip().lower()


def check_street_cleanup_trigger(street):
    """
    Check if the collective pickup requests on a given street have reached
    STREET_CLEANUP_THRESHOLD. If so, schedule a street cleanup (unless one
    is already pending/in_progress for this street).

    Returns the StreetCleanup instance if one was just created, else None.
    """
    from .models import PickupRequest, StreetCleanup, Notification, User

    normalized = normalize_street(street)
    if not normalized:
        return None

    excluded_statuses = ['cancelled', 'rejected']
    # Count all requests on this street (case-insensitive) from any citizen
    request_count = PickupRequest.objects.filter(
        street__iexact=normalized
    ).exclude(status__in=excluded_statuses).count()

    if request_count < STREET_CLEANUP_THRESHOLD:
        return None

    # Check if there's already an active street cleanup
    already_exists = StreetCleanup.objects.filter(
        street__iexact=normalized,
        status__in=['pending', 'in_progress']
    ).exists()

    if already_exists:
        return None

    with transaction.atomic():
        # Use the canonical (first submitted) casing of the street name
        canonical_street = (
            PickupRequest.objects.filter(street__iexact=normalized)
            .exclude(status__in=excluded_statuses)
            .values_list('street', flat=True)
            .first()
        ) or street

        cleanup = StreetCleanup.objects.create(
            street=canonical_street,
            trigger_request_count=request_count
        )

        # Notify all citizens on that street
        citizen_ids = (
            PickupRequest.objects.filter(street__iexact=normalized)
            .exclude(status__in=excluded_statuses)
            .values_list('user_id', flat=True)
            .distinct()
        )
        notifications = [
            Notification(
                user_id=uid,
                title='Street Cleanup Scheduled',
                message=(
                    f'A street cleanup has been scheduled for {canonical_street}. '
                    f'{request_count} pickup requests were submitted from this street. '
                    'An admin will assign a collector shortly.'
                )
            )
            for uid in citizen_ids
        ]
        Notification.objects.bulk_create(notifications)

    return cleanup


# ──────────────────────────────────────────────
# Rule 5: Update Collector Points from Rating
# ──────────────────────────────────────────────

def update_collector_points(collector, rating):
    """
    Update collector's running average points and recalculate bonus_amount.

    Points formula: running weighted average of all ratings
        new_points = (old_points * old_count + rating) / (old_count + 1)

    Bonus formula: BASE_BONUS_AMOUNT × (points / 5.0)

    Args:
        collector: Collector model instance
        rating: int, 1–5
    """
    with transaction.atomic():
        # Re-fetch with select_for_update to prevent race conditions
        from .models import Collector
        collector = Collector.objects.select_for_update().get(pk=collector.pk)

        old_count = collector.ratings_count
        old_points = collector.points

        new_count = old_count + 1
        new_points = ((old_points * old_count) + rating) / new_count

        collector.ratings_count = new_count
        collector.points = round(new_points, 2)
        collector.bonus_amount = round(BASE_BONUS_AMOUNT * (new_points / 5.0), 2)
        collector.save(update_fields=['ratings_count', 'points', 'bonus_amount'])

    return collector


# ──────────────────────────────────────────────
# Rule 3 & 4: Bonus Cycle Check
# ──────────────────────────────────────────────

def check_bonus_cycle(collector):
    """
    Check if the collector has completed all requirements for a bonus cycle:
      - BONUS_RECYCLABLE_THRESHOLD (10) recyclable collections
      - BONUS_COMPOUND_THRESHOLD (2) compound cleanups
      - BONUS_STREET_THRESHOLD (1) street cleanup

    If all thresholds are met:
      1. Increment bonus_cycles_completed
      2. Reset per-cycle counters
      3. If bonus_cycles_completed reaches INCREMENT_CYCLE_THRESHOLD (3),
         set increment_qualified = True

    Returns True if a bonus cycle was awarded, False otherwise.
    """
    from .models import Collector, Notification

    with transaction.atomic():
        collector = Collector.objects.select_for_update().get(pk=collector.pk)

        recyclable_ok = collector.total_recyclable_collections >= BONUS_RECYCLABLE_THRESHOLD
        compound_ok = collector.compound_cleanups_this_cycle >= BONUS_COMPOUND_THRESHOLD
        street_ok = collector.street_cleanups_this_cycle >= BONUS_STREET_THRESHOLD

        if not (recyclable_ok and compound_ok and street_ok):
            return False

        # Award the bonus cycle
        collector.bonus_cycles_completed += 1

        # Reset per-cycle counters
        collector.total_recyclable_collections = 0
        collector.compound_cleanups_this_cycle = 0
        collector.street_cleanups_this_cycle = 0

        # Rule 4: check increment qualification
        newly_increment_qualified = False
        if (
            not collector.increment_qualified
            and collector.bonus_cycles_completed >= INCREMENT_CYCLE_THRESHOLD
        ):
            collector.increment_qualified = True
            newly_increment_qualified = True

        collector.save(update_fields=[
            'bonus_cycles_completed',
            'total_recyclable_collections',
            'compound_cleanups_this_cycle',
            'street_cleanups_this_cycle',
            'increment_qualified',
        ])

    # Notify the collector
    bonus_msg = (
        f'🎉 Congratulations! You have completed bonus cycle '
        f'#{collector.bonus_cycles_completed}. Your bonus amount is '
        f'₹{collector.bonus_amount:.2f}.'
    )
    if newly_increment_qualified:
        bonus_msg += (
            ' You have completed 3 full bonus cycles and now qualify for a '
            'salary increment/tier upgrade!'
        )

    Notification.objects.create(
        user=collector.user,
        title='Bonus Cycle Completed! 🏆',
        message=bonus_msg
    )

    return True


# ──────────────────────────────────────────────
# Helper: increment recyclable collections
# ──────────────────────────────────────────────

def increment_recyclable_collection(collector):
    """
    Increment total_recyclable_collections for a collector (called when a
    RECYCLABLE category pickup is marked completed).
    Then check if a bonus cycle is now triggered.
    """
    from .models import Collector
    with transaction.atomic():
        Collector.objects.filter(pk=collector.pk).update(
            total_recyclable_collections=models_F('total_recyclable_collections') + 1
        )
        collector.refresh_from_db()

    check_bonus_cycle(collector)


def models_F(field):
    """Local import helper for Django F expressions."""
    from django.db.models import F
    return F(field)
