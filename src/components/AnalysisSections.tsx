import type {
  CompanyProfile,
  ExcludedInstrument,
  InstrumentResult,
} from '../lib/types';
import { getCountry } from '../data/countries';
import {
  buildRoadmap,
  ecosystemFit,
  estimateForCountry,
  DEFAULT_COST_PER_ENGINEER_EUR,
  REVENUE_MIDPOINT_EUR,
  hasEstimateInputs,
} from '../lib/analysis';
import { instrumentTypeColors, sectorLabels } from '../lib/labels';

const eur = (n: number) =>
  n >= 1_000_000
    ? `€${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`
    : n >= 1_000
      ? `€${(n / 1_000).toFixed(0)}k`
      : `€${Math.round(n)}`;

// ---------------------------------------------------------------------------
// 1. Support estimate (Rechnung)
// ---------------------------------------------------------------------------

export function EstimatePanel({
  profile,
  results,
  countrySlugs,
}: {
  profile: CompanyProfile;
  results: InstrumentResult[];
  countrySlugs: string[];
}) {
  if (!hasEstimateInputs(profile)) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Add your planned R&D headcount or personnel cost in the wizard to see a rough{' '}
        <strong>support estimate</strong> per country here.{' '}
        <a href="/wizard" className="text-blue-800 underline">
          Add numbers ↺
        </a>
      </div>
    );
  }

  const estimates = countrySlugs
    .map((slug) => estimateForCountry(slug, results, profile))
    .filter((e) => e.lines.length > 0 || e.competitiveCount > 0);

  if (estimates.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        No quantifiable instruments match your profile in the selected countries.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estimates.map((e) => {
          const country = getCountry(e.countrySlug);
          return (
            <div
              key={e.countrySlug}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm print-break-inside-avoid"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  <span aria-hidden="true">{country?.flag_emoji}</span> {country?.name}
                </h3>
                {e.effectiveRatePct !== null && (
                  <span
                    className="text-xs text-slate-500"
                    title="Total estimated support as a share of your R&D personnel cost plus assumed IP income"
                  >
                    ≈{e.effectiveRatePct.toFixed(1)}% effective
                  </span>
                )}
              </div>
              <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
                {eur(e.total)}
                <span className="text-sm font-normal text-slate-400"> / year est.</span>
              </p>
              <ul className="mt-3 space-y-1.5">
                {e.lines.map((l) => (
                  <li key={l.instrument.slug} className="text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-700 font-medium">
                        {l.instrument.name.replace(/\s*\(.*?\)\s*/g, ' ').trim()}
                        {l.rough && <span className="text-amber-600"> *</span>}
                      </span>
                      <span className="text-slate-900 tabular-nums font-semibold shrink-0">
                        {eur(l.amount)}
                      </span>
                    </div>
                    <span className="text-slate-400">{l.basis}</span>
                  </li>
                ))}
              </ul>
              {e.competitiveCount > 0 && (
                <p className="mt-2 text-xs text-emerald-700">
                  + {e.competitiveCount} competitive grant program
                  {e.competitiveCount === 1 ? '' : 's'} (not quantified — outcome uncertain)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Assumptions — visible and auditable */}
      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Assumptions behind these figures
        </summary>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li>
            R&D personnel base:{' '}
            {profile.rdPersonnelCost
              ? `${eur(profile.rdPersonnelCost)} (your figure)`
              : `${profile.rdEngineers} engineers × €${(DEFAULT_COST_PER_ENGINEER_EUR / 1000).toFixed(0)}k assumed`}
            .
          </li>
          <li>
            IP income:{' '}
            {profile.ipSharePct
              ? `${profile.ipSharePct}% of your revenue-band midpoint (${eur(REVENUE_MIDPOINT_EUR[profile.revenue])})`
              : 'not provided — IP-box savings excluded'}
            .
          </li>
          <li>R&D tax credits applied to the personnel base at their headline/SME rate, subject to annual caps.</li>
          <li>Payroll instruments (marked *) use indicative effective rates — verify against the source.</li>
          <li>IP-box savings = (headline corporate rate − IP-box rate) × IP income; floored at 15% above €750M revenue (Pillar Two).</li>
          <li>Discretionary grants are listed but not added to the figure — approval is competitive and uncertain.</li>
        </ul>
        <p className="mt-2 font-medium text-slate-700">
          This is a rough orientation estimate, not a computation of your tax position, and does not
          replace tax advice.
        </p>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Roadmap (Handlungspfad)
// ---------------------------------------------------------------------------

export function RoadmapView({
  profile,
  results,
  countrySlug,
}: {
  profile: CompanyProfile;
  results: InstrumentResult[];
  countrySlug: string;
}) {
  const phases = buildRoadmap(countrySlug, results, profile);
  if (phases.length === 0) return null;
  const country = getCountry(countrySlug);

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        A suggested sequence for <span aria-hidden="true">{country?.flag_emoji}</span>{' '}
        {country?.name} — legal steps and instruments merged into the order you would actually
        tackle them.
      </p>
      <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
        {phases.map((ph, idx) => (
          <li key={ph.id} className="ml-6 print-break-inside-avoid">
            <span className="absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-semibold">
              {idx + 1}
            </span>
            <h3 className="font-semibold text-slate-900">{ph.title}</h3>
            <p className="text-xs text-slate-500 mb-2">{ph.summary}</p>
            <ul className="space-y-1.5">
              {ph.steps.map((s, si) => (
                <li key={si} className="text-sm text-slate-700 flex flex-wrap items-baseline gap-x-2">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      s.kind === 'instrument' ? 'bg-blue-600' : 'bg-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  {s.href ? (
                    <a href={s.href} className="font-medium hover:text-blue-900 hover:underline">
                      {s.title}
                    </a>
                  ) : (
                    <span className="font-medium">{s.title}</span>
                  )}
                  <span className="text-xs text-slate-400">· {s.timeline}</span>
                  <span className="basis-full pl-3.5 text-xs text-slate-500">{s.detail}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Ecosystem fit (Deltas)
// ---------------------------------------------------------------------------

export function EcosystemFitView({
  profile,
  countrySlug,
}: {
  profile: CompanyProfile;
  countrySlug: string;
}) {
  const fit = ecosystemFit(countrySlug, profile);
  if (fit.matches.length === 0 && fit.unmatchedSectors.length === 0) return null;
  const pct = Math.round(fit.coverage * 100);
  const band = pct >= 67 ? 'strong' : pct >= 34 ? 'partial' : 'limited';
  const bandColor =
    band === 'strong'
      ? 'text-emerald-700'
      : band === 'partial'
        ? 'text-amber-700'
        : 'text-slate-500';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 print-break-inside-avoid">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-900 text-sm">Ecosystem fit for your sectors</h3>
        <span className={`text-xs font-semibold ${bandColor}`}>
          {pct}% sector coverage · {band}
        </span>
      </div>
      {fit.matches.length > 0 ? (
        <ul className="space-y-1.5">
          {fit.matches.map((m) => (
            <li key={m.ecosystemName} className="text-sm text-slate-700">
              <span className="font-medium">{m.ecosystemName}</span>{' '}
              <span className="text-slate-400 text-xs">({m.city})</span>
              <span className="block text-xs text-slate-500">
                matches your {m.matchedSectors.map((s) => sectorLabels[s]).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          No seeded regional cluster in this country matches your selected sectors.
        </p>
      )}
      {fit.unmatchedSectors.length > 0 && (
        <p className="mt-2 text-xs text-amber-700">
          Not covered locally: {fit.unmatchedSectors.map((s) => sectorLabels[s]).join(', ')}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Excluded instruments ("why doesn't this appear?")
// ---------------------------------------------------------------------------

export function ExcludedInstruments({ excluded }: { excluded: ExcludedInstrument[] }) {
  if (excluded.length === 0) return null;
  return (
    <details className="rounded-lg border border-slate-200 bg-white group">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-800 flex items-center justify-between">
        <span>Excluded instruments and why ({excluded.length})</span>
        <span className="text-slate-400 text-xs group-open:hidden">Show</span>
        <span className="text-slate-400 text-xs hidden group-open:inline">Hide</span>
      </summary>
      <ul className="border-t border-slate-100 divide-y divide-slate-100">
        {excluded.map(({ instrument: i, reason }) => {
          const country = getCountry(i.country);
          return (
            <li key={i.slug} className="px-4 py-2.5 flex flex-wrap items-baseline gap-x-2 text-sm">
              <span
                className={`w-1.5 h-1.5 rounded-full ${instrumentTypeColors[i.instrument_type].dot}`}
                aria-hidden="true"
              />
              <a href={`/instrument/${i.slug}`} className="font-medium text-slate-800 hover:text-blue-900 hover:underline">
                {country?.flag_emoji} {i.name}
              </a>
              <span className="basis-full pl-3.5 text-xs text-slate-500">{reason}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
