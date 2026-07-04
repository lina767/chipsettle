import type {
  BusinessModel,
  CompanyProfile,
  CompanySize,
  Goal,
  HqCountry,
  Industry,
  RevenueBand,
  Sector,
} from './types';

/**
 * Profile <-> URL query string serialization.
 * Profiles live in the URL so results are shareable and no accounts are
 * needed (deliberate v1 constraint).
 */

export const defaultProfile: CompanyProfile = {
  hqCountry: 'usa',
  businessModel: 'fabless',
  companySize: 'sme',
  revenue: '50_250m',
  sectors: ['logic'],
  industries: [],
  goal: 'design_site',
  targetCountries: ['germany', 'netherlands', 'france'],
};

export function profileToParams(p: CompanyProfile): URLSearchParams {
  const params = new URLSearchParams();
  params.set('hq', p.hqCountry);
  params.set('bm', p.businessModel);
  params.set('size', p.companySize);
  params.set('rev', p.revenue);
  params.set('sectors', p.sectors.join(','));
  if (p.industries.length > 0) params.set('industries', p.industries.join(','));
  params.set('goal', p.goal);
  params.set('countries', p.targetCountries.join(','));
  if (p.rdEngineers != null && p.rdEngineers > 0) params.set('eng', String(p.rdEngineers));
  if (p.rdPersonnelCost != null && p.rdPersonnelCost > 0)
    params.set('cost', String(p.rdPersonnelCost));
  if (p.ipSharePct != null && p.ipSharePct > 0) params.set('ip', String(p.ipSharePct));
  return params;
}

const HQ: HqCountry[] = ['usa', 'canada', 'uk', 'taiwan', 'south_korea', 'japan', 'israel', 'eu', 'other'];
const BM: BusinessModel[] = ['fabless', 'ip_licensing', 'idm', 'osat', 'equipment', 'materials', 'eda_tools'];
const SIZE: CompanySize[] = ['startup', 'sme', 'midcap', 'large'];
const REV: RevenueBand[] = ['lt_10m', '10_50m', '50_250m', '250_750m', 'gt_750m'];
const SECTORS: Sector[] = [
  'logic', 'analog_mixed_signal', 'power', 'photonics', 'mems_sensors', 'rf_mmwave',
  'riscv_open_isa', 'eda_design_tools', 'advanced_packaging', 'memory', 'ai_accelerators',
];
const GOALS: Goal[] = ['design_site', 'rd_cooperation', 'fab_site', 'pilot_lines', 'ip_domiciliation'];
const INDUSTRIES: Industry[] = [
  'automotive', 'robotics', 'consumer_electronics', 'industrial_automation',
  'aerospace_defense', 'telecom_5g', 'data_center_hpc', 'medical_devices', 'biotech', 'energy_grid', 'other',
];

function pick<T extends string>(value: string | null, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function profileFromParams(params: URLSearchParams): CompanyProfile {
  const sectors = (params.get('sectors') ?? '')
    .split(',')
    .filter((s): s is Sector => SECTORS.includes(s as Sector));
  const industries = (params.get('industries') ?? '')
    .split(',')
    .filter((s): s is Industry => INDUSTRIES.includes(s as Industry));
  const countries = (params.get('countries') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const num = (key: string): number | undefined => {
    const v = Number(params.get(key));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  return {
    hqCountry: pick(params.get('hq'), HQ, defaultProfile.hqCountry),
    businessModel: pick(params.get('bm'), BM, defaultProfile.businessModel),
    companySize: pick(params.get('size'), SIZE, defaultProfile.companySize),
    revenue: pick(params.get('rev'), REV, defaultProfile.revenue),
    sectors: sectors.length > 0 ? sectors : defaultProfile.sectors,
    industries,
    goal: pick(params.get('goal'), GOALS, defaultProfile.goal),
    targetCountries: countries, // empty = compare all available
    rdEngineers: num('eng'),
    rdPersonnelCost: num('cost'),
    ipSharePct: num('ip'),
  };
}
