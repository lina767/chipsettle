import type { LegalStep } from '../lib/types';

/** Collection: legal_steps — practical steps for establishing a presence. */
export const legalSteps: LegalStep[] = [
  {
    country: 'germany',
    step_type: 'company_formation',
    title: 'Form a GmbH (limited liability company)',
    entity_kind: 'legal_entity',
    description:
      'Standard vehicle for a German design subsidiary. Notarized articles of association, share capital of €25,000 (min. €12,500 paid in at registration), registration in the commercial register (Handelsregister). Gives full liability separation from the parent and is required for most grant programs, which contract with a separate legal entity.',
    typical_timeline: '2–6 weeks',
    requirements:
      'Notarized formation deed; managing director (no residency requirement, but practical availability needed); German business address; bank account for capital deposit.',
    costs: '€25,000 share capital (€12,500 paid in) + ~€1,500–3,000 notary/registration fees',
    source_url: 'https://www.existenzgruender.de/',
    last_verified: '2026-07-03',
  },
  {
    country: 'germany',
    step_type: 'company_formation',
    title: 'Register a Zweigniederlassung (branch office)',
    entity_kind: 'branch',
    description:
      'A lighter alternative to a GmbH: the existing foreign company registers a branch with the Handelsregister and the Finanzamt, without forming a new legal entity. A German branch is a taxable permanent establishment (Betriebsstätte), which is sufficient to claim most rule-based fiscal instruments — including the Forschungszulage — since those attach to German tax liability, not to a specific legal form. You give up liability separation: the foreign parent is directly liable. Most grant programs still require a separate legal entity.',
    typical_timeline: '2–4 weeks',
    requirements:
      'Excerpt from the foreign company\'s home register (apostilled/legalized as needed); German business address; registered branch manager (Zweigniederlassungsleiter).',
    costs: '~€200–500 notary/registration fees; no minimum capital',
    source_url: 'https://www.existenzgruender.de/',
    last_verified: '2026-07-03',
  },
  {
    country: 'germany',
    step_type: 'company_formation',
    title: 'Employer of Record (no local entity)',
    entity_kind: 'eor',
    description:
      'Fastest way to have engineers on the ground: a third-party EOR provider formally employs your German staff and handles payroll, social security, and wage tax, while you keep operational control. No German entity is formed at all. Trade-off: you are not the taxpayer performing the R&D, so this route generally disqualifies you from the Forschungszulage and most instruments that require the applicant to be the domestic entity claiming its own costs. Best treated as a bridge, not a long-term structure, if fiscal instruments matter to you.',
    typical_timeline: 'Days to ~2 weeks',
    requirements: 'Service agreement with an EOR/PEO provider; no German registration of your own company needed.',
    costs: 'Market rate, provider-dependent — commonly quoted as a per-employee monthly service fee',
    source_url: 'https://www.make-it-in-germany.com/en/working-in-germany',
    last_verified: '2026-07-03',
  },
  {
    country: 'germany',
    step_type: 'visa_work_permit',
    title: 'EU Blue Card / skilled worker residence (§18b AufenthG)',
    description:
      'Primary route for non-EU design engineers. Reduced salary threshold applies for shortage occupations, which include electrical engineering and IT professions.',
    typical_timeline: '1–3 months (faster via the accelerated skilled-worker procedure, §81a AufenthG)',
    requirements:
      'Recognized degree; employment contract meeting the salary threshold (annually adjusted; reduced threshold for shortage occupations); employer cooperation for the accelerated procedure.',
    costs: '€100–411 in fees depending on procedure',
    source_url: 'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
    last_verified: '2026-07-03',
  },
  {
    country: 'germany',
    step_type: 'rd_certification',
    title: 'BSFZ certification for the Forschungszulage',
    description:
      'Before claiming the research allowance, each R&D project must be certified as qualifying R&D by the Bescheinigungsstelle Forschungszulage (BSFZ). The certificate binds the tax office on the R&D qualification.',
    typical_timeline: '~3 months per application',
    requirements:
      'Project description demonstrating novelty, uncertainty, and systematic approach (Frascati criteria); can be applied for before, during, or after the project.',
    costs: 'Free of charge',
    source_url: 'https://www.bescheinigung-forschungszulage.de/',
    last_verified: '2026-07-03',
  },
  {
    country: 'germany',
    step_type: 'tax_registration',
    title: 'Tax registration (Finanzamt) and trade registration',
    description:
      'Register the new entity with the local trade office (Gewerbeanmeldung) and complete the tax office questionnaire (Fragebogen zur steuerlichen Erfassung) to obtain tax numbers and VAT ID.',
    typical_timeline: '2–6 weeks after formation',
    requirements: 'Commercial register excerpt; business address; managing director details.',
    costs: '€20–60 trade registration fee',
    source_url: 'https://www.elster.de/',
    last_verified: '2026-07-03',
  },
  {
    country: 'netherlands',
    step_type: 'company_formation',
    title: 'Form a BV (private limited company)',
    entity_kind: 'legal_entity',
    description:
      'Standard vehicle for a Dutch design subsidiary. Notarial deed of incorporation; minimum capital of €0.01; registration with the KVK (Chamber of Commerce). Gives full liability separation and is generally required to hold and license IP under the Innovation Box on your own account.',
    typical_timeline: '1–2 weeks',
    requirements: 'Notarial deed; Dutch registered address; UBO registration.',
    costs: '~€1,000–2,500 notary fees + €80 KVK registration',
    source_url: 'https://business.gov.nl/starting-your-business/choosing-a-business-structure/besloten-vennootschap-bv/',
    last_verified: '2026-07-03',
  },
  {
    country: 'netherlands',
    step_type: 'company_formation',
    title: 'Register a branch (buitenlandse vennootschap) with the KVK',
    entity_kind: 'branch',
    description:
      'A foreign company can register a Dutch branch instead of incorporating a BV. The branch becomes a Vpb (corporate tax) taxpayer on its Dutch activity, which is generally sufficient for WBSO and the Innovation Box on the branch\'s own qualifying R&D — but you keep the parent company\'s liability and lose the separate legal personality most grant applications expect.',
    typical_timeline: '~1–2 weeks',
    requirements: 'Excerpt from the foreign company\'s home register; Dutch business address.',
    costs: '€80 KVK registration; minimal notary cost',
    source_url: 'https://business.gov.nl/starting-your-business/choosing-a-business-structure/setting-up-a-branch-office/',
    last_verified: '2026-07-03',
  },
  {
    country: 'netherlands',
    step_type: 'visa_work_permit',
    title: 'Highly skilled migrant scheme (kennismigrant)',
    description:
      'Fast-track work authorization for non-EU engineers via an IND-recognized sponsor. The Dutch entity must first register as a recognized sponsor.',
    typical_timeline: '2 weeks (application) once sponsor recognition (~3 months) is in place',
    requirements: 'IND-recognized sponsorship; salary threshold (age-dependent, annually indexed).',
    costs: '~€4,560 sponsor recognition (SMEs ~€2,280) + ~€380 per application',
    source_url: 'https://ind.nl/en/residence-permits/work/highly-skilled-migrant',
    last_verified: '2026-07-03',
  },
];

export const legalStepsByCountry = (countrySlug: string): LegalStep[] =>
  legalSteps.filter((s) => s.country === countrySlug);
