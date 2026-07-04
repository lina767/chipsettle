import type {
  CompanyProfile,
  CountryEstimate,
  EcosystemFit,
  EstimateLine,
  Industry,
  Instrument,
  InstrumentResult,
  RoadmapPhase,
  RoadmapStep,
  Sector,
} from './types';
import { getCountry } from '../data/countries';
import { ecosystemsByCountry } from '../data/ecosystems';
import { legalStepsByCountry } from '../data/legalSteps';
import { entityKindLabels, legalStepTypeLabels } from './labels';

/**
 * Derived analyses on top of the decision-engine results:
 * a rough support estimate, a sequenced action roadmap, ecosystem fit, and
 * conditional-eligibility reasons. All figures here are deliberately coarse —
 * orientation, never advice.
 */

// ---------------------------------------------------------------------------
// Shared assumptions (surfaced in the UI so they are auditable)
// ---------------------------------------------------------------------------

/** Revenue-band midpoints in € for the IP-income assumption. */
export const REVENUE_MIDPOINT_EUR: Record<CompanyProfile['revenue'], number> = {
  lt_10m: 5_000_000,
  '10_50m': 30_000_000,
  '50_250m': 150_000_000,
  '250_750m': 500_000_000,
  gt_750m: 1_200_000_000,
};

/** Fallback fully-loaded cost per R&D engineer when no cost figure is given. */
export const DEFAULT_COST_PER_ENGINEER_EUR = 110_000;

/** The €750M Pillar Two threshold and 15% GloBE floor. */
export const PILLAR_TWO_THRESHOLD_EUR = 750_000_000;
export const GLOBE_FLOOR = 0.15;

export function hasEstimateInputs(p: CompanyProfile): boolean {
  return (
    (p.rdPersonnelCost != null && p.rdPersonnelCost > 0) ||
    (p.rdEngineers != null && p.rdEngineers > 0)
  );
}

/** R&D personnel cost base used across the estimate. */
export function personnelBase(p: CompanyProfile): number {
  if (p.rdPersonnelCost && p.rdPersonnelCost > 0) return p.rdPersonnelCost;
  if (p.rdEngineers && p.rdEngineers > 0)
    return p.rdEngineers * DEFAULT_COST_PER_ENGINEER_EUR;
  return 0;
}

/** Assumed annual licensable IP income. */
export function ipIncome(p: CompanyProfile): number {
  if (!p.ipSharePct || p.ipSharePct <= 0) return 0;
  return (p.ipSharePct / 100) * REVENUE_MIDPOINT_EUR[p.revenue];
}

function isSme(p: CompanyProfile): boolean {
  return p.companySize === 'startup' || p.companySize === 'sme';
}

// ---------------------------------------------------------------------------
// 1. Support estimate (Rechnung)
// ---------------------------------------------------------------------------

function estimateLine(
  i: Instrument,
  p: CompanyProfile,
): { amount: number; basis: string; rough: boolean } | null {
  const e = i.estimate;
  if (!e) return null;
  const base = personnelBase(p);

  if (e.kind === 'rd_credit') {
    if (base <= 0) return null;
    const rate = isSme(p) ? e.rateSme ?? e.rate ?? 0 : e.rate ?? 0;
    const cap = isSme(p) ? e.capSme : e.capLarge;
    let amount = rate * base;
    let basis = `${Math.round(rate * 100)}% of €${fmtEur(base)} R&D personnel cost`;
    if (cap != null && amount > cap) {
      amount = cap;
      basis += `, capped at €${fmtEur(cap)}/yr`;
    }
    return { amount, basis, rough: !!e.rough };
  }

  if (e.kind === 'payroll') {
    if (base <= 0) return null;
    const rate = e.rate ?? 0;
    return {
      amount: rate * base,
      basis: `~${Math.round(rate * 100)}% of €${fmtEur(base)} R&D personnel cost`,
      rough: true, // payroll rates are always indicative here
    };
  }

  if (e.kind === 'ip_box') {
    const income = ipIncome(p);
    if (income <= 0 || e.effRate == null) return null;
    const country = getCountry(i.country);
    const headline = (country?.general_corporate_tax_rate ?? 0) / 100;
    const overThreshold =
      REVENUE_MIDPOINT_EUR[p.revenue] >= PILLAR_TWO_THRESHOLD_EUR ||
      p.revenue === 'gt_750m';
    const effectiveFloor = overThreshold ? Math.max(e.effRate, GLOBE_FLOOR) : e.effRate;
    const saving = Math.max(0, headline - effectiveFloor) * income;
    let basis = `(${Math.round(headline * 100)}% headline − ${Math.round(
      effectiveFloor * 100,
    )}% IP rate) on €${fmtEur(income)} IP income`;
    if (overThreshold && e.effRate < GLOBE_FLOOR) {
      basis += ' — floored at 15% (Pillar Two)';
    }
    return { amount: saving, basis, rough: !!e.rough };
  }

  return null;
}

