import type {
  BusinessModel,
  CompanySize,
  EligibilityStatus,
  EntityKind,
  EntityRequirement,
  Goal,
  HqCountry,
  Industry,
  InstrumentStatus,
  InstrumentType,
  LegalStepType,
  Mechanism,
  RevenueBand,
  Sector,
} from './types';

export const hqCountryLabels: Record<HqCountry, string> = {
  usa: 'USA',
  canada: 'Canada',
  uk: 'United Kingdom',
  taiwan: 'Taiwan',
  south_korea: 'South Korea',
  japan: 'Japan',
  israel: 'Israel',
  eu: 'EU member state',
  other: 'Other',
};

export const businessModelLabels: Record<BusinessModel, string> = {
  fabless: 'Fabless design',
  ip_licensing: 'IP licensing',
  idm: 'IDM',
  osat: 'OSAT',
  equipment: 'Equipment',
  materials: 'Materials',
  eda_tools: 'EDA / tools',
};

export const companySizeLabels: Record<CompanySize, string> = {
  startup: 'Startup (<50 employees)',
  sme: 'SME (50–249 employees, <€50M revenue)',
  midcap: 'Mid-cap (250–2,999 employees)',
  large: 'Large (3,000+ employees)',
};

export const revenueBandLabels: Record<RevenueBand, string> = {
  lt_10m: '< €10M',
  '10_50m': '€10–50M',
  '50_250m': '€50–250M',
  '250_750m': '€250–750M',
  gt_750m: '> €750M',
};

export const sectorLabels: Record<Sector, string> = {
  logic: 'Logic',
  analog_mixed_signal: 'Analog / Mixed-Signal',
  power: 'Power (SiC/GaN)',
  photonics: 'Photonics',
  mems_sensors: 'MEMS / Sensors',
  rf_mmwave: 'RF / mmWave',
  riscv_open_isa: 'RISC-V / Open ISA',
  eda_design_tools: 'EDA / Design tools',
  advanced_packaging: 'Advanced Packaging',
  memory: 'Memory',
  ai_accelerators: 'AI accelerators',
};

export const goalLabels: Record<Goal, string> = {
  design_site: 'Additional design site in Europe',
  rd_cooperation: 'R&D cooperation without own site',
  fab_site: 'Manufacturing / fab site',
  pilot_lines: 'Access to pilot lines & prototyping',
  ip_domiciliation: 'IP domiciliation',
};

export const industryLabels: Record<Industry, string> = {
  automotive: 'Automotive',
  robotics: 'Robotics',
  consumer_electronics: 'Consumer electronics',
  industrial_automation: 'Industrial automation',
  aerospace_defense: 'Aerospace & defense',
  telecom_5g: 'Telecom / 5G',
  data_center_hpc: 'Data center / HPC',
  medical_devices: 'Medical devices',
  energy_grid: 'Energy & grid',
  other: 'Other',
};

/**
 * The nuance behind "local entity required": most fiscal entitlements only
 * need a taxable presence (a branch office is enough); grant programs
 * generally require a separate legal entity as the contracting party.
 */
export const entityRequirementLabels: Record<EntityRequirement, string> = {
  any_presence: 'No local presence required for this point',
  taxable_presence: 'Local tax presence required (branch is sufficient)',
  legal_entity: 'Separate legal entity required',
};

export const entityRequirementHelp: Record<EntityRequirement, string> = {
  any_presence: 'This specific point does not depend on how you are present locally.',
  taxable_presence:
    'A branch office (Zweigniederlassung/permanent establishment) of your existing company is enough — you do not need to form a new legal entity such as a GmbH or BV.',
  legal_entity:
    'The applicant must be a separate legal person (e.g. GmbH, BV, SARL) — a branch office of a foreign company does not qualify here.',
};

export const entityKindLabels: Record<EntityKind, string> = {
  legal_entity: 'Legal entity (e.g. GmbH/BV/SARL)',
  branch: 'Branch office (no new legal entity)',
  eor: 'Employer of Record (no entity at all)',
};

export const instrumentTypeLabels: Record<InstrumentType, string> = {
  rd_tax_credit: 'R&D tax credit',
  ip_box: 'IP box',
  payroll_exemption: 'Payroll exemption',
  expat_tax_ruling: 'Expat tax ruling',
  equity_taxation: 'Equity taxation',
  grant_program: 'Grant program',
  infrastructure_access: 'Infrastructure access',
  visa_fast_track: 'Visa fast track',
  state_aid_scheme: 'State aid scheme',
  other: 'Other',
};

