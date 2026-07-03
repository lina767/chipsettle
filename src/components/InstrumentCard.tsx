import type { InstrumentResult } from '../lib/types';
import { getCountry } from '../data/countries';
import { instrumentTypeColors, mechanismHelp, mechanismLabels } from '../lib/labels';
import { EligibilityBadge, StatusBadge, TypeBadge, VerificationLine } from './Badges';

/**
 * Instrument card for the results dashboard: name, type, key parameters,
 * eligibility assessment, legal basis, source link, last verified date.
 */
export default function InstrumentCard({ result }: { result: InstrumentResult }) {
  const { instrument: i, eligibility_status, notes, conditional_reason, pillar_two_capped } =
    result;
  const country = getCountry(i.country);
  const colors = instrumentTypeColors[i.instrument_type];

  return (
    <article
      className={`rounded-lg border border-slate-200 border-l-4 ${colors.border} bg-white p-4 sm:p-5 shadow-sm print-break-inside-avoid ${
        i.is_absence ? 'bg-slate-50' : ''
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-base" aria-hidden="true">
              {country?.flag_emoji}
            </span>
            <TypeBadge type={i.instrument_type} />
            <StatusBadge status={i.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">
            <a href={`/instrument/${i.slug}`} className="hover:text-blue-900 hover:underline">
              {i.name}
            </a>
          </h3>
        </div>
        <EligibilityBadge status={eligibility_status} />
      </div>

      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{i.summary}</p>

      {/* Pillar Two cap — shown directly on the IP-box card */}
      {pillar_two_capped && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 flex gap-2">
          <span aria-hidden="true">▲</span>
          <span>
            <strong>Pillar Two cap:</strong> your group revenue exceeds €750M, so this IP-box
            benefit is bounded by the 15% GloBE minimum-tax floor. The saving is the gap between the
            headline rate and 15%, not the full IP-box rate.
          </span>
        </div>
      )}

      {/* Conditional reason + path to satisfy it */}
      {eligibility_status === 'conditional' && conditional_reason && (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <p className="text-slate-700">
            <strong className="text-slate-900">Conditional:</strong> {conditional_reason.reason}
          </p>
          {conditional_reason.path && (
            <p className="text-slate-600 mt-1">
              <span className="font-medium text-emerald-700">Path:</span> {conditional_reason.path}
            </p>
          )}
        </div>
      )}

      {/* Key parameters */}
      {i.parameters.length > 0 && (
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          {i.parameters.slice(0, 4).map((p) => (
            <div key={p.label} className="flex gap-2 items-baseline">
              <dt className="text-slate-500 shrink-0">{p.label}:</dt>
              <dd className="font-medium text-slate-900">{p.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Profile-specific notes */}
      {notes.length > 0 && (
        <ul className="mt-3 space-y-1">
          {notes.map((n) => (
            <li key={n} className="text-xs text-slate-600 flex gap-1.5">
              <span className="text-amber-600 shrink-0" aria-hidden="true">
                ▸
              </span>
              {n}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-slate-500">
          <span title={mechanismHelp[i.mechanism]}>{mechanismLabels[i.mechanism]}</span>
          <span className="mx-1.5">·</span>
          <span>
            Legal basis:{' '}
            <a
              href={i.legal_basis_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline print-url"
            >
              {i.legal_basis.length > 70 ? i.legal_basis.slice(0, 70) + '…' : i.legal_basis}
            </a>
          </span>
        </div>
        <VerificationLine instrument={i} />
      </div>
    </article>
  );
}
