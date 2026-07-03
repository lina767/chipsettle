import type { Country } from '../lib/types';

/**
 * Collection: countries
 * Combined typical corporate income tax rates (incl. local/trade surcharges
 * where they routinely apply). All EU member states have transposed the
 * Pillar Two directive (Council Directive (EU) 2022/2523).
 */
export const countries: Country[] = [
  {
    name: 'Germany',
    code: 'DE',
    slug: 'germany',
    flag_emoji: '🇩🇪',
    general_corporate_tax_rate: 29.9,
    pillar_two_implemented: true,
    notes:
      'Combined burden of ~15.8% corporate income tax (incl. solidarity surcharge) plus trade tax (varies by municipality, typically ~14%). No IP box — deliberately positioned against preferential IP regimes via the Lizenzschranke (§4j EStG). Strength lies in the rule-based Forschungszulage and dense research infrastructure (Fraunhofer, Silicon Saxony, Munich).',
    last_verified: '2026-07-03',
  },
  {
    name: 'Netherlands',
    code: 'NL',
    slug: 'netherlands',
    flag_emoji: '🇳🇱',
    general_corporate_tax_rate: 25.8,
    pillar_two_implemented: true,
    notes:
      '25.8% headline rate (19% up to €200k). Most complete fiscal package for design settlement: Innovation Box (9% on qualifying IP income), WBSO payroll credit, and the expat ruling — all rule-based. Brainport Eindhoven anchors the ecosystem.',
    last_verified: '2026-07-03',
  },
  {
    name: 'Belgium',
    code: 'BE',
    slug: 'belgium',
    flag_emoji: '🇧🇪',
    general_corporate_tax_rate: 25,
    pillar_two_implemented: true,
    notes:
      '25% headline rate. Strong payroll-side support for R&D employers (80% withholding tax exemption for researchers) and one of the lowest effective IP-income rates in the EU via the innovation income deduction. imec in Leuven is a world-leading R&D anchor.',
    last_verified: '2026-07-03',
  },
  {
    name: 'France',
    code: 'FR',
    slug: 'france',
    flag_emoji: '🇫🇷',
    general_corporate_tax_rate: 25.8,
    pillar_two_implemented: true,
    notes:
      '25% headline rate plus a 3.3% social surcharge for larger companies. The Crédit d\'Impôt Recherche is Europe\'s largest R&D tax credit by fiscal cost (~€6.6bn/year), declaration-based with no pre-approval. Base was narrowed by LF2025; the credit itself survived LF2026 unchanged.',
    last_verified: '2026-07-03',
  },
  {
    name: 'Spain',
    code: 'ES',
    slug: 'spain',
    flag_emoji: '🇪🇸',
    general_corporate_tax_rate: 25,
    pillar_two_implemented: true,
    notes:
      '25% headline rate. PERTE Chip is the largest national semiconductor funding envelope in the EU by announced volume and includes a dedicated design pillar; execution has been slower than announced. [Coverage note: Spanish fiscal R&D instruments not yet seeded.]',
    last_verified: '2026-07-03',
  },
  {
    name: 'Ireland',
    code: 'IE',
    slug: 'ireland',
    flag_emoji: '🇮🇪',
    general_corporate_tax_rate: 12.5,
    pillar_two_implemented: true,
    notes:
      '12.5% trading rate (15% for groups in Pillar Two scope). [Coverage note: Irish instruments (R&D tax credit, Knowledge Development Box) are not yet seeded in this database.]',
    last_verified: '2026-07-03',
  },
  {
    name: 'Italy',
    code: 'IT',
    slug: 'italy',
    flag_emoji: '🇮🇹',
    general_corporate_tax_rate: 27.8,
    pillar_two_implemented: true,
    notes:
      '24% IRES plus ~3.9% IRAP. [Coverage note: Italian instruments (patent box super-deduction, transizione credits) are not yet seeded in this database.]',
    last_verified: '2026-07-03',
  },
  {
    name: 'Austria',
    code: 'AT',
    slug: 'austria',
    flag_emoji: '🇦🇹',
    general_corporate_tax_rate: 23,
    pillar_two_implemented: true,
    notes:
      '23% headline rate. [Coverage note: Austrian instruments (Forschungsprämie 14%) are not yet seeded in this database.]',
    last_verified: '2026-07-03',
  },
  {
    name: 'European Union',
    code: 'EU',
    slug: 'eu',
    flag_emoji: '🇪🇺',
    general_corporate_tax_rate: null,
    pillar_two_implemented: true,
    notes:
      'EU-level instruments (EIC, Chips JU, Chips Act) apply on top of national instruments and generally require establishment in an EU member state or an associated country. EU-level results are shown for every target-country selection.',
    last_verified: '2026-07-03',
  },
];

export const getCountry = (slug: string): Country | undefined =>
  countries.find((c) => c.slug === slug);

/** Countries selectable as targets in the wizard (excludes the EU pseudo-entry). */
export const targetableCountries = countries.filter((c) => c.slug !== 'eu');

/** Countries with seeded national instruments (used for "compare all"). */
export const seededCountrySlugs = ['germany', 'netherlands', 'belgium', 'france', 'spain'];
