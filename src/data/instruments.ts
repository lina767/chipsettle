import type { Instrument } from '../lib/types';

/**
 * Collection: instruments
 *
 * Seed dataset. All parameters verified as of 2026-07-03 unless the entry
 * carries a `needs_verification` note. Every entry cites its legal basis and
 * verification source — nothing here is generated or inferred.
 */
export const instruments: Instrument[] = [
  // =========================================================================
  // GERMANY
  // =========================================================================
  {
    name: 'Forschungszulage (Research Allowance)',
    slug: 'de-forschungszulage',
    estimate: { kind: 'rd_credit', rate: 0.25, rateSme: 0.35, capLarge: 3_000_000, capSme: 4_200_000 },
    country: 'germany',
    level: 'national',
    instrument_type: 'rd_tax_credit',
    summary:
      'Germany\'s rule-based R&D tax credit: a legal entitlement of 25% (35% for SMEs) on eligible R&D expenses, refundable in cash where it exceeds tax liability. Two-step process: project certification by the BSFZ, then assessment by the tax office.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'Rate', value: '25% standard, 35% for SMEs', notes: 'SME uplift since 28 March 2024' },
      { label: 'Assessment base cap', value: '€12M per year', notes: 'Since 1 January 2026' },
      {
        label: 'Overhead flat rate',
        value: '20% on eligible direct costs',
        notes: 'For projects starting after 31 December 2025',
      },
      { label: 'Max annual credit', value: '€3.0M (large), €4.2M (SMEs)' },
      { label: 'Refundable', value: 'Yes', notes: 'Payout of any excess over tax liability' },
      {
        label: 'Eligible costs',
        value: 'R&D personnel; contract research (70% of invoice); depreciation on R&D equipment; proprietor own-effort',
        notes: 'Proprietor own-effort at €100/h since 1 Jan 2026, max 40h/week',
      },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'fab_site', 'rd_cooperation', 'pilot_lines'],
      additional_conditions:
        'R&D must qualify as basic research, industrial research, or experimental development (Frascati-aligned). The claiming entity must be subject to German income or corporate tax; a German design subsidiary of a foreign group qualifies.',
    },
    legal_basis:
      'FZulG, as amended by Wachstumschancengesetz (BGBl. 2024 Nr. 108, Art. 26/27) and Investitionssofortprogramm (BGBl. 2025 Nr. 161)',
    legal_basis_url: 'https://www.gesetze-im-internet.de/fzulg/',
    application_process:
      'Step 1: Apply for project certification with the Bescheinigungsstelle Forschungszulage (BSFZ) — free of charge, decision typically within 3 months. Step 2: Claim the allowance with the competent tax office in the annual tax filing; the credit is set off against tax liability and any excess is paid out.',
    typical_timeline: 'BSFZ certificate ~3 months; credit with annual tax assessment',
    status: 'expiring',
    valid_from: '2020-01-01',
    valid_until: '2026-12-31',
    last_verified: '2026-07-03',
    verification_source: 'Official gazette (BGBl.) / BSFZ / bescheinigung-forschungszulage.de',
    next_review_date: '2026-10-01',
    changelog: [
      {
        date: '2024-03-28',
        change: 'Wachstumschancengesetz: SME rate raised to 35%, contract research share to 70%, base cap to €10M.',
        source: 'BGBl. 2024 Nr. 108',
      },
      {
        date: '2026-01-01',
        change:
          'Investitionssofortprogramm: assessment base cap raised to €12M; 20% overhead flat rate for projects starting after 31 Dec 2025; proprietor own-effort rate raised to €100/h.',
        source: 'BGBl. 2025 Nr. 161',
      },
    ],
    related: ['de-designinitiative-mikroelektronik'],
    conflicts_with: [],
    stacks_with: ['de-19a-estg', 'eu-eic-accelerator'],
  },
  {
    name: 'No IP Box — Lizenzschranke (§4j EStG)',
    slug: 'de-no-ip-box',
    country: 'germany',
    level: 'national',
    instrument_type: 'ip_box',
    is_absence: true,
    summary:
      'Germany has no patent box or innovation box — IP income is taxed at the full corporate rate (~30% incl. trade tax). The Lizenzschranke (§4j EStG, since 2018) additionally restricts deductibility of royalties paid into foreign preferential IP regimes. This is an anti-IP-box positioning, not merely an absence.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'IP box available', value: 'No' },
      { label: 'Effective rate on IP income', value: '~30% (full corporate rate incl. trade tax)' },
      {
        label: 'Lizenzschranke',
        value: 'Royalty deduction restriction since 2018',
        notes: 'Targets royalties paid into non-nexus-conform foreign preferential regimes',
      },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: false,
      requires_local_rd_substance: false,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['ip_domiciliation', 'design_site'],
      additional_conditions:
        'Relevant as a structuring constraint: domiciling IP in Germany yields no preferential rate, and cross-border royalty flows into IP boxes elsewhere may hit the Lizenzschranke.',
    },
    legal_basis: '§4j EStG (Lizenzschranke); no IP box provision exists in German tax law',
    legal_basis_url: 'https://www.gesetze-im-internet.de/estg/__4j.html',
    application_process:
      'Not applicable — this entry documents the absence of an instrument and a restriction to be aware of when structuring IP holdings.',
    typical_timeline: 'n/a',
    status: 'active',
    valid_from: '2018-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'EStG consolidated text',
    next_review_date: '2027-01-01',
    changelog: [],
    related: ['nl-innovation-box', 'be-innovation-income-deduction', 'fr-ip-regime'],
    conflicts_with: [],
    stacks_with: [],
  },
  {
    name: '§19a EStG — Deferred taxation of employee equity',
    slug: 'de-19a-estg',
    country: 'germany',
    level: 'national',
    instrument_type: 'equity_taxation',
    summary:
      'Deferred taxation of employee stock and option grants: the "dry income" problem is mitigated by deferring taxation until a liquidity event — sale, IPO, or termination (at the latest 15 years after grant). Improved by the Zukunftsfinanzierungsgesetz 2023, but still less competitive than US, Dutch, or Swiss equity taxation.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'Deferral trigger', value: 'Sale, IPO, or end of employment; max 15 years' },
      { label: 'Scope', value: 'Employee stock and option grants in qualifying companies' },
      {
        label: 'Competitiveness',
        value: 'Better than pre-2021, below US/NL/CH benchmarks',
        notes: 'Relevant when relocating equity-compensated design teams',
      },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: false,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site'],
      additional_conditions:
        'Company size and age thresholds apply (expanded in 2023 to broadly double the SME definition, companies up to 20 years old). Group-level grants (from a foreign parent) were brought into scope by the ZuFinG for group companies meeting the thresholds.',
    },
    legal_basis: '§19a EStG, as amended by Zukunftsfinanzierungsgesetz 2023',
    legal_basis_url: 'https://www.gesetze-im-internet.de/estg/__19a.html',
    application_process:
      'Applied by the employer through payroll; deferral requires employee consent. No application to an authority.',
    typical_timeline: 'Immediate (payroll)',
    status: 'active',
    valid_from: '2021-07-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'EStG consolidated text / ZuFinG (BGBl. 2023)',
    next_review_date: '2027-01-01',
    changelog: [
      {
        date: '2023-12-14',
        change:
          'Zukunftsfinanzierungsgesetz: thresholds expanded, deferral horizon extended to 15 years, group grants included.',
        source: 'BGBl. 2023 I Nr. 354',
      },
    ],
    related: ['de-forschungszulage'],
    conflicts_with: [],
    stacks_with: ['de-forschungszulage'],
  },
  {
    name: 'Designinitiative Mikroelektronik (BMFTR)',
    slug: 'de-designinitiative-mikroelektronik',
    country: 'germany',
    level: 'national',
    instrument_type: 'grant_program',
    summary:
      'The federal design initiative bundles Germany\'s chip-design funding: DE:Sign and DE:Sign Challenge calls, the Chipdesign Germany network, the IHP open-source platform, the German Chip Competence Centre (APECS interface), Skills4Chips/Microtec Academy, and the Kompetenzzentrum Chipdesign call (April 2026). Cumulative investment ~€97M as of mid-2026, focused on open-source EDA, design capability, and training.',
    mechanism: 'discretionary',
    parameters: [
      { label: 'Cumulative investment', value: '€97M', notes: 'As of mid-2026' },
      {
        label: 'Components',
        value:
          'DE:Sign, DE:Sign Challenge, Chipdesign Germany, IHP open-source platform, German Chip Competence Centre (APECS), Skills4Chips/Microtec Academy, Kompetenzzentrum Chipdesign',
      },
      { label: 'Focus', value: 'Open-source EDA, chip-design capabilities, training' },
      { label: 'Access route', value: 'Consortium or project application per call' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: ['fabless', 'ip_licensing', 'idm', 'eda_tools'],
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'rd_cooperation', 'pilot_lines'],
      additional_conditions:
        'Call-based under §§23/44 BHO. A German R&D partner is typically needed; foreign-headquartered groups participate through a German entity or in consortium with German research institutes.',
    },
    legal_basis: 'Individual Förderrichtlinien under §§23/44 BHO',
    legal_basis_url: 'https://www.elektronikforschung.de/fokusthemen/designinitiative',
    application_process:
      'Respond to individual funding calls (Förderrichtlinien) via the easy-Online portal; typically two-stage (sketch, then full proposal), often as a consortium with research partners.',
    typical_timeline: 'Call-dependent; typically 6–12 months from sketch to grant',
    status: 'active',
    valid_from: '2023-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'elektronikforschung.de/fokusthemen/designinitiative',
    next_review_date: '2026-10-01',
    changelog: [
      {
        date: '2026-04-01',
        change: 'Kompetenzzentrum Chipdesign call published.',
        source: 'BMFTR / elektronikforschung.de',
      },
    ],
    related: ['de-forschungszulage', 'eu-chips-ju-eurocdp'],
    conflicts_with: [],
    stacks_with: ['de-forschungszulage'],
  },

  // =========================================================================
  // NETHERLANDS
  // =========================================================================
  {
    name: 'Innovation Box (Innovatiebox)',
    slug: 'nl-innovation-box',
    estimate: { kind: 'ip_box', effRate: 0.09 },
    country: 'netherlands',
    level: 'national',
    instrument_type: 'ip_box',
    summary:
      'Preferential taxation of qualifying IP income at an effective rate of 9% instead of the 25.8% headline rate. Nexus-conform under the OECD BEPS Action 5 modified nexus approach: the benefit scales with the R&D the taxpayer performs itself. Applied by self-assessment in the corporate tax return.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'Effective rate on qualifying IP income', value: '9%' },
      { label: 'Nexus conformity', value: 'Yes — OECD BEPS Action 5 modified nexus approach' },
      {
        label: 'Access ticket',
        value: 'WBSO S&O declaration; patents/plant-breeder rights for larger taxpayers',
        notes: 'Small taxpayers can qualify with WBSO alone',
      },
      { label: 'Policy stability', value: 'Maintained per coalition agreement (confirmed 2025/2026)' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: ['fabless', 'ip_licensing', 'idm', 'eda_tools'],
      size_restrictions: 'any',
      revenue_ceiling_meur: 750,
      sector_restrictions: null,
      goals: ['ip_domiciliation', 'design_site'],
      additional_conditions:
        'Qualifying IP must result from R&D performed by the Dutch taxpayer (nexus ratio). For groups above the €750M Pillar Two threshold, the effective benefit is bounded by the 15% GloBE minimum.',
    },
    legal_basis: 'Art. 12b Wet op de vennootschapsbelasting 1969',
    legal_basis_url: 'https://wetten.overheid.nl/BWBR0002672/',
    application_process:
      'Self-assessment in the corporate income tax return; most taxpayers agree the innovation-box allocation method with the Belastingdienst in an advance tax ruling for certainty.',
    typical_timeline: 'Immediate (tax filing); advance ruling typically 3–6 months',
    status: 'active',
    valid_from: '2010-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'Wet Vpb 1969 consolidated text / coalition agreement 2025',
    next_review_date: '2027-01-01',
    changelog: [],
    related: ['nl-wbso', 'de-no-ip-box'],
    conflicts_with: [],
    stacks_with: ['nl-wbso', 'nl-expat-ruling'],
  },
  {
    name: 'Expat Ruling (30%/27% ruling)',
    slug: 'nl-expat-ruling',
    country: 'netherlands',
    level: 'national',
    instrument_type: 'expat_tax_ruling',
    summary:
      'Incoming employees with scarce expertise can receive part of their salary tax-free: 30% through 2026, 27% from 1 January 2027, for a maximum of 5 years. The employer applies; the Tax Administration decides. A key lever for relocating senior design talent to the Netherlands.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'Tax-free share', value: '30% through 2026; 27% from 1 Jan 2027' },
      {
        label: 'Salary threshold (from 2027)',
        value: '€50,436 (€38,388 for masters under 30)',
      },
      { label: 'Duration', value: 'Max 5 years' },
      { label: 'Partial non-resident status', value: 'Abolished 1 January 2025' },
      { label: 'WNT remuneration cap', value: 'Applies since 1 Jan 2026 for all users' },
      {
        label: 'Transitional rules',
        value: 'Pre-2024 users keep 30%; pre-2023 users also keep partial non-resident status through 2026',
      },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: false,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site'],
      additional_conditions:
        'Employee must be recruited from abroad (>150 km from the Dutch border for 16 of the last 24 months) and meet the salary norm. The Dutch entity must be a registered withholding agent.',
    },
    legal_basis: 'Wet op de loonbelasting 1964, Art. 31a(2)',
    legal_basis_url: 'https://business.gov.nl/regulation/30-percent-ruling/',
    application_process:
      'Joint application by employer and employee to the Belastingdienst within 4 months of the employment start for retroactive effect.',
    typical_timeline: 'Decision typically within 10 weeks',
    status: 'active',
    valid_from: '2024-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'business.gov.nl / Belastingdienst',
    next_review_date: '2026-12-01',
    changelog: [
      {
        date: '2025-02-01',
        change: '30-20-10 step-down proposal replaced by flat 27% from 2027.',
        source: 'Belastingplan 2025 / business.gov.nl',
      },
    ],
    related: ['nl-wbso'],
    conflicts_with: [],
    stacks_with: ['nl-innovation-box', 'nl-wbso'],
  },
  {
    name: 'WBSO (R&D payroll tax credit)',
    slug: 'nl-wbso',
    estimate: { kind: 'payroll', rate: 0.12, rough: true },
    country: 'netherlands',
    level: 'national',
    instrument_type: 'payroll_exemption',
    summary:
      'Reduction of payroll tax remittance for hours worked on qualifying R&D projects (S&O). The workhorse of Dutch R&D support and the standard access ticket to the Innovation Box. Applied for in advance with RVO per period.',
    mechanism: 'rule_based',
    needs_verification:
      'Current rates, brackets, and startup uplift must be verified against RVO.nl before relying on figures. Parameters below are indicative of the scheme\'s structure only.',
    parameters: [
      { label: 'Mechanism', value: 'Payroll tax remittance reduction on R&D hours' },
      { label: 'Rates & brackets', value: '[VERIFY against RVO.nl]', notes: 'Two brackets; higher rate for starters' },
      { label: 'Innovation Box link', value: 'S&O declaration qualifies IP for the Innovation Box' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'rd_cooperation'],
      additional_conditions:
        'The Dutch entity must employ the R&D staff and be a Dutch withholding agent. Hours must be logged per project.',
    },
    legal_basis: 'Wet vermindering afdracht loonbelasting en premie voor de volksverzekeringen (WVA)',
    legal_basis_url: 'https://www.rvo.nl/subsidies-financiering/wbso',
    application_process:
      'Apply to RVO before the start of each period (up to 4 periods/year); RVO issues an S&O declaration stating the deductible amount, which the employer settles through payroll tax returns.',
    typical_timeline: 'RVO decision within 3 months of application',
    status: 'active',
    valid_from: '1994-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'RVO.nl — parameters pending verification',
    next_review_date: '2026-08-01',
    changelog: [],
    related: ['nl-innovation-box'],
    conflicts_with: [],
    stacks_with: ['nl-innovation-box', 'nl-expat-ruling'],
  },

  // =========================================================================
  // BELGIUM
  // =========================================================================
  {
    name: 'Partial withholding tax exemption for R&D personnel',
    slug: 'be-rd-withholding-exemption',
    estimate: { kind: 'payroll', rate: 0.18, rough: true },
    country: 'belgium',
    level: 'national',
    instrument_type: 'payroll_exemption',
    summary:
      'Employers of qualifying researchers may retain 80% of the professional withholding tax on their salaries instead of remitting it — an immediate, rule-based reduction of R&D labor cost of roughly 15–20%.',
    mechanism: 'rule_based',
    needs_verification:
      'Current eligible degree categories and any 2025/2026 changes must be verified before relying on scope details.',
    parameters: [
      { label: 'Exemption rate', value: '80% of withholding tax remittance' },
      { label: 'Scope', value: 'Qualifying researchers with eligible degrees on R&D projects/programs' },
      { label: 'Degree categories', value: '[VERIFY current list and 2025/2026 changes]' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'rd_cooperation'],
      additional_conditions:
        'R&D projects/programs must be registered with BELSPO before starting. Degree requirements apply per researcher category.',
    },
    legal_basis: 'Art. 275/3 CIR 92',
    legal_basis_url: 'https://www.belspo.be/',
    application_process:
      'Register R&D projects/programs with BELSPO; apply the exemption directly in periodic payroll withholding tax returns.',
    typical_timeline: 'Immediate via payroll once BELSPO registration is in place',
    status: 'active',
    valid_from: '2006-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'CIR 92 / BELSPO — degree categories pending verification',
    next_review_date: '2026-08-01',
    changelog: [],
    related: ['be-innovation-income-deduction'],
    conflicts_with: [],
    stacks_with: ['be-innovation-income-deduction'],
  },
  {
    name: 'Innovation Income Deduction (Innovatieaftrek)',
    slug: 'be-innovation-income-deduction',
    estimate: { kind: 'ip_box', effRate: 0.0375, rough: true },
    country: 'belgium',
    level: 'national',
    instrument_type: 'ip_box',
    summary:
      'Belgium\'s nexus-conform IP regime: an 85% deduction of qualifying net innovation income, yielding an effective rate below 4% — one of the lowest in the EU. Covers patents and, notably for chip design, copyrighted software.',
    mechanism: 'rule_based',
    needs_verification: 'Current parameters must be verified before relying on the exact effective rate.',
    parameters: [
      { label: 'Effective rate on qualifying IP income', value: '< 4%', notes: '85% deduction against 25% headline rate' },
      { label: 'Nexus conformity', value: 'Yes' },
      { label: 'Qualifying IP', value: 'Patents, supplementary protection certificates, copyrighted software (incl. chip design software)' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: ['fabless', 'ip_licensing', 'idm', 'eda_tools'],
      size_restrictions: 'any',
      revenue_ceiling_meur: 750,
      sector_restrictions: null,
      goals: ['ip_domiciliation', 'design_site'],
      additional_conditions:
        'Nexus ratio limits the benefit to IP developed with own or outsourced-to-third-party R&D. For groups above €750M revenue, the effective benefit is bounded by the 15% GloBE floor.',
    },
    legal_basis: 'Art. 205/1–205/4 CIR 92',
    legal_basis_url: 'https://finances.belgium.be/',
    application_process:
      'Claimed in the corporate income tax return; documentation of nexus ratio and income allocation required. Advance ruling from the Ruling Commission is common practice.',
    typical_timeline: 'Immediate (tax filing); ruling 3–6 months',
    status: 'active',
    valid_from: '2016-07-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'CIR 92 — parameters pending verification',
    next_review_date: '2026-08-01',
    changelog: [],
    related: ['be-rd-withholding-exemption', 'nl-innovation-box'],
    conflicts_with: [],
    stacks_with: ['be-rd-withholding-exemption'],
  },

  // =========================================================================
  // FRANCE
  // =========================================================================
  {
    name: "Crédit d'Impôt Recherche (CIR)",
    slug: 'fr-cir',
    estimate: { kind: 'rd_credit', rate: 0.3, rateSme: 0.3, capLarge: 30_000_000, capSme: 30_000_000 },
    country: 'france',
    level: 'national',
    instrument_type: 'rd_tax_credit',
    summary:
      'Europe\'s largest R&D tax credit by fiscal cost (~€6.6bn/year): 30% of eligible R&D expenses up to €100M, 5% above, declaration-based with no pre-approval. Refundable immediately for SMEs, JEI, and new companies; after 3 years for others. The base was narrowed by LF2025; the credit survived LF2026 unchanged.',
    mechanism: 'rule_based',
    parameters: [
      { label: 'Rate', value: '30% on first €100M of eligible R&D expenses; 5% above' },
      {
        label: 'Refundable',
        value: 'Immediately for SMEs, JEI, new companies; after 3 years for others',
      },
      {
        label: 'Base narrowing (LF2025, from 15 Feb 2025)',
        value: 'Operating cost flat rate cut 43% → 40% of personnel; young-doctors doubling abolished; patent fees and tech-watch expenses excluded',
      },
      {
        label: 'LF2026',
        value: 'CIR unchanged; JEI status, CICo, C3IV extended to 2028',
        notes: 'Anti-relocation clause debated in PLF2026 but NOT adopted',
      },
      { label: 'Estimated annual fiscal cost', value: '€6.6 billion' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'fab_site', 'rd_cooperation', 'pilot_lines'],
      additional_conditions:
        'Expenses must relate to R&D performed in France (or the EEA for some categories). Contract research must go to accredited (agréé) providers.',
    },
    legal_basis: 'Art. 244 quater B CGI; LF2025 Art. 55; Loi n°2026-103 (LF2026, 19 Feb 2026)',
    legal_basis_url:
      'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006304184',
    application_process:
      'Declaration-based: file form 2069-A with the corporate tax return. No pre-approval; optional rescrit (advance ruling) for certainty. Documentation must support the R&D qualification in case of audit.',
    typical_timeline: 'Immediate (tax filing); refund claims processed within months',
    status: 'active',
    valid_from: '1983-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'CGI consolidated text / LF2025 Art. 55 / Loi n°2026-103',
    next_review_date: '2026-12-01',
    changelog: [
      {
        date: '2025-02-15',
        change:
          'LF2025 Art. 55: operating cost flat rate cut from 43% to 40% of personnel costs; young-doctors doubling abolished; patent fees and tech-watch expenses excluded from the base.',
        source: 'Loi de finances 2025, Art. 55',
      },
      {
        date: '2026-02-19',
        change: 'LF2026: CIR unchanged; JEI, CICo, C3IV extended to 2028; anti-relocation clause debated but not adopted.',
        source: 'Loi n°2026-103',
      },
    ],
    related: ['fr-ip-regime'],
    conflicts_with: [],
    stacks_with: ['fr-ip-regime'],
  },
  {
    name: 'French IP regime (Art. 238 CGI)',
    slug: 'fr-ip-regime',
    estimate: { kind: 'ip_box', effRate: 0.1, rough: true },
    country: 'france',
    level: 'national',
    instrument_type: 'ip_box',
    summary:
      'Preferential 10% rate on qualifying net income from patents and patentable inventions (and, under conditions, copyrighted software), replacing the pre-2019 regime with a nexus-conform design.',
    mechanism: 'rule_based',
    needs_verification: 'Current nexus requirements and any recent changes must be verified.',
    parameters: [
      { label: 'Effective rate on qualifying IP income', value: '10%' },
      { label: 'Nexus requirements', value: '[VERIFY current nexus requirements and recent changes]' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: ['fabless', 'ip_licensing', 'idm', 'eda_tools'],
      size_restrictions: 'any',
      revenue_ceiling_meur: 750,
      sector_restrictions: null,
      goals: ['ip_domiciliation', 'design_site'],
      additional_conditions:
        'Election per asset/family of assets; nexus ratio documentation required. For groups above €750M revenue, the benefit is bounded by the 15% GloBE floor.',
    },
    legal_basis: 'Art. 238 CGI',
    legal_basis_url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038612922',
    application_process:
      'Election in the corporate tax return with nexus-ratio documentation per IP asset or product family.',
    typical_timeline: 'Immediate (tax filing)',
    status: 'active',
    valid_from: '2019-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'CGI — nexus details pending verification',
    next_review_date: '2026-08-01',
    changelog: [],
    related: ['fr-cir', 'nl-innovation-box'],
    conflicts_with: [],
    stacks_with: ['fr-cir'],
  },

  // =========================================================================
  // SPAIN
  // =========================================================================
  {
    name: 'PERTE Chip',
    slug: 'es-perte-chip',
    country: 'spain',
    level: 'national',
    instrument_type: 'grant_program',
    summary:
      'Spain\'s strategic project for the recovery and economic transformation of microelectronics and semiconductors — the largest announced national semiconductor funding envelope in the EU, with a dedicated design pillar covering fabless capability building and R&D.',
    mechanism: 'discretionary',
    needs_verification:
      'Current budget, execution status, and eligibility for non-Spanish firms must be verified before relying on this entry.',
    parameters: [
      { label: 'Design pillar', value: 'Yes — dedicated pillar for chip design capabilities' },
      { label: 'Budget & execution status', value: '[VERIFY current budget and execution status]' },
      { label: 'Eligibility for non-Spanish firms', value: '[VERIFY]' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'fab_site', 'rd_cooperation'],
      additional_conditions:
        'Call-based; conditions vary per convocatoria. Spanish establishment generally required.',
    },
    legal_basis: 'PERTE Chip (Council of Ministers agreement, May 2022) and individual convocatorias',
    legal_basis_url: 'https://www.lamoncloa.gob.es/asuntoseconomicos/perte/Paginas/perte-chip.aspx',
    application_process: 'Respond to individual convocatorias (calls) under the PERTE framework.',
    typical_timeline: 'Call-dependent',
    status: 'active',
    valid_from: '2022-05-24',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'La Moncloa / PERTE Chip — status pending verification',
    next_review_date: '2026-08-01',
    changelog: [],
    related: ['eu-chips-ju-eurocdp'],
    conflicts_with: [],
    stacks_with: [],
  },

  // =========================================================================
  // EU LEVEL
  // =========================================================================
  {
    name: 'EIC Accelerator',
    slug: 'eu-eic-accelerator',
    country: 'eu',
    level: 'eu',
    instrument_type: 'grant_program',
    summary:
      'The European Innovation Council\'s flagship instrument for deep-tech SMEs: grants up to €2.5M plus equity investments of €0.5–10M+. Semiconductors are listed as a strategic priority with investment safeguards. Requires establishment in the EU or an associated country.',
    mechanism: 'discretionary',
    parameters: [
      { label: '2026 budget', value: '€634M' },
      { label: 'Grant', value: 'Up to €2.5M' },
      { label: 'Equity', value: '€0.5–10M+ (EIC Fund)' },
      { label: 'Strategic priority', value: 'Semiconductors listed, with investment safeguards' },
    ],
    eligibility: {
      hq_countries: 'eu_plus_associated',
      requires_local_entity: true,
      requires_local_rd_substance: false,
      business_models: null,
      size_restrictions: 'sme_only',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'rd_cooperation', 'pilot_lines'],
      additional_conditions:
        'Applicant must be an SME (or small mid-cap for equity-only) established in an EU member state or Horizon Europe associated country. A non-EU parent may hold the entity, subject to ownership screening under the investment safeguards for strategic technologies.',
    },
    legal_basis: 'Horizon Europe Regulation (EU) 2021/695; EIC Work Programme 2026',
    legal_basis_url: 'https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_en',
    application_process:
      'Continuous short application; full application to cut-off dates; jury interview. Grant agreement and/or EIC Fund investment on success.',
    typical_timeline: '6–12 months from short application to funding',
    status: 'active',
    valid_from: '2021-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'EIC Work Programme 2026',
    next_review_date: '2026-12-01',
    changelog: [],
    related: ['eu-eic-step-scale-up'],
    conflicts_with: [],
    stacks_with: ['de-forschungszulage', 'fr-cir'],
  },
  {
    name: 'EIC STEP Scale Up',
    slug: 'eu-eic-step-scale-up',
    country: 'eu',
    level: 'eu',
    instrument_type: 'grant_program',
    summary:
      'Equity instrument for European deep-tech scale-ups under the Strategic Technologies for Europe Platform: €10–30M EIC Fund investments contingent on €50M+ private co-investment. Digital & deep tech — including semiconductors — is a focus area.',
    mechanism: 'discretionary',
    parameters: [
      { label: '2026 budget', value: '€300M' },
      { label: 'Equity ticket', value: '€10–30M' },
      { label: 'Co-investment requirement', value: '€50M+ private co-investment' },
      { label: 'Focus', value: 'Digital & Deep Tech including semiconductors' },
    ],
    eligibility: {
      hq_countries: 'eu_plus_associated',
      requires_local_entity: true,
      requires_local_rd_substance: false,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'fab_site'],
      additional_conditions:
        'Aimed at scale-ups raising large growth rounds; the company must be established in the EU or an associated country and pass strategic-technology ownership screening.',
    },
    legal_basis: 'STEP Regulation (EU) 2024/795; EIC Work Programme 2026',
    legal_basis_url: 'https://eic.ec.europa.eu/eic-funding-opportunities/eic-step-scale-up_en',
    application_process: 'Application to EIC with investor syndicate; due diligence by the EIC Fund.',
    typical_timeline: '6–12 months',
    status: 'active',
    valid_from: '2024-01-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'EIC Work Programme 2026',
    next_review_date: '2026-12-01',
    changelog: [],
    related: ['eu-eic-accelerator'],
    conflicts_with: [],
    stacks_with: [],
  },
  {
    name: 'Chips JU / European Chips Design Platform (EuroCDP)',
    slug: 'eu-chips-ju-eurocdp',
    country: 'eu',
    level: 'eu',
    instrument_type: 'infrastructure_access',
    summary:
      'The Chips Joint Undertaking funds design infrastructure open to companies: the European Chips Design Platform provides cloud-based EDA tools, IP libraries, design enablement, and routes to prototyping. Consortium calls require an EU partner and national co-funding; cumulative RISC-V investment is around €500M.',
    mechanism: 'hybrid',
    needs_verification: 'Cumulative RISC-V investment figure (~€500M) to be verified against work programmes.',
    parameters: [
      { label: 'Platform services', value: 'Cloud-based EDA tools, IP libraries, design enablement, prototyping access' },
      { label: 'Consortium requirement', value: 'EU partner and national co-funding for calls' },
      { label: 'Cumulative RISC-V investment', value: '~€500M', notes: '[VERIFY against work programmes]' },
      { label: 'Platform status', value: 'Rollout ongoing (2026)' },
    ],
    eligibility: {
      hq_countries: 'eu_plus_associated',
      requires_local_entity: true,
      requires_local_rd_substance: false,
      business_models: ['fabless', 'ip_licensing', 'idm', 'eda_tools'],
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'rd_cooperation', 'pilot_lines'],
      additional_conditions:
        'Platform access (EDA/IP) has lighter conditions than consortium funding, which requires an EU-established partner and matching national co-funding through the Chips JU tripartite model.',
    },
    legal_basis: 'Chips JU (Council Regulation (EU) 2023/1782); annual work programmes',
    legal_basis_url: 'https://www.chips-ju.europa.eu/',
    application_process:
      'Platform access via EuroCDP onboarding; funding via Chips JU calls (consortium applications with national funding agency involvement).',
    typical_timeline: 'Platform access: weeks. Calls: 6–12 months.',
    status: 'active',
    valid_from: '2023-09-01',
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'chips-ju.europa.eu / work programmes (platform rollout ongoing)',
    next_review_date: '2026-10-01',
    changelog: [],
    related: ['eu-chips-act-2', 'de-designinitiative-mikroelektronik'],
    conflicts_with: [],
    stacks_with: ['de-forschungszulage', 'fr-cir'],
  },
  {
    name: 'Chips Act 2.0 provisions',
    slug: 'eu-chips-act-2',
    country: 'eu',
    level: 'eu',
    instrument_type: 'state_aid_scheme',
    summary:
      'PROPOSED — not yet law. The Commission proposal of 3 June 2026 would expand first-of-a-kind (FOAK) support across the full value chain including design, add Grand Challenges for AI chips, create Strategic Projects with EU co-investment, and link demand via CADA. Ownership-and-control criteria are still in the legislative procedure.',
    mechanism: 'discretionary',
    parameters: [
      { label: 'FOAK scope', value: 'Expanded across full value chain, including design' },
      { label: 'Grand Challenges', value: 'AI chips' },
      { label: 'Strategic Projects', value: 'EU co-investment' },
      { label: 'Demand linkage', value: 'CADA' },
      { label: 'Ownership-and-control criteria', value: 'Details in legislative procedure' },
      { label: 'Status', value: 'Commission proposal 3 June 2026; Parliament and Council forming positions' },
    ],
    eligibility: {
      hq_countries: 'any',
      requires_local_entity: true,
      requires_local_rd_substance: true,
      business_models: null,
      size_restrictions: 'any',
      revenue_ceiling_meur: null,
      sector_restrictions: null,
      goals: ['design_site', 'fab_site', 'pilot_lines', 'rd_cooperation'],
      additional_conditions:
        'Not yet applicable — final eligibility (including ownership-and-control criteria) depends on the outcome of the legislative procedure. Track for planning purposes only.',
    },
    legal_basis: 'Commission proposal of 3 June 2026 (Chips Act revision) — NOT YET LAW',
    legal_basis_url: 'https://digital-strategy.ec.europa.eu/en/policies/european-chips-act',
    application_process: 'Not yet applicable; instruments will be defined once the regulation is adopted.',
    typical_timeline: 'Legislative procedure ongoing; adoption timing uncertain',
    status: 'proposed',
    valid_from: null,
    valid_until: null,
    last_verified: '2026-07-03',
    verification_source: 'European Commission proposal, 3 June 2026',
    next_review_date: '2026-09-01',
    changelog: [
      {
        date: '2026-06-03',
        change: 'Commission proposal published; Parliament and Council forming positions.',
        source: 'European Commission',
      },
    ],
    related: ['eu-chips-ju-eurocdp'],
    conflicts_with: [],
    stacks_with: [],
  },
];

export const getInstrument = (slug: string): Instrument | undefined =>
  instruments.find((i) => i.slug === slug);

export const instrumentsByCountry = (countrySlug: string): Instrument[] =>
  instruments.filter((i) => i.country === countrySlug);
