import React, { useEffect, useState } from 'react';
import { getAssignedPickups, updatePickupStatus, logCollection } from '../api/Collector';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  collected: 'bg-purple-100 text-purple-800',
  recycled: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Inline form for logging weight + notes when a collector completes a pickup.
function CompletionForm({ pickup, onSubmit, onCancel, submitting }) {
  const [weight, setWeight] = useState(pickup.quantity || '');
  const [notes, setNotes] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(weight, notes);
      }}
      className="mt-4 pt-4 border-t border-eco-sage/20 flex flex-col gap-3"
    >
      <div className="flex gap-3">
        <input
          type="number"
          step="0.1"
          min="0"
          required
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Actual weight (kg)"
          className="flex-1 p-2 text-sm bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional â€” e.g. access issues, contamination)"
        rows="2"
        className="p-2 text-sm bg-gray-50 dark:bg-black/30 border border-eco-sage/20 rounded-lg"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-eco-forest text-white text-xs font-bold uppercase rounded-md disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Confirm collection'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-eco-sage/30 text-xs font-bold uppercase rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CollectorDashboard() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFormId, setActiveFormId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  async function loadPickups() {
    try {
      const data = await getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPickups();
  }, []);

  async function handleComplete(pickup, weight, notes) {
    setSubmittingId(pickup.request_id);
    setError('');
    try {
      // Log the weight/notes record, then flip status to 'collected'.
      // If your backend auto-sets status when a Collection is created,
      // the second call is harmless but may be redundant â€” adjust as needed.
      await logCollection(pickup.request_id, weight, notes);
      await updatePickupStatus(pickup.request_id, 'collected');
      setActiveFormId(null);
      await loadPickups();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingId(null);
    }
  }

  const activePickups = pickups.filter((p) => p.status === 'assigned');
  const completedPickups = pickups.filter((p) =>
    ['collected', 'recycled'].includes(p.status)
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-eco-forest dark:text-white mb-2">
        Collector dashboard
      </h1>
      <p className="text-sm text-eco-mint dark:text-eco-sage mb-10">
        Your assigned pickups for today.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-eco-mint dark:text-eco-sage">Loading your route...</p>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-eco-forest dark:text-white mb-4">
              To collect ({activePickups.length})
            </h2>
            {activePickups.length === 0 ? (
              <div className="p-8 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 text-center">
                <p className="text-sm text-eco-mint dark:text-eco-sage">
                  No pickups currently assigned to you.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activePickups.map((pickup) => (
                  <div
                    key={pickup.request_id}
                    className="p-6 bg-white dark:bg-eco-charcoal rounded-2xl border border-eco-sage/20 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-eco-forest dark:text-white">
                          {pickup.category_detail?.category_name || 'Pickup Request'}
                        </p>
                        <p className="text-sm text-eco-mint dark:text-eco-sage mt-1">
                          Est. {pickup.quantity}kg Â· Scheduled {pickup.pickup_date}
                        </p>
                        {pickup.address && (
                          <p className="text-xs text-eco-mint dark:text-eco-sage mt-1">
                            {pickup.address}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {pickup.status}
                        </span>
                        {activeFormId !== pickup.request_id && (
                          <button
                            onClick={() => setActiveFormId(pickup.request_id)}
                            className="px-4 py-2 bg-eco-forest text-white text-xs font-bold uppercase rounded-md"
                          >
                            Mark collected
                          </button>
                        )}
                      </div>
                    </div>

                    {activeFormId === pickup.request_id && (
                      <CompletionForm
                        pickup={pickup}
                        submitting={submittingId === pickup.request_id}
                        onCancel={() => setActiveFormId(null)}
                        onSubmit={(weight, notes) => handleComplete(pickup, weight, notes)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-eco-forest dark:text-white mb-4">
              Recently completed
            </h2>
            {completedPickups.length === 0 ? (
              <p className="text-sm text-eco-mint dark:text-eco-sage">
                Nothing completed yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {completedPickups.map((pickup) => (
                  <div
                    key={pickup.request_id}
                    className="p-4 bg-white dark:bg-eco-charcoal rounded-xl border border-eco-sage/20 flex items-center justify-between"
                  >
                    <p className="text-sm text-eco-forest dark:text-white">
                      {pickup.category_detail?.category_name || 'Pickup Request'} Â· {pickup.quantity}kg
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[pickup.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {pickup.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
