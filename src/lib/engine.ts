import type {
  CompanyProfile,
  EligibilityStatus,
  Instrument,
  InstrumentResult,
} from './types';
import { instruments } from '../data/instruments';
import { seededCountrySlugs } from '../data/countries';

/**
 * The decision engine is a deterministic filter function, not AI.
 * It takes the company profile as input and returns a filtered, ranked list
 * of instruments. Every step is documented on the /methodology page.
 */

// ---------------------------------------------------------------------------
// Hard filters — instruments failing these are excluded from the result set
// ---------------------------------------------------------------------------

function matchesCountry(i: Instrument, targetCountries: string[]): boolean {
  // EU-level instruments apply regardless of the target member state.
  if (i.level === 'eu') return true;
  const targets = targetCountries.length > 0 ? targetCountries : seededCountrySlugs;
  return targets.includes(i.country);
}

function matchesHQ(i: Instrument, hq: CompanyProfile['hqCountry']): boolean {
  const rule = i.eligibility.hq_countries;
  if (rule === 'any') return true;
  // 'eu_only' / 'eu_plus_associated' constrain where the APPLYING ENTITY sits.
  // Since the whole premise is establishing an EU entity, a non-EU HQ does
  // not hard-fail these rules — it downgrades eligibility instead (see
  // assessEligibility). Only 'specific' lists hard-filter on HQ.
  if (rule === 'specific') {
    return (i.eligibility.hq_country_list ?? []).includes(hq);
  }
  return true;
}

function matchesBusinessModel(
  i: Instrument,
  bm: CompanyProfile['businessModel'],
): boolean {
  return i.eligibility.business_models === null || i.eligibility.business_models.includes(bm);
}

function matchesSize(
  i: Instrument,
  size: CompanyProfile['companySize'],
  revenue: CompanyProfile['revenue'],
): boolean {
  const r = i.eligibility.size_restrictions;
  if (r === 'sme_only' && (size === 'midcap' || size === 'large')) return false;
  if (r === 'sme_and_midcap' && size === 'large') return false;
  if (r === 'large_excluded' && size === 'large') return false;
  // Revenue ceilings are soft (Pillar Two bounds a benefit rather than
  // removing eligibility), so they downgrade in assessEligibility instead.
  void revenue;
  return true;
}

function matchesSector(i: Instrument, sectors: CompanyProfile['sectors']): boolean {
  if (i.eligibility.sector_restrictions === null) return true;
  return sectors.some((s) => i.eligibility.sector_restrictions!.includes(s));
}

function matchesGoal(i: Instrument, goal: CompanyProfile['goal']): boolean {
  return i.eligibility.goals.includes(goal);
}

// ---------------------------------------------------------------------------
// Eligibility assessment (soft signals, shown as a status per instrument)
// ---------------------------------------------------------------------------

export function assessEligibility(
  i: Instrument,
  profile: CompanyProfile,
): EligibilityStatus {
  if (i.status === 'expired') return 'not_eligible';
  if (i.status === 'proposed') return 'conditional';
  if (i.is_absence) return 'conditional';

  let downgrades = 0;

  // Non-EU HQ + instrument requires an EU/associated-established entity:
  // achievable via the new subsidiary, but it is a real precondition.
  if (
    (i.eligibility.hq_countries === 'eu_only' ||
      i.eligibility.hq_countries === 'eu_plus_associated') &&
    profile.hqCountry !== 'eu'
  ) {
    downgrades += 1;
  }

  // Local entity / local R&D substance requirements: preconditions the
  // company controls, but not yet met at planning stage.
  if (i.eligibility.requires_local_entity) downgrades += 0; // assumed intent
  if (i.eligibility.requires_local_rd_substance) downgrades += 0;

  // Pillar Two: above the €750M revenue ceiling the benefit is bounded.
  if (i.eligibility.revenue_ceiling_meur !== null && profile.revenue === 'gt_750m') {
    downgrades += 1;
  }

  // Discretionary programs are never an entitlement.
  if (i.mechanism === 'discretionary') return downgrades > 0 ? 'conditional' : 'likely_eligible';
  if (i.mechanism === 'hybrid') return downgrades > 0 ? 'conditional' : 'likely_eligible';

  // Rule-based instruments.
  if (downgrades > 0) return 'conditional';
  return 'eligible';
}

// ---------------------------------------------------------------------------
// Relevance scoring — documented weights, transparent by design
// ---------------------------------------------------------------------------