/** Consistent per-type color coding (Tailwind utility fragments). */
export const instrumentTypeColors: Record<
  InstrumentType,
  { badge: string; border: string; dot: string }
> = {
  rd_tax_credit: {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    border: 'border-l-blue-600',
    dot: 'bg-blue-600',
  },
  ip_box: {
    badge: 'bg-violet-50 text-violet-800 border-violet-200',
    border: 'border-l-violet-600',
    dot: 'bg-violet-600',
  },
  payroll_exemption: {
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    border: 'border-l-teal-600',
    dot: 'bg-teal-600',
  },
  expat_tax_ruling: {
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    border: 'border-l-cyan-600',
    dot: 'bg-cyan-600',
  },
  equity_taxation: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-l-amber-600',
    dot: 'bg-amber-600',
  },
  grant_program: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-l-emerald-600',
    dot: 'bg-emerald-600',
  },
  infrastructure_access: {
    badge: 'bg-orange-50 text-orange-800 border-orange-200',
    border: 'border-l-orange-600',
    dot: 'bg-orange-600',
  },
  visa_fast_track: {
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
    border: 'border-l-sky-600',
    dot: 'bg-sky-600',
  },
  state_aid_scheme: {
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    border: 'border-l-rose-600',
    dot: 'bg-rose-600',
  },
  other: {
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    border: 'border-l-slate-500',
    dot: 'bg-slate-500',
  },
};

export const mechanismLabels: Record<Mechanism, string> = {
  rule_based: 'Rule-based entitlement',
  discretionary: 'Discretionary (call-based)',
  hybrid: 'Hybrid',
};

export const mechanismHelp: Record<Mechanism, string> = {
  rule_based: 'Legal entitlement — self-assessment, no case-by-case funding decision.',
  discretionary: 'Competitive, call-based — requires approval; success not guaranteed.',
  hybrid: 'Rule-based core with additional administrative steps.',
};

export const statusLabels: Record<InstrumentStatus, string> = {
  active: 'Active',
  proposed: 'Proposed',
  expiring: 'Expiring',
  expired: 'Expired',
};

export const statusColors: Record<InstrumentStatus, string> = {
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  proposed: 'bg-amber-50 text-amber-900 border-amber-300',
  expiring: 'bg-orange-50 text-orange-800 border-orange-300',
  expired: 'bg-slate-100 text-slate-500 border-slate-300',
};

export const eligibilityLabels: Record<EligibilityStatus, string> = {
  eligible: 'Eligible',
  likely_eligible: 'Likely eligible',
  conditional: 'Conditional',
  not_eligible: 'Not eligible',
};

export const eligibilityColors: Record<EligibilityStatus, string> = {
  eligible: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  likely_eligible: 'bg-lime-50 text-lime-900 border-lime-300',
  conditional: 'bg-amber-50 text-amber-900 border-amber-300',
  not_eligible: 'bg-slate-100 text-slate-500 border-slate-300',
};

export const legalStepTypeLabels: Record<LegalStepType, string> = {
  company_formation: 'Company formation',
  visa_work_permit: 'Visa & work permits',
  tax_registration: 'Tax registration',
  rd_certification: 'R&D certification',
  state_aid_notification: 'State aid notification',
  security_clearance: 'Security clearance',
};

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** True when a verification date is older than 6 months. */
export function isStale(lastVerified: string, now = new Date()): boolean {
  const verified = new Date(lastVerified + 'T00:00:00Z');
  const sixMonthsMs = 183 * 24 * 60 * 60 * 1000;
  return now.getTime() - verified.getTime() > sixMonthsMs;
}

/** True when the most recent changelog entry is within the last 6 months. */
export function hasRecentChange(
  changelog: { date: string }[],
  now = new Date(),
): boolean {
  if (changelog.length === 0) return false;
  const latest = changelog.reduce((a, b) => (a.date > b.date ? a : b));
  const sixMonthsMs = 183 * 24 * 60 * 60 * 1000;
  return now.getTime() - new Date(latest.date + 'T00:00:00Z').getTime() < sixMonthsMs;
}
