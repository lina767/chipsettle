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
    fdi_screening: {
      applies_to_sector: true,
      covers_greenfield: 'check_current_rules',
      threshold: '10% voting rights for non-EU/EFTA investors (lowered from 20% once semiconductors were added to the sector-specific list)',
      authority: 'BMWE (Bundesministerium für Wirtschaft und Energie), in consultation with other ministries',
      typical_timeline: '2 months initial review (extendable to 4), further months if escalated to in-depth review',
      legal_basis: 'Außenwirtschaftsgesetz (AWG) & Außenwirtschaftsverordnung (AWV); a unified Investitionsprüfungsgesetz (IPG) was in drafting for 2026',
      legal_basis_url: 'https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Artikel/Foreign-Trade/investment-screening.html',
      notes:
        'Historically targets acquisitions of existing German companies/voting rights, not the formation of a brand-new subsidiary from scratch — a greenfield GmbH you form yourself is typically outside scope. This is actively changing: the regime has been expanding (semiconductors added to the sensitive-sector list, thresholds lowered) and the 2025 EU-level reform designates semiconductors "hyper-critical." Relevant if your plan involves acquiring an existing German design house, IP portfolio, or taking a stake — verify current scope before any such deal.',
      last_verified: '2026-07-03',
    },
    labor_law: {
      works_council_threshold: 'Betriebsrat may be established once ≥5 permanent, eligible employees exist, if requested by staff',
      notice_periods: 'Statutory minimum 4 weeks to the 15th or end of a month (§622 BGB), extending up to 7 months for 20+ years of tenure',
      collective_bargaining: 'Not automatically binding unless the employer joins an employer association or a CBA is declared generally binding; IG Metall is the relevant sectoral union for much of electronics/semiconductors',
      notes: 'Co-determination rights (Mitbestimmungsgesetz/BetrVG) scale with company/works-council size — relevant mainly as headcount grows past the first few hires.',
      last_verified: '2026-07-03',
    },
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
    fdi_screening: {
      applies_to_sector: true,
      covers_greenfield: 'check_current_rules',
      threshold:
        'No flat percentage for "highly sensitive technology" (incl. semiconductors, quantum, photonics) — triggered by acquiring control or significant influence rather than a fixed voting-rights line',
      authority: 'Bureau Toetsing Investeringen (BTI), Ministry of Economic Affairs',
      typical_timeline: 'Initial assessment ~8 weeks, extendable for in-depth review',
      legal_basis: 'Wet veiligheidstoets investeringen, fusies en overnames (Vifo-wet), in force since June 2023',
      legal_basis_url: 'https://business.gov.nl/',
      notes:
        'Semiconductor technology is explicitly listed as "highly sensitive" under the Vifo-wet\'s technology decree, alongside quantum and photonics — a lower bar than the general regime. As with Germany, greenfield formation of a new entity is less commonly the trigger than acquiring or taking a controlling stake in an existing Dutch company; guidance narrowed scope in 2025 to genuine technical involvement (development/modification/integration), excluding purely commercial resale.',
      last_verified: '2026-07-03',
    },
    labor_law: {
      works_council_threshold: 'Ondernemingsraad (OR) mandatory at 50+ employees; personeelsvertegenwoordiging (PVT) for 10–49',
      notice_periods: 'Statutory notice scales with tenure (1–4 months); UWV or cantonal-court procedure required for dismissal, plus a statutory transition payment (transitievergoeding)',
      collective_bargaining: 'Sector CBAs common but less universal than in BE/FR/ES for tech roles; individually negotiated contracts are standard for senior engineers',
      notes: '',
      last_verified: '2026-07-03',
    },
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
    fdi_screening: {
      applies_to_sector: true,
      covers_greenfield: 'check_current_rules',
      threshold: '10% voting rights for technologies essential to public security/defence (incl. semiconductors); 25% for general critical infrastructure',
      authority: 'Interfederal Screening Mechanism (federal + regional cooperation)',
      typical_timeline: 'Not centrally published; build in several weeks to months for a full assessment',
      legal_basis: 'Cooperation Agreement of 30 November 2022; federal FDI screening mechanism in force since July 2023',
      legal_basis_url: 'https://www.belgium.be/',
      notes:
        'Semiconductors sit in the lower-threshold "essential for public security and defence" category. The EU-level FDI screening reform (political agreement Dec 2025) designates semiconductors a "hyper-critical technology" that all member states will be required to screen, which is expected to prompt further adjustments here.',
      last_verified: '2026-07-03',
    },
    labor_law: {
      works_council_threshold: 'Works council (ondernemingsraad/CE) mandatory at 100+ employees; CPBW/CPPT (health & safety committee) at 50+',
      notice_periods: 'Governed by the 2014 unified status law — notice periods scale with seniority and are comparatively long by EU standards',
      collective_bargaining: 'Sector joint committees (paritair comité) set binding sector-wide minimum terms — the metal/electronics joint committees (209/210-adjacent) are typically relevant for semiconductor employers',
      notes: '',
      last_verified: '2026-07-03',
    },
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
    fdi_screening: {
      applies_to_sector: true,
      covers_greenfield: 'check_current_rules',
      threshold: '25% voting rights generally; 10% on a temporary basis for sensitive listed companies; acquiring a business unit can also trigger review',
      authority: 'Direction Générale du Trésor (Bercy) — Bureau CIEF',
      typical_timeline: '~30 working days initial phase, up to 45 further working days if escalated to in-depth review',
      legal_basis: 'Code monétaire et financier, Art. L151-3; IEF guidelines revised 30 July 2025',
      legal_basis_url: 'https://www.tresor.economie.gouv.fr/',
      notes:
        'Among the most active EU regimes (417 filings reported for 2025). Semiconductors are explicitly listed as a critical technology, and scope was recently expanded so both R&D activity and production of critical technologies trigger mandatory screening (previously R&D-only) — this is one of the few regimes where setting up new R&D activity, not just acquiring an existing company, can itself be in scope. Verify current guidance before committing to a specific structure.',
      last_verified: '2026-07-03',
    },
    labor_law: {
      works_council_threshold: 'Comité Social et Économique (CSE) mandatory at 11+ employees, with expanded competencies at 50+',
      notice_periods: 'Set primarily by the applicable convention collective (sector CBA) rather than statute — Syntec (engineering/tech services) is the common reference for design/R&D roles',
      collective_bargaining: 'Very influential — sector CBAs routinely set minimum salary grids, notice periods, and redundancy procedures (PSE) for larger layoffs',
      notes: '',
      last_verified: '2026-07-03',
    },
  },
  {
    name: 'Spain',
    code: 'ES',
    slug: 'spain',
    flag_emoji: '🇪🇸',
    general_corporate_tax_rate: 25,
    pillar_two_implemented: true,
    notes:
      '25% headline rate. PERTE Chip is the largest national semiconductor funding envelope in the EU by announced volume and includes a dedicated design pillar; execution has been slower than announced.',
    last_verified: '2026-07-03',
    fdi_screening: {
      applies_to_sector: true,
      covers_greenfield: 'check_current_rules',
      threshold: '10% of share capital or effective management control, for a non-Spanish investor into a sensitive-sector target; temporarily extended to EU/EFTA investors for deals >€500M or listed targets through end of 2026',
      authority: 'Consejo de Ministros, via the Dirección General de Comercio Internacional e Inversiones',
      typical_timeline: 'Several months for a full authorization; can extend materially for complex/contested cases',
      legal_basis: 'Law 19/2003, Art. 7 bis; Royal Decree 571/2023; extended by Real Decreto-ley 1/2025',
      legal_basis_url: 'https://comercio.gob.es/en-us/inversiones_exteriores/paginas/control-inversiones.aspx',
      notes:
        'Semiconductors are explicitly listed among the critical technologies and dual-use products covered. As elsewhere, the regime is built around acquiring a stake/control in an existing Spanish target — a new subsidiary formed from scratch is generally not itself the trigger, but any acquisition, JV, or asset deal involving Spanish semiconductor capability should be checked against current guidance.',
      last_verified: '2026-07-03',
    },
    labor_law: {
      works_council_threshold: 'Comité de empresa mandatory at 50+ employees; delegados de personal (staff delegates) for 6–49',
      notice_periods: 'Statutory minimum 15 calendar days (Estatuto de los Trabajadores), but 86.7% of the workforce is covered by a convenio colectivo that often extends this to 30 days–3 months',
      collective_bargaining: 'Very influential — sector convenios colectivos largely set salary grids and conditions; statutory severance is 20 days\' salary/year (objective dismissal, capped at 12 months) or 33 days/year (unfair dismissal, capped at 24 months)',
      notes: '',
      last_verified: '2026-07-03',
    },
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
      'EU-level instruments (EIC, Chips JU, Chips Act) apply on top of national instruments and generally require establishment in an EU member state or an associated country. EU-level results are shown for every target-country selection. Separately, a political agreement (Dec 2025) on a reformed EU FDI Screening Regulation designates semiconductors a "hyper-critical technology" that all member states will be required to screen — expect national regimes to keep converging and tightening.',
    last_verified: '2026-07-03',
  },
];

export const getCountry = (slug: string): Country | undefined =>
  countries.find((c) => c.slug === slug);

/** Countries selectable as targets in the wizard (excludes the EU pseudo-entry). */
export const targetableCountries = countries.filter((c) => c.slug !== 'eu');

/** Countries with seeded national instruments (used for "compare all"). */
export const seededCountrySlugs = ['germany', 'netherlands', 'belgium', 'france', 'spain'];
