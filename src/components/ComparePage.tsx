import { useMemo, useState } from 'react';
import type { CompanyProfile } from '../lib/types';
import { getRelevantInstruments } from '../lib/engine';
import { profileFromParams, profileToParams } from '../lib/profile';
import { seededCountrySlugs, targetableCountries } from '../data/countries';
import ProfileSummary from './ProfileSummary';
import ComparisonTable from './ComparisonTable';

/**
 * Standalone comparison view: side-by-side countries for the profile in the
 * URL (or a sensible default profile), with quick country toggling.
 */
export default function ComparePage() {
  const initialProfile: CompanyProfile = useMemo(
    () => profileFromParams(new URLSearchParams(window.location.search)),
    [],
  );
  const [selected, setSelected] = useState<string[]>(
    initialProfile.targetCountries.length > 0
      ? initialProfile.targetCountries
      : seededCountrySlugs,
  );

  const profile: CompanyProfile = { ...initialProfile, targetCountries: selected };
  const results = useMemo(() => getRelevantInstruments(profile), [selected.join(',')]);

  const toggle = (slug: string) => {
    const next = selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected, slug];
    if (next.length === 0) return; // keep at least one column
    setSelected(next);
    const params = profileToParams({ ...profile, targetCountries: next });
    history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Compare</p>
          <h1 className="text-2xl text-slate-900">Country comparison</h1>
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

      <div className="no-print flex flex-wrap gap-2" role="group" aria-label="Countries to compare">
        {targetableCountries.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => toggle(c.slug)}
            aria-pressed={selected.includes(c.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              selected.includes(c.slug)
                ? 'border-blue-800 bg-blue-800 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {c.flag_emoji} {c.name}
          </button>
        ))}
      </div>

      <ComparisonTable profile={profile} results={results} countrySlugs={selected} />

      <p className="text-sm text-slate-500">
        <a href="/wizard" className="text-blue-800 underline">Run the wizard →</a> to tailor this, or open the{' '}
        <a href={`/results?${profileToParams(profile).toString()}`} className="text-blue-800 underline">full dashboard</a>.
      </p>
    </div>
  );
}