export function calculateRelevance(i: Instrument, profile: CompanyProfile): number {
  let score = 0;

  // Rule-based beats discretionary: lower friction, plannable.
  if (i.mechanism === 'rule_based') score += 30;
  else if (i.mechanism === 'hybrid') score += 18;
  else score += 8;

  // Status: active beats proposed/expiring.
  if (i.status === 'active') score += 20;
  else if (i.status === 'expiring') score += 14;
  else if (i.status === 'proposed') score += 4;

  // Fiscal / practical impact by instrument type for the selected goal.
  const typeWeights: Record<Instrument['instrument_type'], number> = {
    rd_tax_credit: 25,
    ip_box: profile.goal === 'ip_domiciliation' ? 28 : 12,
    payroll_exemption: 18,
    expat_tax_ruling: 14,
    equity_taxation: 8,
    grant_program: 12,
    infrastructure_access: profile.goal === 'pilot_lines' ? 26 : 14,
    visa_fast_track: 10,
    state_aid_scheme: 8,
    other: 4,
  };
  score += typeWeights[i.instrument_type];

  // Primary-goal alignment: first-listed goals are the instrument's core use.
  const goalIndex = i.eligibility.goals.indexOf(profile.goal);
  if (goalIndex === 0) score += 12;
  else if (goalIndex > 0) score += 6;

  // SME uplift where the instrument is materially better for SMEs.
  if (
    (profile.companySize === 'startup' || profile.companySize === 'sme') &&
    (i.slug === 'de-forschungszulage' || i.slug === 'eu-eic-accelerator' || i.slug === 'fr-cir')
  ) {
    score += 6;
  }

  // Absence entries are context, not opportunities.
  if (i.is_absence) score -= 25;

  // Entries pending verification rank below fully verified peers.
  if (i.needs_verification) score -= 5;

  return score;
}

// ---------------------------------------------------------------------------
// Profile-specific notes
// ---------------------------------------------------------------------------

export function generateNotes(i: Instrument, profile: CompanyProfile): string[] {
  const notes: string[] = [];

  if (
    i.eligibility.revenue_ceiling_meur !== null &&
    profile.revenue === 'gt_750m' &&
    i.instrument_type === 'ip_box'
  ) {
    notes.push(
      'Pillar Two: your group revenue exceeds €750M, so this IP-box benefit is bounded by the 15% GloBE minimum tax floor.',
    );
  }

  if (
    (i.eligibility.hq_countries === 'eu_only' ||
      i.eligibility.hq_countries === 'eu_plus_associated') &&
    profile.hqCountry !== 'eu'
  ) {
    notes.push(
      'Requires the applying entity to be established in the EU (or an associated country) — your planned European subsidiary would need to be the applicant.',
    );
  }

  if (i.eligibility.requires_local_entity && profile.hqCountry !== 'eu') {
    notes.push('Requires a local legal entity — factor company formation into your timeline.');
  }

  if (i.eligibility.requires_local_rd_substance) {
    notes.push('Requires real local R&D substance (staff and activity), not just a registered office.');
  }

  if (i.mechanism === 'discretionary') {
    notes.push('Competitive, call-based program — approval is not guaranteed and timing depends on call windows.');
  }

  if (i.status === 'proposed') {
    notes.push('PROPOSED — not yet law. Track for planning purposes; parameters may change in the legislative procedure.');
  }

  if (i.status === 'expiring' && i.valid_until) {
    notes.push(
      `Currently set to expire on ${i.valid_until} (extension possible but not enacted) — relevant for multi-year planning.`,
    );
  }

  if (i.needs_verification) {
    notes.push(`Verification pending: ${i.needs_verification}`);
  }

  if (i.is_absence) {
    notes.push('This entry documents the absence of an instrument — shown so the comparison is honest, not to suggest a benefit.');
  }

  if (
    i.eligibility.size_restrictions === 'sme_only' &&
    (profile.companySize === 'startup' || profile.companySize === 'sme')
  ) {
    notes.push('Restricted to SMEs — your profile qualifies on size.');
  }

  return notes;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function getRelevantInstruments(profile: CompanyProfile): InstrumentResult[] {
  return instruments
    .filter((i) => i.status === 'active' || i.status === 'proposed' || i.status === 'expiring')
    .filter((i) => matchesCountry(i, profile.targetCountries))
    .filter((i) => matchesHQ(i, profile.hqCountry))
    .filter((i) => matchesBusinessModel(i, profile.businessModel))
    .filter((i) => matchesSize(i, profile.companySize, profile.revenue))
    .filter((i) => matchesSector(i, profile.sectors))
    .filter((i) => matchesGoal(i, profile.goal))
    .map((i) => ({
      instrument: i,
      eligibility_status: assessEligibility(i, profile),
      relevance_score: calculateRelevance(i, profile),
      notes: generateNotes(i, profile),
    }))
    .sort((a, b) => b.relevance_score - a.relevance_score);
}

/** Results grouped by country slug (EU level under 'eu'), preserving rank order. */
export function groupResultsByCountry(
  results: InstrumentResult[],
): Map<string, InstrumentResult[]> {
  const map = new Map<string, InstrumentResult[]>();
  for (const r of results) {
    const key = r.instrument.country;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return map;
}
