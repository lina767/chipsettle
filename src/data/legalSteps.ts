import type { LegalStep } from '../lib/types';

/** Collection: legal_steps — practical steps for establishing a presence. */
export const legalSteps: LegalStep[] = [
  {
    country: 'germany',
    step_type: 'company_formation',
    title: 'Form a GmbH (limited liability company)',
    description:
      'Standard vehicle for a German design subsidiary. Notarized articles of association, share capital of €25,000 (min. €12,500 paid in at registration), registration in the commercial register (Handelsregister).',
    typical_timeline: '2–6 weeks',
    requirements:
      'Notarized formation deed; managing director (no residency requirement, but practical availability needed); German business address; bank account for capital deposit.',
    costs: '€25,000 share capital (€12,500 paid in) + ~€1,500–3,000 notary/registration fees',
    source_url: 'https://www.existenzgruender.de/',
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
    description:
      'Standard vehicle for a Dutch design subsidiary. Notarial deed of incorporation; minimum capital of €0.01; registration with the KVK (Chamber of Commerce).',
    typical_timeline: '1–2 weeks',
    requirements: 'Notarial deed; Dutch registered address; UBO registration.',
    costs: '~€1,000–2,500 notary fees + €80 KVK registration',
    source_url: 'https://business.gov.nl/starting-your-business/choosing-a-business-structure/besloten-vennootschap-bv/',
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
