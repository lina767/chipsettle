import { useState } from 'react';
import type {
  BusinessModel,
  CompanyProfile,
  CompanySize,
  Goal,
  HqCountry,
  RevenueBand,
  Sector,
} from '../lib/types';
import {
  businessModelLabels,
  companySizeLabels,
  goalLabels,
  hqCountryLabels,
  revenueBandLabels,
  sectorLabels,
} from '../lib/labels';
import { defaultProfile, profileToParams } from '../lib/profile';
import { targetableCountries } from '../data/countries';

const steps = [
  'Company basics',
  'Scale & economics',
  'What are you looking for?',
  'Target countries',
];

function OptionButton({
  selected,
  onClick,
  children,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors ${
        selected
          ? 'border-blue-800 bg-blue-50 text-blue-950 ring-1 ring-blue-800'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span className="font-medium">{children}</span>
      {hint && <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>}
    </button>
  );
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        selected
          ? 'border-blue-800 bg-blue-800 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">{label}</h3>
      {children}
    </div>
  );
}

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CompanyProfile>({
    ...defaultProfile,
    sectors: [],
    targetCountries: [],
  });
  const [compareAll, setCompareAll] = useState(false);

  const set = <K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleSector = (s: Sector) =>
    set(
      'sectors',
      profile.sectors.includes(s)
        ? profile.sectors.filter((x) => x !== s)
        : [...profile.sectors, s],
    );

  const toggleCountry = (slug: string) => {
    setCompareAll(false);
    set(
      'targetCountries',
      profile.targetCountries.includes(slug)
        ? profile.targetCountries.filter((x) => x !== slug)
        : [...profile.targetCountries, slug],
    );
  };

  const setNum = (key: 'rdEngineers' | 'rdPersonnelCost' | 'ipSharePct', raw: string) => {
    const v = raw === '' ? undefined : Number(raw);
    set(key, Number.isFinite(v as number) ? (v as number) : undefined);
  };

  const step1Valid = profile.sectors.length > 0;
  const lastStep = steps.length - 1;
  const stepCountriesValid = compareAll || profile.targetCountries.length > 0;

  const finish = () => {
    const finalProfile: CompanyProfile = compareAll
      ? { ...profile, targetCountries: [] }
      : profile;
    window.location.href = `/results?${profileToParams(finalProfile).toString()}`;
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <ol className="flex items-center gap-2 mb-8" aria-label="Wizard progress">
        {steps.map((label, i) => (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= step ? 'bg-blue-800' : 'bg-slate-200'}`}
            />
            <span
              className={`mt-1.5 hidden sm:block text-xs ${
                i === step ? 'text-blue-900 font-medium' : 'text-slate-400'
              }`}
            >
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="text-xl font-semibold text-slate-900 mb-6 sm:hidden">
        {step + 1}. {steps[step]}
      </h2>

      {step === 0 && (
        <div className="space-y-8">
          <Field label="Country of headquarters">
            <select
              value={profile.hqCountry}
              onChange={(e) => set('hqCountry', e.target.value as HqCountry)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {(Object.keys(hqCountryLabels) as HqCountry[]).map((k) => (
                <option key={k} value={k}>
                  {hqCountryLabels[k]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Business model">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(businessModelLabels) as BusinessModel[]).map((k) => (
                <OptionButton
                  key={k}
                  selected={profile.businessModel === k}
                  onClick={() => set('businessModel', k)}
                >
                  {businessModelLabels[k]}
                </OptionButton>
              ))}
            </div>
          </Field>

          <Field label="Company size">
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(companySizeLabels) as CompanySize[]).map((k) => (
                <OptionButton
                  key={k}
                  selected={profile.companySize === k}
                  onClick={() => set('companySize', k)}
                >
                  {companySizeLabels[k]}
                </OptionButton>
              ))}
            </div>
          </Field>

          <Field label="Annual group revenue">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(revenueBandLabels) as RevenueBand[]).map((k) => (
                <ChipButton
                  key={k}
                  selected={profile.revenue === k}
                  onClick={() => set('revenue', k)}
                >
                  {revenueBandLabels[k]}
                </ChipButton>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              The €750M threshold matters: above it, Pillar Two (15% global minimum tax) bounds
              the benefit of preferential IP regimes.
            </p>
          </Field>

          <Field label="Sector focus (select all that apply)">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(sectorLabels) as Sector[]).map((k) => (
                <ChipButton key={k} selected={profile.sectors.includes(k)} onClick={() => toggleSector(k)}>
                  {sectorLabels[k]}
                </ChipButton>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Optional — fill these in to get a rough <strong>support estimate</strong> per country on
            your dashboard. Skip to leave the estimate out; everything else works without it.
          </div>
          <Field label="Planned R&D engineers at the site">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={profile.rdEngineers ?? ''}
              onChange={(e) => setNum('rdEngineers', e.target.value)}
              placeholder="e.g. 25"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            />
          </Field>
          <Field label="Approximate annual R&D personnel cost (€)">
            <input
              type="number"
              min={0}
              step={10000}
              inputMode="numeric"
              value={profile.rdPersonnelCost ?? ''}
              onChange={(e) => setNum('rdPersonnelCost', e.target.value)}
              placeholder="e.g. 3000000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            />
            <p className="text-xs text-slate-500 mt-2">
              Fully loaded. Left blank, we assume €110k per engineer.
            </p>
          </Field>
          <Field label="Share of revenue that is licensable IP income (%)">
            <input
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={profile.ipSharePct ?? ''}
              onChange={(e) => setNum('ipSharePct', e.target.value)}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            />
            <p className="text-xs text-slate-500 mt-2">
              Used to estimate IP-box savings. Combined with your revenue band midpoint.
            </p>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-2">
          <Field label="What are you looking for?">
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(goalLabels) as Goal[]).map((k) => (
                <OptionButton
                  key={k}
                  selected={profile.goal === k}
                  onClick={() => set('goal', k)}
                  hint={
                    k === 'design_site'
                      ? 'The primary use case: fiscal, funding, talent, and legal instruments for a new design center.'
                      : undefined
                  }
                >
                  {goalLabels[k]}
                </OptionButton>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Field label="Target countries (select one or more)">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {targetableCountries.map((c) => (
                <OptionButton
                  key={c.slug}
                  selected={!compareAll && profile.targetCountries.includes(c.slug)}
                  onClick={() => toggleCountry(c.slug)}
                >
                  {c.flag_emoji} {c.name}
                </OptionButton>
              ))}
            </div>
          </Field>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <OptionButton
            selected={compareAll}
            onClick={() => {
              setCompareAll(!compareAll);
              if (!compareAll) set('targetCountries', []);
            }}
            hint="Shows every country with verified instruments in the database."
          >
            🌍 Compare all available countries
          </OptionButton>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          Back
        </button>
        {step < lastStep ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !step1Valid}
            className="rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-800"
          >
            {step === 0 && !step1Valid ? 'Select at least one sector' : 'Continue'}
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={!stepCountriesValid}
            className="rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-800"
          >
            {stepCountriesValid ? 'Show my instruments →' : 'Select at least one country'}
          </button>
        )}
      </div>
    </div>
  );
}
