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
 * Profile <-> URL serialization.
 *
 * The shareable link must reproduce the *complete* result for whoever
 * opens it — including the support-estimate inputs (R&D headcount,
 * personnel cost, IP-income share), which are the only fields with real
 * business sensitivity. To do that without those figures ever touching a
 * server, they are split across two channels:
 *
 *  - Coarse, non-sensitive fields (HQ country, size class, revenue *band*,
 *    sectors, goal, target countries) go in the URL **query string** —
 *    sent to the server on every request, but low-sensitivity by design.
 *  - The full profile, sensitive figures included, is also encoded as a
 *    base64url JSON blob in the URL **fragment** (`#p=...`). Browsers
 *    never transmit the fragment to a server — it is stripped before the
 *    HTTP request is sent — so it never appears in Vercel/CDN/proxy access
 *    logs, regardless of who forwards the link. Whoever opens the link
 *    still sees the full dashboard, estimate included, because their own
 *    browser decodes the fragment client-side.
 *
 * Honest limits: this is encoding, not encryption. The fragment is fully
 * readable by anyone who has the link (that is the point of sharing) and
 * remains in that person's own browser history. It only protects against
 * the figures being logged/stored by infrastructure we don't control.
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
  // rdEngineers / rdPersonnelCost / ipSharePct intentionally omitted — see
  // module doc comment. They travel only in the URL fragment (see below).
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
  return {
    hqCountry: pick(params.get('hq'), HQ, defaultProfile.hqCountry),
    businessModel: pick(params.get('bm'), BM, defaultProfile.businessModel),
    companySize: pick(params.get('size'), SIZE, defaultProfile.companySize),
    revenue: pick(params.get('rev'), REV, defaultProfile.revenue),
    sectors: sectors.length > 0 ? sectors : defaultProfile.sectors,
    industries,
    goal: pick(params.get('goal'), GOALS, defaultProfile.goal),
    targetCountries: countries, // empty = compare all available
  };
}

// ---------------------------------------------------------------------------
// Full profile in the URL fragment — the actual "complete result" share
// mechanism. Never sent to any server (browsers strip everything from
// '#' onward before issuing the HTTP request).
// ---------------------------------------------------------------------------

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Encode the complete profile (incl. sensitive estimate inputs) for the fragment. */
export function encodeProfileHash(p: CompanyProfile): string {
  return toBase64Url(JSON.stringify(p));
}

/** Decode a `#p=...` fragment back into a full profile, or null if absent/invalid. */
export function decodeProfileHash(hash: string): CompanyProfile | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const match = /(?:^|&)p=([^&]+)/.exec(raw);
  if (!match) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(match[1]));
    if (!parsed || typeof parsed !== 'object' || typeof parsed.hqCountry !== 'string') return null;
    return parsed as CompanyProfile;
  } catch {
    return null;
  }
}

/**
 * Build the canonical shareable results URL: coarse fields in the query
 * string (server-visible, low-sensitivity), the complete profile in the
 * fragment (client-only, carries the sensitive estimate figures).
 */
export function buildResultsUrl(p: CompanyProfile): string {
  return `/results?${profileToParams(p).toString()}#p=${encodeProfileHash(p)}`;
}

// ---------------------------------------------------------------------------
// Estimate inputs (sensitive numbers) — sessionStorage convenience only,
// for prefilling the wizard again within the same tab. The actual sharing
// path is the URL fragment above; sessionStorage never leaves the browser
// either way.
// ---------------------------------------------------------------------------

const ESTIMATE_STORAGE_KEY = 'chipsettle:estimate-inputs';

export interface EstimateInputs {
  rdEngineers?: number;
  rdPersonnelCost?: number;
  ipSharePct?: number;
}

export function saveEstimateInputs(inputs: EstimateInputs): void {
  if (typeof window === 'undefined') return;
  const { rdEngineers, rdPersonnelCost, ipSharePct } = inputs;
  const hasAny =
    (rdEngineers != null && rdEngineers > 0) ||
    (rdPersonnelCost != null && rdPersonnelCost > 0) ||
    (ipSharePct != null && ipSharePct > 0);
  try {
    if (hasAny) {
      window.sessionStorage.setItem(
        ESTIMATE_STORAGE_KEY,
        JSON.stringify({ rdEngineers, rdPersonnelCost, ipSharePct }),
      );
    } else {
      window.sessionStorage.removeItem(ESTIMATE_STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (e.g. private-browsing quota) — fail silently,
    // the estimate step is optional.
  }
}

export function loadEstimateInputs(): EstimateInputs {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(ESTIMATE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      rdEngineers: typeof parsed.rdEngineers === 'number' ? parsed.rdEngineers : undefined,
      rdPersonnelCost: typeof parsed.rdPersonnelCost === 'number' ? parsed.rdPersonnelCost : undefined,
      ipSharePct: typeof parsed.ipSharePct === 'number' ? parsed.ipSharePct : undefined,
    };
  } catch {
    return {};
  }
}
