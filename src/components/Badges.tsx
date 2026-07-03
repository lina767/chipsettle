import type { EligibilityStatus, Instrument } from '../lib/types';
import {
  eligibilityColors,
  eligibilityLabels,
  formatDate,
  hasRecentChange,
  instrumentTypeColors,
  instrumentTypeLabels,
  isStale,
  statusColors,
  statusLabels,
} from '../lib/labels';

export function TypeBadge({ type }: { type: Instrument['instrument_type'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium ${instrumentTypeColors[type].badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${instrumentTypeColors[type].dot}`} />
      {instrumentTypeLabels[type]}
    </span>
  );
}

export function StatusBadge({ status }: { status: Instrument['status'] }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function EligibilityBadge({ status }: { status: EligibilityStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${eligibilityColors[status]}`}
    >
      {eligibilityLabels[status]}
    </span>
  );
}

/** "Verified: [date]" with staleness warning and recent-change badge. */
export function VerificationLine({ instrument }: { instrument: Instrument }) {
  const stale = isStale(instrument.last_verified);
  const recent = hasRecentChange(instrument.changelog);
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-xs">
      <span className={stale ? 'text-amber-700 font-medium' : 'text-slate-500'}>
        Verified: {formatDate(instrument.last_verified)}
        {stale && ' ⚠ over 6 months old'}
      </span>
      {recent && (
        <span className="inline-flex items-center rounded bg-blue-100 text-blue-900 px-1.5 py-0.5 font-medium">
          Recently changed
        </span>
      )}
      {instrument.needs_verification && (
        <span className="inline-flex items-center rounded bg-amber-100 text-amber-900 px-1.5 py-0.5 font-medium">
          Parameters pending verification
        </span>
      )}
    </span>
  );
}
