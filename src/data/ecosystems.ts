import type { Ecosystem } from '../lib/types';

/** Collection: ecosystems — regional hubs relevant for semiconductor design. */
export const ecosystems: Ecosystem[] = [
  {
    name: 'Silicon Saxony',
    slug: 'silicon-saxony',
    country: 'germany',
    region: 'Saxony',
    city: 'Dresden',
    strengths: ['logic', 'analog_mixed_signal', 'power', 'mems_sensors', 'riscv_open_isa'],
    industries: ['automotive', 'industrial_automation', 'consumer_electronics'],
    key_institutions: [
      {
        name: 'Fraunhofer FMD (Forschungsfabrik Mikroelektronik Deutschland)',
        type: 'Research network',
        relevance: 'One-stop access to 13 Fraunhofer institutes and 2 Leibniz institutes for microelectronics R&D.',
      },
      {
        name: 'Fraunhofer IPMS / IIS-EAS',
        type: 'Research institute',
        relevance: 'Design methodology, IP cores, and system integration in Dresden.',
      },
      {
        name: 'TU Dresden',
        type: 'University',
        relevance: 'Largest microelectronics academic cluster in Germany; talent pipeline.',
      },
    ],
    cluster_programs: [
      {
        name: 'Silicon Saxony e.V.',
        url: 'https://silicon-saxony.de/',
        description: 'Europe\'s largest microelectronics cluster organization (~500 members).',
      },
    ],
    notes:
      'Europe\'s largest semiconductor manufacturing location (Infineon, GlobalFoundries, Bosch, TSMC/ESMC), with a growing design layer on top of the manufacturing base.',
    last_verified: '2026-07-03',
    senior_engineer_cost_eur: { min: 80_000, max: 105_000 },
  },
  {
    name: 'Munich / Bavaria',
    slug: 'munich-bavaria',
    country: 'germany',
    region: 'Bavaria',
    city: 'Munich',
    strengths: ['analog_mixed_signal', 'power', 'rf_mmwave', 'ai_accelerators', 'eda_design_tools'],
    industries: ['automotive', 'robotics', 'industrial_automation', 'aerospace_defense'],
    key_institutions: [
      {
        name: 'TU München',
        type: 'University',
        relevance: 'Leading chip-design and EDA research; talent pipeline.',
      },
      {
        name: 'Fraunhofer EMFT',
        type: 'Research institute',
        relevance: 'Flexible electronics and sensor integration.',
      },
    ],
    cluster_programs: [
      {
        name: 'Bavarian Chips Alliance',
        url: 'https://www.bayern-innovativ.de/',
        description: 'Bavarian state initiative bundling chip design, research, and industry.',
      },
    ],
    notes:
      'Strong analog/mixed-signal and automotive design footprint (Infineon HQ, Apple, Intel, NXP design sites); the deepest pool of experienced design engineers in Germany.',
    last_verified: '2026-07-03',
    senior_engineer_cost_eur: { min: 100_000, max: 130_000 },
  },
  {
    name: 'Brainport Eindhoven',
    slug: 'brainport-eindhoven',
    country: 'netherlands',
    region: 'North Brabant',
    city: 'Eindhoven',
    strengths: ['photonics', 'analog_mixed_signal', 'power', 'eda_design_tools', 'advanced_packaging'],
    industries: ['robotics', 'industrial_automation', 'automotive', 'telecom_5g'],
    key_institutions: [
      {
        name: 'TU Eindhoven',
        type: 'University',
        relevance: 'Integrated photonics and mixed-signal design research.',
      },
      {
        name: 'PhotonDelta',
        type: 'Ecosystem/pilot line access',
        relevance: 'National photonic-chips growth fund and pilot production access.',
      },
    ],
    cluster_programs: [
      {
        name: 'Brainport Development',
        url: 'https://brainporteindhoven.com/',
        description: 'Regional development agency; soft-landing support for foreign companies.',
      },
    ],
    notes:
      'Anchored by ASML and NXP; the densest equipment-and-design ecosystem in Europe, with strong soft-landing support for foreign entrants.',
    last_verified: '2026-07-03',
    senior_engineer_cost_eur: { min: 105_000, max: 140_000 },
  },
  {
    name: 'Leuven',
    slug: 'leuven',
    country: 'belgium',
    region: 'Flemish Brabant',
    city: 'Leuven',
    strengths: ['logic', 'advanced_packaging', 'photonics', 'mems_sensors', 'ai_accelerators'],
    industries: ['medical_devices', 'biotech', 'automotive', 'industrial_automation', 'telecom_5g'],
    key_institutions: [
      {
        name: 'imec',
        type: 'Research institute / pilot line',
        relevance:
          'World-leading nanoelectronics R&D center; sub-2nm pilot line, IC-link MPW shuttle services for fabless design.',
      },
      {
        name: 'KU Leuven',
        type: 'University',
        relevance: 'MICAS lab — top analog/RF design group in Europe.',
      },
    ],
    cluster_programs: [
      {
        name: 'DSP Valley',
        url: 'https://dspvalley.com/',
        description: 'Smart-electronics cluster spanning Flanders and the Netherlands.',
      },
    ],
    notes:
      'imec is the single strongest R&D-cooperation anchor in Europe: companies can work with advanced nodes without owning a fab.',
    last_verified: '2026-07-03',
    senior_engineer_cost_eur: { min: 90_000, max: 125_000 },
  },
  {
    name: 'Grenoble',
    slug: 'grenoble',
    country: 'france',
    region: 'Auvergne-Rhône-Alpes',
    city: 'Grenoble',
    strengths: ['logic', 'riscv_open_isa', 'photonics', 'mems_sensors', 'power'],
    industries: ['automotive', 'aerospace_defense', 'industrial_automation', 'medical_devices', 'biotech'],
    key_institutions: [
      {
        name: 'CEA-Leti',
        type: 'Research institute / pilot line',
        relevance: 'FD-SOI, photonics, and advanced memory pilot lines; strong RISC-V program.',
      },
      {
        name: 'Grenoble INP / UGA',
        type: 'University',
        relevance: 'Microelectronics engineering pipeline.',
      },
    ],
    cluster_programs: [
      {
        name: 'Minalogic',
        url: 'https://www.minalogic.com/',
        description: 'Global innovation cluster for digital technologies in Auvergne-Rhône-Alpes.',
      },
    ],
    notes:
      'STMicroelectronics and Soitec anchor the valley; CEA-Leti provides pilot-line and RISC-V cooperation routes.',
    last_verified: '2026-07-03',
    senior_engineer_cost_eur: { min: 95_000, max: 135_000 },
  },
];

export const ecosystemsByCountry = (countrySlug: string): Ecosystem[] =>
  ecosystems.filter((e) => e.country === countrySlug);
