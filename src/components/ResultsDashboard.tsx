import { useMemo } from 'react';
import type { CompanyProfile } from '../lib/types';
import {
  getExcludedInstruments,
  getRelevantInstruments,
  groupResultsByCountry,
} from '../lib/engine';
import { decodeProfileHash, loadEstimateInputs, profileFromParams } from '../lib/profile';
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
 * Personalized instrument dashboard. The full profile — including the
 * support-estimate inputs — is decoded from the URL fragment (`#p=...`),
 * which browsers never send to a server, so a shared link reproduces the
 * complete result for whoever opens it without those figures ever
 * appearing in a server/proxy access log. Query params (coarse fields
 * only) and this tab's sessionStorage are the fallback for links that
 * predate the fragment, or don't carry one (e.g. from /compare).
 */
export default function ResultsDashboard() {
  const profile: CompanyProfile = useMemo(() => {
    const fromHash = decodeProfileHash(window.location.hash);
    if (fromHash) return fromHash;
    const base = profileFromParams(new URLSearchParams(window.location.search));
    return { ...base, ...loadEstimateInputs() };
  }, []);

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
        <div>
          <p className="eyebrow mb-1">Dashboard</p>
          <h1 className="text-2xl text-slate-900">Your instruments</h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print rounded-lg border hairline bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ⬇ Export PDF
        </button>
      </div>

      <ProfileSummary profile={profile} />

      {results.length === 0 ? (
        <div className="rounded-lg border hairline bg-slate-50 p-8 text-center text-slate-500">
          No matches. <a href="/wizard" className="text-blue-800 underline">Adjust profile</a> or check{' '}
          <a href="/methodology" className="text-blue-800 underline">coverage notes</a>.
        </div>
      ) : (
        <>
          {/* 1. Support estimate (Rechnung) */}
          <section>
            <h2 className="text-lg text-slate-900 mb-1 tick">Support estimate</h2>
            <p className="text-sm text-slate-500 mb-4">
              📊 Rough annual figure per country — visible assumptions, not tax advice.
            </p>
            <EstimatePanel profile={profile} results={results} countrySlugs={targetSlugs} />
          </section>

          {targetSlugs.length >= 2 && (
            <section>
              <h2 className="text-lg text-slate-900 mb-1 tick">Country comparison</h2>
              <p className="text-sm text-slate-500 mb-4">
                <span className="mono">{results.length}</span> instruments match your profile across{' '}
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
                <h2 className="text-lg text-slate-900 flex items-center gap-2 tick">
                  <span aria-hidden="true">{country?.flag_emoji}</span>
                  {isEU ? 'EU-level' : country?.name}
                  <span className="mono text-xs font-normal text-slate-400">{items.length}</span>
                </h2>

                {!isEU && <EcosystemFitView profile={profile} countrySlug={slug} />}

                <div className="space-y-3">
                  {items.map((r) => (
                    <InstrumentCard key={r.instrument.slug} result={r} />
                  ))}
                </div>

                {!isEU && (
                  <details className="rounded-lg border hairline bg-white group">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-800 flex items-center justify-between">
                      <span>🧭 Roadmap — {country?.name}</span>
                      <span className="label-mono text-slate-400 group-open:hidden">Show</span>
                      <span className="label-mono text-slate-400 hidden group-open:inline">Hide</span>
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
        Ranked: rule-based &gt; discretionary, active &gt; proposed, weighted by fiscal impact. See{' '}
        <a href="/methodology" className="underline">methodology</a>.
      </p>
    </div>
  );
}
