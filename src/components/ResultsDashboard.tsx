import { useMemo } from 'react';
import type { CompanyProfile } from '../lib/types';
import {
  getExcludedInstruments,
  getRelevantInstruments,
  groupResultsByCountry,
} from '../lib/engine';
import { profileFromParams } from '../lib/profile';
import { getCountry, seededCountrySlugs } from '../data/countries';
import ProfileSummary from './ProfileSummary';
import ComparisonTable from './ComparisonTable';
import InstrumentCard from './InstrumentCard';
import {
  EcosystemFitView,
  EstimatePanel,
  ExcludedInstruments,
  RoadmapView,
} from './AnalysisSections';

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
  const excluded = useMemo(() => getExcludedInstruments(profile), [profile]);
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
          {/* 1. Support estimate (Rechnung) */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Rough support estimate
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Estimated annual public support per country for your profile — an orientation figure
              with visible assumptions, not tax advice.
            </p>
            <EstimatePanel profile={profile} results={results} countrySlugs={targetSlugs} />
          </section>

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
            const isEU = slug === 'eu';
            return (
              <section key={slug} className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <span aria-hidden="true">{country?.flag_emoji}</span>
                  {isEU ? 'EU-level instruments' : country?.name}
                  <span className="text-sm font-normal text-slate-400">
                    {items.length} instrument{items.length === 1 ? '' : 's'}
                  </span>
                </h2>

                {!isEU && <EcosystemFitView profile={profile} countrySlug={slug} />}

                <div className="space-y-3">
                  {items.map((r) => (
                    <InstrumentCard key={r.instrument.slug} result={r} />
                  ))}
                </div>

                {!isEU && (
                  <details className="rounded-lg border border-slate-200 bg-white group">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-800 flex items-center justify-between">
                      <span>Action roadmap for {country?.name}</span>
                      <span className="text-slate-400 text-xs group-open:hidden">Show sequence</span>
                      <span className="text-slate-400 text-xs hidden group-open:inline">Hide</span>
                    </summary>
                    <div className="border-t border-slate-100 p-4">
                      <RoadmapView profile={profile} results={results} countrySlug={slug} />
                    </div>
                  </details>
                )}
              </section>
            );
          })}

          {/* 6. Excluded instruments ("why doesn't this appear?") */}
          <section>
            <ExcludedInstruments excluded={excluded} />
          </section>
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