/**
 * Build a rough support estimate for one country from its result set.
 * Only rule-based / hybrid instruments are quantified; discretionary programs
 * are counted separately as "potential competitive funding".
 */
export function estimateForCountry(
  countrySlug: string,
  results: InstrumentResult[],
  p: CompanyProfile,
): CountryEstimate {
  const lines: EstimateLine[] = [];
  let competitiveCount = 0;

  for (const r of results) {
    if (r.instrument.country !== countrySlug) continue;
    if (r.eligibility_status === 'not_eligible') continue;
    if (r.instrument.mechanism === 'discretionary') {
      if (r.instrument.estimate == null) competitiveCount += 1;
      continue;
    }
    const line = estimateLine(r.instrument, p);
    if (line && line.amount > 0) {
      lines.push({
        instrument: r.instrument,
        amount: line.amount,
        basis: line.basis,
        rough: line.rough,
      });
    }
  }

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const base = personnelBase(p);
  const income = ipIncome(p);
  // Effective support rate is measured against the combined base the support
  // actually applies to (R&D personnel cost + assumed IP income), so an
  // IP-box-dominated result does not produce a nonsensical >100% rate.
  const denom = base + income;
  return {
    countrySlug,
    lines: lines.sort((a, b) => b.amount - a.amount),
    total,
    effectiveRatePct: denom > 0 ? (total / denom) * 100 : null,
    personnelBase: base,
    ipIncome: income,
    competitiveCount,
  };
}

