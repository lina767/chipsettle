/**
 * ChipSettle data model.
 *
 * These types mirror the Payload CMS collection schemas 1:1 so the data
 * layer can be swapped from local TypeScript files to the Payload REST API
 * without touching the decision engine or the UI.
 */

// ---------------------------------------------------------------------------
// Enums (shared between company profile and instrument eligibility)
// ---------------------------------------------------------------------------

export type HqCountry =
  | 'usa'
  | 'canada'
  | 'uk'
  | 'taiwan'
  | 'south_korea'
  | 'japan'
  | 'israel'
  | 'eu'
  | 'other';

export type BusinessModel =
  | 'fabless'
  | 'ip_licensing'
  | 'idm'
  | 'osat'
  | 'equipment'
  | 'materials'
  | 'eda_tools';

export type CompanySize = 'startup' | 'sme' | 'midcap' | 'large';

export type RevenueBand = 'lt_10m' | '10_50m' | '50_250m' | '250_750m' | 'gt_750m';

export type Sector =
  | 'logic'
  | 'analog_mixed_signal'
  | 'power'
  | 'photonics'
  | 'mems_sensors'
  | 'rf_mmwave'
  | 'riscv_open_isa'
  | 'eda_design_tools'
  | 'advanced_packaging'
  | 'memory'
  | 'ai_accelerators';

export type Goal =
  | 'design_site'
  | 'rd_cooperation'
  | 'fab_site'
  | 'pilot_lines'
  | 'ip_domiciliation';

/** End-market / customer industry the company's chips ultimately serve. */
export type Industry =
  | 'automotive'
  | 'robotics'
  | 'consumer_electronics'
  | 'industrial_automation'
  | 'aerospace_defense'
  | 'telecom_5g'
  | 'data_center_hpc'
  | 'medical_devices'
  | 'biotech'
  | 'energy_grid'
  | 'other';

/**
 * How much of a local presence an instrument actually requires. This is the
 * nuance behind the old "local entity: yes/no" flag: most fiscal
 * entitlements only need a taxable presence (a branch/Zweigniederlassung of
 * the existing foreign company is enough), while grant programs generally
 * require a separate legal entity as the contracting party.
 */
export type EntityRequirement =
  | 'any_presence' // no local presence needed to claim this specific point
  | 'taxable_presence' // a branch office / permanent establishment is enough
  | 'legal_entity'; // must be a separate legal person (GmbH/BV/SARL/...)

/** How a legal_steps company_formation entry satisfies entity requirements. */
export type EntityKind = 'legal_entity' | 'branch' | 'eor';

export type InstrumentType =
  | 'rd_tax_credit'
  | 'ip_box'
  | 'payroll_exemption'
  | 'expat_tax_ruling'
  | 'equity_taxation'
  | 'grant_program'
  | 'infrastructure_access'
  | 'visa_fast_track'
  | 'state_aid_scheme'
  | 'other';

export type Mechanism = 'rule_based' | 'discretionary' | 'hybrid';

export type InstrumentStatus = 'active' | 'proposed' | 'expiring' | 'expired';

export type InstrumentLevel = 'national' | 'eu' | 'regional';

// ---------------------------------------------------------------------------
// Collection: countries
// ---------------------------------------------------------------------------

/**
 * Foreign direct investment screening relevant to semiconductor/critical-tech
 * investors. `covers_greenfield` is deliberately not a plain boolean: most
 * regimes historically target acquisitions of existing entities, but the
 * 2025 EU FDI Screening Regulation reform designates semiconductors a
 * "hyper-critical" technology and several member states are actively
 * expanding scope — so "no" would be misleadingly reassuring.
 */
export interface FdiScreening {
  applies_to_sector: boolean;
  covers_greenfield: 'rarely' | 'sometimes' | 'check_current_rules';
  threshold: string;
  authority: string;
  typical_timeline: string;
  legal_basis: string;
  legal_basis_url: string;
  notes: string;
  last_verified: string;
}

/** Orientation-level labor law snapshot — not a substitute for local counsel. */
export interface LaborLawSnapshot {
  works_council_threshold: string;
  notice_periods: string;
  collective_bargaining: string;
  notes: string;
  last_verified: string;
}

