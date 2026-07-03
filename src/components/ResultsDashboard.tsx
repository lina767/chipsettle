import { useMemo } from 'react';
import type { CompanyProfile } from '../lib/types';
import { getRelevantInstruments, groupResultsByCountry } from '../lib/engine';
import { profileFromParams } from '../lib/profile';
import { getCountry, seededCountrySlugs } from '../data/countries';
import ProfileSummary from './ProfileSummary';
import ComparisonTable from './ComparisonTable';
import InstrumentCard from './InstrumentCard';

/**
 * Personalized instrument dashboard. The profile is read from URL query
 * parameters so results are shareable links; the comparison view is the
 * default output when multiple countries are selected.
 */
export default function ResultsDashboard() {
  const profile: CompanyProfile = useMemo(
    () => profileFromParams(new URLSearchParams(window.location.search)),
    [],
  );

  const results = useMemo(() => getRelevantInstruments(profile), [profile]);
  const targetSlugs =
    profile.targetCountries.length > 0 ? profile.targetCountries : seededCountrySlugs;
  const grouped = groupResultsByCountry(results);

  // National groups in target order, EU level last.
  const groupOrder = [...targetSlugs.filter((s) => grouped.has(s)), 'eu'].filter(
    (s, idx, arr) => arr.indexOf(s) === idx && grouped.has(s),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Your instrument dashboard
        </h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ⬇ Export PDF summary
        </button>
      </div>

      <ProfileSummary profile={profile} />

      {results.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No instruments in the database match this profile.{' '}
          <a href="/wizard" className="text-blue-800 underline">
            Adjust your profile
          </a>{' '}
          or check the{' '}
          <a href="/methodology" className="text-blue-800 underline">
            coverage notes
          </a>
          .
        </div>
      ) : (
        <>
          {targetSlugs.length >= 2 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Country comparison for your profile
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                {results.length} instruments match your profile across{' '}
                {targetSlugs.length} countries plus the EU level. Click any instrument for
                full parameters, legal basis, and changelog.
              </p>
              <ComparisonTable
                profile={profile}
                results={results}
                countrySlugs={targetSlugs}
              />
            </section>
          )}

          {groupOrder.map((slug) => {
            const country = getCountry(slug);
            const items = grouped.get(slug)!;
            return (
              <section key={slug}>
                <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">{country?.flag_emoji}</span>
                  {slug === 'eu' ? 'EU-level instruments' : country?.name}
                  <span className="text-sm font-normal text-slate-400">
                    {items.length} instrument{items.length === 1 ? '' : 's'}
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.map((r) => (
                    <InstrumentCard key={r.instrument.slug} result={r} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        Ranked by relevance for your profile: rule-based entitlements before discretionary
        programs, active before proposed, weighted by fiscal impact. See{' '}
        <a href="/methodology" className="underline">
          methodology
        </a>{' '}
        for the exact scoring.
      </p>
    </div>
  );
}