function fmtEur(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${Math.round(n)}`;
}

export const formatEurShort = fmtEur;

// ---------------------------------------------------------------------------
// 2. Ecosystem fit (Deltas)
// ---------------------------------------------------------------------------

export function ecosystemFit(countrySlug: string, p: CompanyProfile): EcosystemFit {
  const ecos = ecosystemsByCountry(countrySlug);
  const matchedSectors = new Set<Sector>();
  const matchedIndustries = new Set<Industry>();
  const matches = ecos
    .map((e) => {
      const ms = p.sectors.filter((s) => e.strengths.includes(s));
      const mi = p.industries.filter((ind) => e.industries.includes(ind));
      ms.forEach((s) => matchedSectors.add(s));
      mi.forEach((ind) => matchedIndustries.add(ind));
      return {
        ecosystemName: e.name,
        city: e.city,
        matchedSectors: ms,
        matchedIndustries: mi,
        senior_engineer_cost_eur: e.senior_engineer_cost_eur,
      };
    })
    .filter((m) => m.matchedSectors.length > 0 || m.matchedIndustries.length > 0);

  const unmatchedSectors = p.sectors.filter((s) => !matchedSectors.has(s));
  const unmatchedIndustries = p.industries.filter((i) => !matchedIndustries.has(i));
  const total = p.sectors.length + p.industries.length;
  const coverage = total > 0 ? (matchedSectors.size + matchedIndustries.size) / total : 0;

  return { countrySlug, coverage, matches, unmatchedSectors, unmatchedIndustries };
}

// ---------------------------------------------------------------------------
// 3. Roadmap (Handlungspfad) — merge instruments + legal steps into a sequence
// ---------------------------------------------------------------------------

const PHASE_META: Record<
  RoadmapPhase['id'],
  { title: string; summary: string }
> = {
  establish: {
    title: 'Establish the entity',
    summary: 'Create the local legal presence that will be the applicant for every instrument.',
  },
  staff: {
    title: 'Bring in the team',
    summary: 'Work permits and compensation instruments for relocating and hiring design talent.',
  },
  certify_claim: {
    title: 'Certify & claim rule-based support',
    summary: 'Entitlements you can self-assess once R&D substance and certification are in place.',
  },
  competitive: {
    title: 'Pursue competitive funding',
    summary: 'Call-based grants and platform access — plan around windows; approval is not guaranteed.',
  },
  monitor: {
    title: 'Track what is coming',
    summary: 'Proposed instruments worth watching for multi-year planning.',
  },
};

function phaseForInstrument(i: Instrument): RoadmapPhase['id'] {
  if (i.status === 'proposed') return 'monitor';
  if (i.is_absence) return 'certify_claim';
  if (i.instrument_type === 'expat_tax_ruling' || i.instrument_type === 'equity_taxation' || i.instrument_type === 'visa_fast_track')
    return 'staff';
  if (i.mechanism === 'discretionary') return 'competitive';
  return 'certify_claim';
}

const LEGAL_STEP_PHASE: Record<string, RoadmapPhase['id']> = {
  company_formation: 'establish',
  tax_registration: 'establish',
  state_aid_notification: 'competitive',
  visa_work_permit: 'staff',
  security_clearance: 'staff',
  rd_certification: 'certify_claim',
};

const PHASE_ORDER: RoadmapPhase['id'][] = [
  'establish',
  'staff',
  'certify_claim',
  'competitive',
  'monitor',
];

/**
 * The strictest entity requirement among the instruments actually matched
 * for this country — tells you whether a branch office is enough or a
 * separate legal entity is unavoidable, given what you are actually going
 * to claim (not a generic "you probably want a GmbH" default).
 */
export type EntityPathRecommendation = 'legal_entity' | 'branch_ok' | 'flexible';

export function recommendedEntityPath(
  countrySlug: string,
  results: InstrumentResult[],
): EntityPathRecommendation {
  const relevant = results.filter(
    (r) =>
      r.instrument.country === countrySlug &&
      !r.instrument.is_absence &&
      r.eligibility_status !== 'not_eligible',
  );
  if (relevant.some((r) => r.instrument.eligibility.entity_requirement === 'legal_entity'))
    return 'legal_entity';
  if (relevant.some((r) => r.instrument.eligibility.entity_requirement === 'taxable_presence'))
    return 'branch_ok';
  return 'flexible';
}

const ENTITY_REC_TEXT: Record<EntityPathRecommendation, string> = {
  legal_entity: `At least one matched instrument requires a separate legal entity (${entityKindLabels.legal_entity}) — a branch office will not qualify for it, though it may still be worth registering a branch first if you need staff on the ground sooner.`,
  branch_ok: `Every matched instrument only needs a local tax presence — a branch office (${entityKindLabels.branch}) is sufficient; forming a full subsidiary is a liability-protection choice, not a requirement here.`,
  flexible: `No matched instrument on its own requires a formal local presence — but employing staff will still need at least a branch registration or an Employer of Record (${entityKindLabels.eor}).`,
};

/**
 * Build a phased roadmap for a single country: legal steps and matched
 * instruments merged into a sequence a company can actually follow.
 */
export function buildRoadmap(
  countrySlug: string,
  results: InstrumentResult[],
  p: CompanyProfile,
): RoadmapPhase[] {
  const buckets = new Map<RoadmapPhase['id'], RoadmapStep[]>();
  for (const id of PHASE_ORDER) buckets.set(id, []);

  // Legal steps (skip company formation for a company that already has an EU entity).
  const skipFormation = p.hqCountry === 'eu';
  for (const s of legalStepsByCountry(countrySlug)) {
    if (skipFormation && s.step_type === 'company_formation') continue;
    const phase = LEGAL_STEP_PHASE[s.step_type] ?? 'establish';
    buckets.get(phase)!.push({
      title: s.entity_kind ? `${s.title} (${entityKindLabels[s.entity_kind]})` : s.title,
      detail: `${legalStepTypeLabels[s.step_type]} · ${s.costs}`,
      timeline: s.typical_timeline,
      kind: 'legal_step',
    });
  }

  // Entity-path recommendation, based on what was actually matched — placed
  // first in the 'establish' phase so it reads before the formation options.
  if (!skipFormation && legalStepsByCountry(countrySlug).some((s) => s.step_type === 'company_formation')) {
    const rec = recommendedEntityPath(countrySlug, results);
    buckets.get('establish')!.unshift({
      title: 'Choose your entity path',
      detail: ENTITY_REC_TEXT[rec],
      timeline: '',
      kind: 'legal_step',
    });
  }

  // Instruments matched for this country.
  for (const r of results) {
    if (r.instrument.country !== countrySlug) continue;
    if (r.instrument.is_absence) continue;
    const phase = phaseForInstrument(r.instrument);
    buckets.get(phase)!.push({
      title: r.instrument.name,
      detail:
        r.eligibility_status === 'eligible'
          ? 'Rule-based entitlement — self-assess once substance is in place.'
          : r.conditional_reason?.path ?? 'See instrument for conditions.',
      timeline: r.instrument.typical_timeline,
      href: `/instrument/${r.instrument.slug}`,
      kind: 'instrument',
    });
  }

  return PHASE_ORDER.map((id) => ({
    id,
    title: PHASE_META[id].title,
    summary: PHASE_META[id].summary,
    steps: buckets.get(id)!,
  })).filter((ph) => ph.steps.length > 0);
}

// ---------------------------------------------------------------------------
// 4. Time to first cash — illustrative, not a commitment
// ---------------------------------------------------------------------------

/** Illustrative entity-formation months per country (fastest available path: GmbH/BV/branch). */
const ENTITY_FORMATION_MONTHS: Record<string, { min: number; max: number }> = {
  germany: { min: 0.5, max: 1.5 },
  netherlands: { min: 0.25, max: 0.5 },
  belgium: { min: 0.5, max: 1 },
  france: { min: 0.5, max: 1.5 },
  spain: { min: 0.5, max: 1.5 },
};

export interface CashTimeline {
  countrySlug: string;
  entityMonths: { min: number; max: number };
  instrument: Instrument | null;
  instrumentMonths: { min: number; max: number } | null;
  totalMonths: { min: number; max: number } | null;
}

/**
 * Rough "time to first cash" for a country: entity formation plus the
 * fastest quantified rule-based/hybrid instrument's own certification and
 * filing timeline. Deliberately illustrative — real timing depends on
 * fiscal year alignment, application quality, and administrative backlog.
 */
export function estimateCashTimeline(
  countrySlug: string,
  results: InstrumentResult[],
): CashTimeline {
  const entityMonths = ENTITY_FORMATION_MONTHS[countrySlug] ?? { min: 0.5, max: 2 };
  const candidates = results.filter(
    (r) =>
      r.instrument.country === countrySlug &&
      r.instrument.cash_timeline_months &&
      r.eligibility_status !== 'not_eligible' &&
      (r.instrument.mechanism === 'rule_based' || r.instrument.mechanism === 'hybrid'),
  );
  if (candidates.length === 0) {
    return { countrySlug, entityMonths, instrument: null, instrumentMonths: null, totalMonths: null };
  }
  const fastest = candidates.reduce((a, b) =>
    a.instrument.cash_timeline_months!.max <= b.instrument.cash_timeline_months!.max ? a : b,
  );
  const im = fastest.instrument.cash_timeline_months!;
  return {
    countrySlug,
    entityMonths,
    instrument: fastest.instrument,
    instrumentMonths: im,
    totalMonths: { min: entityMonths.min + im.min, max: entityMonths.max + im.max },
  };
}

// ---------------------------------------------------------------------------
// 5. Cumulation / State aid ceiling advisory
// ---------------------------------------------------------------------------

/**
 * Flags when 2+ discretionary or state-aid-type instruments match for a
 * country — a cue to check EU cumulation limits (De Minimis, GBER aid
 * intensity caps) before stacking them. Deliberately an advisory, not a
 * computed pass/fail: actual state-aid classification of each scheme and
 * the applicable ceiling depend on details this tool does not model.
 */
export function cumulationAdvisory(countrySlug: string, results: InstrumentResult[]): string | null {
  const stateAidLike = results.filter(
    (r) =>
      r.instrument.country === countrySlug &&
      r.eligibility_status !== 'not_eligible' &&
      (r.instrument.mechanism === 'discretionary' ||
        r.instrument.instrument_type === 'grant_program' ||
        r.instrument.instrument_type === 'state_aid_scheme'),
  );
  if (stateAidLike.length < 2) return null;
  return `Combining ${stateAidLike.length} discretionary/state-aid instruments here may run into EU cumulation limits (De Minimis €300k per 3 fiscal years, or GBER aid-intensity caps depending on the scheme) — verify with your advisor before stacking.`;
}