export interface Country {
  name: string;
  code: string; // "DE", "NL", ... "EU" is used for the EU level
  slug: string;
  flag_emoji: string;
  general_corporate_tax_rate: number | null; // percent, combined typical rate
  pillar_two_implemented: boolean;
  notes: string;
  last_verified: string; // ISO date
  fdi_screening?: FdiScreening;
  labor_law?: LaborLawSnapshot;
}

// ---------------------------------------------------------------------------
// Collection: instruments
// ---------------------------------------------------------------------------

export interface InstrumentParameter {
  label: string;
  value: string;
  notes?: string;
}

export interface Eligibility {
  hq_countries: 'any' | 'eu_only' | 'eu_plus_associated' | 'specific';
  hq_country_list?: HqCountry[]; // if 'specific'
  /** Replaces a plain yes/no: how much local presence this instrument needs. */
  entity_requirement: EntityRequirement;
  requires_local_rd_substance: boolean;
  /** null = all business models qualify */
  business_models: BusinessModel[] | null;
  size_restrictions: 'any' | 'sme_only' | 'sme_and_midcap' | 'large_excluded';
  /** Revenue ceiling in € million above which the instrument stops applying
   *  or is materially constrained (e.g. 750 for Pillar Two). null = none. */
  revenue_ceiling_meur: number | null;
  /** null = all sectors */
  sector_restrictions: Sector[] | null;
  /** Which settlement goals this instrument is relevant for. */
  goals: Goal[];
  additional_conditions?: string;
}

export interface ChangelogEntry {
  date: string; // ISO date
  change: string;
  source: string;
}

export interface Instrument {
  name: string;
  slug: string;
  country: string; // country slug; "eu" for EU-level instruments
  level: InstrumentLevel;

  instrument_type: InstrumentType;
  summary: string;
  mechanism: Mechanism;

  parameters: InstrumentParameter[];
  eligibility: Eligibility;

  legal_basis: string;
  legal_basis_url: string;

  application_process: string;
  typical_timeline: string;

  status: InstrumentStatus;
  valid_from: string | null;
  valid_until: string | null; // null = no expiry
  last_verified: string;
  verification_source: string;
  next_review_date: string;

  /** Marks an entry that documents the *absence* of an instrument
   *  (e.g. "Germany has no IP box"). Rendered distinctly. */
  is_absence?: boolean;
  /** Set when specific parameters still need re-verification before they
   *  should be relied on. Rendered as a warning badge. */
  needs_verification?: string;

  changelog: ChangelogEntry[];

  related: string[]; // instrument slugs
  conflicts_with: string[];
  stacks_with: string[];

  /** Optional benefit model used by the support estimate (Rechnung). */
  estimate?: EstimateModel;

  /**
   * Illustrative months from a standing start to realized cash, for the
   * quantified rule-based/hybrid instruments only — entity formation is
   * added on top by the time-to-cash calculation. Approximate by design;
   * labeled as such wherever shown.
   */
  cash_timeline_months?: { min: number; max: number };

  /** Free text: the recurring cadence of claiming/maintaining this instrument after first use, if any. */
  recurring?: string;
}

// ---------------------------------------------------------------------------
// Collection: ecosystems
// ---------------------------------------------------------------------------

export interface Ecosystem {
  name: string;
  slug: string;
  country: string; // country slug
  region: string;
  city: string;
  strengths: Sector[];
  /** End-market industries this cluster is genuinely known for (informational, not individually sourced). */
  industries: Industry[];
  key_institutions: { name: string; type: string; relevance: string }[];
  cluster_programs: { name: string; url: string; description: string }[];
  notes: string;
  last_verified: string;
  /** Fully-loaded annual cost (€) for a senior IC/RTL design engineer in this hub — market benchmark, not a survey of any single employer. */
  senior_engineer_cost_eur?: { min: number; max: number };
}

// ---------------------------------------------------------------------------
// Collection: legal_steps
// ---------------------------------------------------------------------------

export type LegalStepType =
  | 'company_formation'
  | 'visa_work_permit'
  | 'tax_registration'
  | 'rd_certification'
  | 'state_aid_notification'
  | 'security_clearance';

