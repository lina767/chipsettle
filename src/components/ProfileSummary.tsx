import type { CompanyProfile } from '../lib/types';
import {
  businessModelLabels,
  companySizeLabels,
  goalLabels,
  hqCountryLabels,
  industryLabels,
  revenueBandLabels,
  sectorLabels,
} from '../lib/labels';
import { getCountry, seededCountrySlugs } from '../data/countries';

export default function ProfileSummary({ profile }: { profile: CompanyProfile }) {
  const targets =
    profile.targetCountries.length > 0 ? profile.targetCountries : seededCountrySlugs;
  const chips = [
    `HQ: ${hqCountryLabels[profile.hqCountry]}`,
    businessModelLabels[profile.businessModel],
    companySizeLabels[profile.companySize].split(' (')[0],
    `Revenue ${revenueBandLabels[profile.revenue]}`,
    ...profile.sectors.map((s) => sectorLabels[s]),
    ...profile.industries.map((i) => industryLabels[i]),
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-900">
          {goalLabels[profile.goal]}
          <span className="text-slate-400 mx-2">·</span>
          <span className="font-normal">
            {targets
              .map((slug) => {
                const c = getCountry(slug);
                return c ? `${c.flag_emoji} ${c.name}` : slug;
              })
              .join('  ')}
          </span>
        </div>
        <a
          href="/wizard"
          className="no-print text-xs text-blue-800 hover:underline whitespace-nowrap"
        >
          Edit profile ↺
        </a>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
