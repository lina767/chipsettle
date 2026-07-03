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

export interface Country {
  name: string;
  code: string; // "DE", "NL", ... "EU" is used for the EU level
  slug: string;
  flag_emoji: string;
  general_corporate_tax_rate: number | null; // percent, combined typical rate
  pillar_two_implemented: boolean;
  notes: string;
  last_verified: string; // ISO date
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
  requires_local_entity: boolean;
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
  key_institutions: { name: string; type: string; relevance: string }[];
  cluster_programs: { name: string; url: string; description: string }[];
  notes: string;
  last_verified: string;
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
  goal: Goal;
  /** country slugs; empty array = compare all available countries */
  targetCountries: string[];
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
}
