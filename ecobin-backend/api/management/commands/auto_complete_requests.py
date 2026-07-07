from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import PickupRequest, Notification

class Command(BaseCommand):
    help = 'Automatically completes pickup requests that have been waiting for citizen verification for more than 72 hours'

    def handle(self, *args, **options):
        # 72 hours ago
        threshold_date = timezone.now() - timedelta(hours=72)
        
        # Find requests that are pending citizen verification and where collector_completed_at is older than 72 hours
        eligible_requests = PickupRequest.objects.filter(
            status='pending_verification',
            collector_completed_at__lte=threshold_date
        )
        
        count = 0
        for pickup in eligible_requests:
            pickup.status = 'completed'
            pickup.completed_by = 'system'
            pickup.completion_note = 'Auto-completed due to no citizen verification within 3 days'
            pickup.save()
            count += 1
            
            # Notify citizen
            Notification.objects.create(
                user=pickup.user, 
                title='Pickup Auto-Completed', 
                message=f'Your pickup request {pickup.request_id} has been auto-completed because no verification was provided within 3 days.'
            )
            
            # Notify collector if assigned
            if pickup.assigned_collector:
                Notification.objects.create(
                    user=pickup.assigned_collector.user, 
                    title='Pickup Auto-Completed', 
                    message=f'The collection for request {pickup.request_id} has been verified automatically by the system.'
                )
                
            # Create Recycling record if category is RECYCLABLE
            if pickup.category.disposal_category == 'RECYCLABLE':
                from api.models import Collection, Recycling
                collection_obj = Collection.objects.filter(request=pickup).first()
                if collection_obj:
                    # check if recycling record already exists
                    Recycling.objects.get_or_create(
                        collection=collection_obj,
                        defaults={
                            'recycled_weight': collection_obj.collected_weight,
                            'status': 'processing',
                            'recycling_center': 'Central Recycling Facility',
                            'recycled_date': timezone.now().date()
                        }
                    )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully auto-completed {count} pickup requests.'))