export interface LegalStep {
  country: string; // country slug
  step_type: LegalStepType;
  title: string;
  description: string;
  typical_timeline: string;
  requirements: string;
  costs: string;
  source_url: string;
  last_verified: string;
  /** For company_formation entries: which of the three entity paths this is. */
  entity_kind?: EntityKind;
}

// ---------------------------------------------------------------------------
// Company profile (wizard output) and engine result
// ---------------------------------------------------------------------------

export interface CompanyProfile {
  hqCountry: HqCountry;
  businessModel: BusinessModel;
  companySize: CompanySize;
  revenue: RevenueBand;
  sectors: Sector[];
  /** End-market industries the company serves (optional, informs ecosystem fit). */
  industries: Industry[];
  goal: Goal;
  /** country slugs; empty array = compare all available countries */
  targetCountries: string[];

  // --- Optional "rough numbers" for the support estimate (Rechnung) ---
  /** Planned number of R&D engineers at the site. */
  rdEngineers?: number;
  /** Approximate total annual R&D personnel cost, in € (fully loaded). */
  rdPersonnelCost?: number;
  /** Share of group revenue that is licensable IP income, in percent. */
  ipSharePct?: number;
}

/**
 * Quantitative benefit model attached to instruments that can be estimated.
 * All figures are deliberately coarse — the estimate is orientation, not advice.
 */
export interface EstimateModel {
  kind: 'rd_credit' | 'payroll' | 'ip_box';
  /** rd_credit / payroll: fraction of the R&D personnel base. */
  rate?: number;
  /** rd_credit: higher fraction for SMEs. */
  rateSme?: number;
  /** rd_credit: annual credit ceiling for large companies (€). */
  capLarge?: number;
  /** rd_credit: annual credit ceiling for SMEs (€). */
  capSme?: number;
  /** ip_box: effective tax rate on qualifying IP income (fraction). */
  effRate?: number;
  /** True when the rate is a rough indicative figure pending verification. */
  rough?: boolean;
}

export type EligibilityStatus =
  | 'eligible'
  | 'likely_eligible'
  | 'conditional'
  | 'not_eligible';

export interface InstrumentResult {
  instrument: Instrument;
  eligibility_status: EligibilityStatus;
  relevance_score: number;
  /** Profile-specific notes, e.g. Pillar Two interactions. */
  notes: string[];
  /** For 'conditional' results: why, and how to satisfy it. */
  conditional_reason?: { reason: string; path?: string };
  /** Set on IP boxes when the €750M Pillar Two floor caps the benefit. */
  pillar_two_capped?: boolean;
}

/** An instrument that was filtered out, with the profile-based reason. */
export interface ExcludedInstrument {
  instrument: Instrument;
  reason: string;
}

/** One quantified line inside a country support estimate. */
export interface EstimateLine {
  instrument: Instrument;
  amount: number; // € per year
  basis: string; // human-readable computation basis
  rough: boolean;
}

/** Rough annual support estimate for a single country. */
export interface CountryEstimate {
  countrySlug: string;
  lines: EstimateLine[];
  total: number; // € per year (quantified, rule-based/hybrid only)
  effectiveRatePct: number | null; // total as % of R&D personnel base
  personnelBase: number;
  ipIncome: number;
  /** Discretionary programs that add potential funding but are not quantified. */
  competitiveCount: number;
}

export interface EcosystemFit {
  countrySlug: string;
  /** 0..1 combined share of the company's sectors + industries covered locally. */
  coverage: number;
  matches: {
    ecosystemName: string;
    city: string;
    matchedSectors: Sector[];
    matchedIndustries: Industry[];
    senior_engineer_cost_eur?: { min: number; max: number };
  }[];
  /** Sectors the company selected that no local cluster covers. */
  unmatchedSectors: Sector[];
  /** Industries the company selected that no local cluster covers. */
  unmatchedIndustries: Industry[];
}

export type RoadmapPhaseId =
  | 'establish'
  | 'staff'
  | 'certify_claim'
  | 'competitive'
  | 'monitor';

export interface RoadmapStep {
  title: string;
  detail: string;
  timeline: string;
  href?: string;
  kind: 'legal_step' | 'instrument';
}

export interface RoadmapPhase {
  id: RoadmapPhaseId;
  title: string;
  summary: string;
  steps: RoadmapStep[];
}
