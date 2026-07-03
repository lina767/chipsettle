import type { CompanyProfile, InstrumentResult, InstrumentType } from '../lib/types';
import { getCountry } from '../data/countries';
import {
  eligibilityColors,
  eligibilityLabels,
  instrumentTypeColors,
  instrumentTypeLabels,
} from '../lib/labels';

const typeOrder: InstrumentType[] = [
  'rd_tax_credit',
  'ip_box',
  'payroll_exemption',
  'expat_tax_ruling',
  'equity_taxation',
  'grant_program',
  'infrastructure_access',
  'visa_fast_track',
  'state_aid_scheme',
  'other',
];

/**
 * Side-by-side country comparison for the user's profile — the killer
 * feature. Rows are instrument types, columns are countries (plus EU level).
 */
export default function ComparisonTable({
  results,
  countrySlugs,
}: {
  profile: CompanyProfile;
  results: InstrumentResult[];
  countrySlugs: string[];
}) {
  const columns = [...countrySlugs, 'eu'];
  const presentTypes = typeOrder.filter((t) =>
    results.some((r) => r.instrument.instrument_type === t),
  );

  const cell = (countrySlug: string, type: InstrumentType) =>
    results.filter(
      (r) => r.instrument.country === countrySlug && r.instrument.instrument_type === type,
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-3 py-2.5 font-semibold text-slate-700 border-b border-slate-200 w-40">
              Instrument type
            </th>
            {columns.map((slug) => {
              const c = getCountry(slug);
              return (
                <th
                  key={slug}
                  className="text-left px-3 py-2.5 font-semibold text-slate-700 border-b border-slate-200"
                >
                  <a href={`/country/${slug}`} className="hover:text-blue-900">
                    <span className="mr-1.5">{c?.flag_emoji}</span>
                    {slug === 'eu' ? 'EU level' : c?.name ?? slug}
                  </a>
                  {c && c.general_corporate_tax_rate !== null && (
                    <span className="block text-xs font-normal text-slate-400">
                      CIT ~{c.general_corporate_tax_rate}%
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {presentTypes.map((type) => (
            <tr key={type} className="border-b border-slate-100 last:border-0 align-top">
              <td className="px-3 py-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${instrumentTypeColors[type].dot}`}
                  />
                  {instrumentTypeLabels[type]}
                </span>
              </td>
              {columns.map((slug) => {
                const items = cell(slug, type);
                return (
                  <td key={slug} className="px-3 py-3">
                    {items.length === 0 ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <ul className="space-y-2">
                        {items.map((r) => (
                          <li key={r.instrument.slug}>
                            <a
                              href={`/instrument/${r.instrument.slug}`}
                              className={`block font-medium leading-snug hover:underline ${
                                r.instrument.is_absence
                                  ? 'text-slate-500'
                                  : 'text-slate-900 hover:text-blue-900'
                              }`}
                            >
                              {r.instrument.is_absence && '✕ '}
                              {r.instrument.name}
                            </a>
                            {r.instrument.parameters[0] && (
                              <span className="block text-xs text-slate-500 mt-0.5">
                                {r.instrument.parameters[0].label}:{' '}
                                {r.instrument.parameters[0].value}
                              </span>
                            )}
                            <span
                              className={`mt-1 inline-flex rounded border px-1.5 py-px text-[10px] font-semibold ${eligibilityColors[r.eligibility_status]}`}
                            >
                              {eligibilityLabels[r.eligibility_status]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
