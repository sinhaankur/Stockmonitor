// Stock geo-dependency engine
// ---------------------------------------------------------------------------
// Models the "internal wiring" of a stock's geopolitical exposure: the
// critical minerals and key-energy inputs it depends on, which countries
// dominate the production / processing of those inputs, and which maritime
// chokepoints the supply must transit.
//
// Producer / processor country concentration is derived from the app's real
// curated datasets (MINING_SITES, PROCESSING_PLANTS) rather than hand-written
// guesses, so the wiring stays internally consistent with the rest of the app.

import { MINING_SITES, PROCESSING_PLANTS, type MineralType } from '@/config/commodity-geo';
import { CHOKEPOINT_REGISTRY } from '@/config/chokepoint-registry';
import type { StockCatalogEntry } from '@/services/stock-monitor';

export type GeoRiskLevel = 'low' | 'medium' | 'high';

/** A key energy input — narrower than minerals, modelled explicitly. */
export type EnergyInput =
  | 'Crude Oil'
  | 'Natural Gas / LNG'
  | 'Refined Fuels'
  | 'Grid Electricity'
  | 'Uranium / Nuclear Fuel'
  | 'Thermal Coal';

export interface MineralDependency {
  mineral: MineralType;
  /** Why this stock depends on the mineral. */
  reason: string;
  /** How central the mineral is to the business (drives weighting). */
  intensity: GeoRiskLevel;
  /** Producer-side country concentration, derived from MINING_SITES. */
  topProducers: CountryShare[];
  /** Processing/refining country concentration, derived from PROCESSING_PLANTS. */
  topProcessors: CountryShare[];
  /** 0-100 — how concentrated production+processing is in few countries. */
  concentrationScore: number;
  concentrationRisk: GeoRiskLevel;
}

export interface EnergyDependency {
  input: EnergyInput;
  reason: string;
  intensity: GeoRiskLevel;
  /** Source regions/countries this energy input typically flows from. */
  sourceRegions: string[];
}

export interface CountryShare {
  country: string;
  code: string;
  /** Share of curated sites for the mineral, 0-100. */
  sharePct: number;
  sites: number;
}

export interface ChokepointExposure {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** Which dependency drives this chokepoint exposure. */
  drivers: string[];
  risk: GeoRiskLevel;
}

export interface StockGeoDependencies {
  minerals: MineralDependency[];
  energy: EnergyDependency[];
  chokepoints: ChokepointExposure[];
  /** 0-100 composite of mineral concentration + energy + chokepoint load. */
  geoDependencyScore: number;
  geoDependencyLevel: GeoRiskLevel;
  /** Short human summary of the dominant dependency, for quick-take lines. */
  headline: string | null;
}

// --- Country name → ISO2 (covers the producing/processing countries) --------

const COUNTRY_CODE_BY_NAME: Record<string, string> = {
  Australia: 'AU', USA: 'US', 'United States': 'US', 'South Africa': 'ZA', DRC: 'CD',
  'Democratic Republic of the Congo': 'CD', Chile: 'CL', China: 'CN', Russia: 'RU', Peru: 'PE',
  Canada: 'CA', Namibia: 'NA', Indonesia: 'ID', Ghana: 'GH', Argentina: 'AR', Zambia: 'ZM',
  Mexico: 'MX', Brazil: 'BR', Zimbabwe: 'ZW', Uzbekistan: 'UZ', Switzerland: 'CH', Sweden: 'SE',
  Poland: 'PL', Philippines: 'PH', 'Papua New Guinea': 'PG', 'New Caledonia': 'NC', Mongolia: 'MN',
  Kazakhstan: 'KZ', Kyrgyzstan: 'KG', Malaysia: 'MY', Mali: 'ML', Kenya: 'KE', Germany: 'DE',
  Belgium: 'BE', Greenland: 'GL', 'Dominican Republic': 'DO', Taiwan: 'TW', Japan: 'JP',
  'South Korea': 'KR', 'Saudi Arabia': 'SA', Qatar: 'QA', 'United Arab Emirates': 'AE', Norway: 'NO',
};

function codeForCountry(name: string): string {
  return COUNTRY_CODE_BY_NAME[name] ?? '';
}

// --- Producer / processor concentration, computed once from curated data ----

interface MineralConcentration {
  producers: CountryShare[];
  processors: CountryShare[];
  concentrationScore: number;
  concentrationRisk: GeoRiskLevel;
}

function tallyShares(countByCountry: Map<string, number>, total: number): CountryShare[] {
  if (total <= 0) return [];
  return [...countByCountry.entries()]
    .map(([country, sites]) => ({
      country,
      code: codeForCountry(country),
      sites,
      sharePct: (sites / total) * 100,
    }))
    .sort((a, b) => b.sharePct - a.sharePct || a.country.localeCompare(b.country))
    .slice(0, 4);
}

/** Herfindahl-style concentration (0-100): higher = fewer countries dominate. */
function herfindahl(countByCountry: Map<string, number>, total: number): number {
  if (total <= 0) return 0;
  let sum = 0;
  for (const sites of countByCountry.values()) {
    const share = sites / total;
    sum += share * share;
  }
  return Math.round(sum * 100);
}

function riskFromScore(score: number): GeoRiskLevel {
  if (score >= 67) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function buildMineralConcentrationIndex(): Map<MineralType, MineralConcentration> {
  const producersByMineral = new Map<MineralType, Map<string, number>>();
  const processorsByMineral = new Map<MineralType, Map<string, number>>();

  const bump = (index: Map<MineralType, Map<string, number>>, mineral: MineralType, country: string) => {
    let inner = index.get(mineral);
    if (!inner) {
      inner = new Map();
      index.set(mineral, inner);
    }
    inner.set(country, (inner.get(country) ?? 0) + 1);
  };

  for (const site of MINING_SITES) {
    if (site.status === 'closed') continue;
    bump(producersByMineral, site.mineral, site.country);
  }
  for (const plant of PROCESSING_PLANTS) {
    if (plant.status === 'idle') continue;
    bump(processorsByMineral, plant.mineral, plant.country);
    for (const extra of plant.materials ?? []) {
      if (isMineralType(extra)) bump(processorsByMineral, extra, plant.country);
    }
  }

  const minerals = new Set<MineralType>([...producersByMineral.keys(), ...processorsByMineral.keys()]);
  const index = new Map<MineralType, MineralConcentration>();
  for (const mineral of minerals) {
    const prod = producersByMineral.get(mineral) ?? new Map();
    const proc = processorsByMineral.get(mineral) ?? new Map();
    const prodTotal = [...prod.values()].reduce((a, b) => a + b, 0);
    const procTotal = [...proc.values()].reduce((a, b) => a + b, 0);
    // Processing concentration matters most for supply security; weight it higher.
    const prodHhi = herfindahl(prod, prodTotal);
    const procHhi = herfindahl(proc, procTotal);
    const concentrationScore = procTotal > 0
      ? Math.round(prodHhi * 0.4 + procHhi * 0.6)
      : prodHhi;
    index.set(mineral, {
      producers: tallyShares(prod, prodTotal),
      processors: tallyShares(proc, procTotal),
      concentrationScore,
      concentrationRisk: riskFromScore(concentrationScore),
    });
  }
  return index;
}

const MINERAL_TYPES: ReadonlySet<string> = new Set<MineralType>([
  'Gold', 'Silver', 'Copper', 'Lithium', 'Cobalt', 'Rare Earths', 'Nickel', 'Platinum',
  'Palladium', 'Iron Ore', 'Uranium', 'Aluminum', 'Zinc', 'Lead', 'Tin', 'Manganese',
  'Chromium', 'Coal', 'Molybdenum',
]);

function isMineralType(value: string): value is MineralType {
  return MINERAL_TYPES.has(value);
}

const MINERAL_CONCENTRATION = buildMineralConcentrationIndex();

// --- Stock → mineral / energy input wiring ----------------------------------

interface MineralInput {
  mineral: MineralType;
  reason: string;
  intensity: GeoRiskLevel;
}

interface EnergyInputDef {
  input: EnergyInput;
  reason: string;
  intensity: GeoRiskLevel;
  sourceRegions: string[];
}

interface DependencyProfile {
  minerals: MineralInput[];
  energy: EnergyInputDef[];
}

// Per-ticker overrides for the most material, well-understood dependencies.
const TICKER_PROFILE: Record<string, DependencyProfile> = {
  NVDA: profile(
    [
      ['Rare Earths', 'GPU magnets, capacitors, and advanced packaging materials.', 'high'],
      ['Copper', 'Interconnect, datacenter power, and board-level wiring.', 'medium'],
      ['Gold', 'Bonding wires and high-reliability contacts.', 'low'],
    ],
    [['Grid Electricity', 'AI fab and datacenter power demand.', 'medium', ['Taiwan', 'United States', 'East Asia grid']]],
  ),
  AMD: profile(
    [
      ['Rare Earths', 'Specialty magnets and dielectric materials in chips.', 'high'],
      ['Copper', 'Interconnect and packaging substrate wiring.', 'medium'],
      ['Tin', 'Solder for advanced packaging and assembly.', 'medium'],
    ],
    [['Grid Electricity', 'Foundry and assembly/test power.', 'medium', ['Taiwan', 'Malaysia']]],
  ),
  TSM: profile(
    [
      ['Rare Earths', 'Polishing slurries, magnets, and process chemicals.', 'high'],
      ['Copper', 'On-chip interconnect and fab utilities.', 'medium'],
      ['Tin', 'Bumping and packaging solder.', 'medium'],
    ],
    [['Grid Electricity', 'Leading-edge fabs are extremely power-intensive.', 'high', ['Taiwan']]],
  ),
  INTC: profile(
    [
      ['Rare Earths', 'Magnets and process materials for fabs.', 'high'],
      ['Copper', 'Interconnect and packaging.', 'medium'],
      ['Gold', 'Bonding and contacts.', 'low'],
    ],
    [['Grid Electricity', 'Domestic and Israeli fab power load.', 'medium', ['United States', 'Israel', 'Ireland']]],
  ),
  ASML: profile(
    [
      ['Rare Earths', 'Precision optics, magnets, and laser components.', 'high'],
      ['Tin', 'EUV light source uses molten-tin plasma droplets.', 'high'],
      ['Copper', 'Tooling and assemblies.', 'low'],
    ],
    [['Grid Electricity', 'Manufacturing and customer fab dependence.', 'low', ['Netherlands', 'Taiwan']]],
  ),
  AVGO: profile(
    [
      ['Rare Earths', 'RF filters and magnetics.', 'high'],
      ['Copper', 'Networking silicon and interconnect.', 'medium'],
      ['Tin', 'Advanced packaging solder.', 'medium'],
    ],
    [['Grid Electricity', 'Foundry-dependent fabrication.', 'medium', ['Taiwan']]],
  ),
  AAPL: profile(
    [
      ['Rare Earths', 'Speakers, haptics (Taptic Engine), and camera magnets.', 'high'],
      ['Cobalt', 'Lithium-ion battery cathodes.', 'high'],
      ['Lithium', 'Battery cells across the device lineup.', 'high'],
      ['Gold', 'Logic-board contacts and connectors.', 'low'],
    ],
    [['Grid Electricity', 'Contract-manufacturing power in Asia.', 'medium', ['China', 'India', 'Vietnam']]],
  ),
  TSLA: profile(
    [
      ['Lithium', 'EV battery cells — core cost and supply driver.', 'high'],
      ['Cobalt', 'High-nickel cathodes (where used).', 'high'],
      ['Nickel', 'Energy-dense cathode chemistry.', 'high'],
      ['Copper', 'Motors, wiring harness, and charging.', 'high'],
      ['Rare Earths', 'Permanent-magnet traction motors.', 'high'],
    ],
    [['Grid Electricity', 'Gigafactory production and charging network.', 'medium', ['United States', 'China', 'Germany']]],
  ),
  AQN: profile(
    [['Copper', 'Grid build-out, transformers, and wiring.', 'high'], ['Rare Earths', 'Wind-turbine permanent magnets.', 'medium']],
    [
      ['Grid Electricity', 'Core regulated utility output.', 'high', ['United States', 'Canada']],
      ['Natural Gas / LNG', 'Gas-fired generation fuel.', 'medium', ['North America']],
    ],
  ),
  ENB: profile(
    [['Iron Ore', 'Steel for pipeline construction.', 'low'], ['Copper', 'Compression, metering, and electrical systems.', 'low']],
    [
      ['Crude Oil', 'Liquids pipelines move crude across North America.', 'high', ['Canada', 'United States']],
      ['Natural Gas / LNG', 'Gas transmission and utility franchises.', 'high', ['North America']],
    ],
  ),
  XOM: profile(
    [['Copper', 'Facility electrification and equipment.', 'low']],
    [
      ['Crude Oil', 'Upstream production is the core asset.', 'high', ['United States', 'Guyana', 'Middle East']],
      ['Natural Gas / LNG', 'Integrated gas and LNG portfolio.', 'high', ['United States', 'Qatar']],
      ['Refined Fuels', 'Downstream refining and chemicals.', 'medium', ['Gulf Coast', 'Singapore']],
    ],
  ),
  BA: profile(
    [
      ['Aluminum', 'Airframe structures and fuselage.', 'high'],
      ['Rare Earths', 'Avionics, actuators, and defense electronics.', 'high'],
      ['Nickel', 'Superalloys for engines and hot sections.', 'medium'],
      ['Tin', 'Electronics solder.', 'low'],
    ],
    [['Refined Fuels', 'Jet-fuel cost shapes airline demand.', 'medium', ['Global refining']]],
  ),
  DSX: profile(
    [['Iron Ore', 'Dry-bulk cargo demand is iron ore + coal led.', 'medium'], ['Coal', 'Thermal/coking coal freight volumes.', 'medium']],
    [['Refined Fuels', 'Bunker fuel is the dominant operating cost.', 'high', ['Global bunkering', 'Singapore']]],
  ),
  BABA: profile(
    [['Rare Earths', 'Datacenter and consumer-electronics supply chain.', 'medium'], ['Copper', 'Cloud infrastructure build-out.', 'medium']],
    [['Grid Electricity', 'Cloud datacenter power.', 'medium', ['China']]],
  ),
  AMZN: profile(
    [['Copper', 'AWS datacenter power and networking.', 'medium'], ['Rare Earths', 'Server and device components.', 'medium']],
    [['Grid Electricity', 'Hyperscale datacenter load.', 'high', ['United States', 'Europe']]],
  ),
  MSFT: profile(
    [['Copper', 'Cloud datacenter electrical build-out.', 'medium'], ['Rare Earths', 'Server hardware components.', 'medium']],
    [['Grid Electricity', 'Azure datacenter power demand.', 'high', ['United States', 'Europe']]],
  ),
  GOOGL: profile(
    [['Copper', 'Datacenter power and networking.', 'medium'], ['Rare Earths', 'TPU/server hardware.', 'medium']],
    [['Grid Electricity', 'Hyperscale datacenter load.', 'high', ['United States']]],
  ),
  META: profile(
    [['Copper', 'AI datacenter electrical infrastructure.', 'medium'], ['Rare Earths', 'Server and AR/VR hardware.', 'medium']],
    [['Grid Electricity', 'AI datacenter power build-out.', 'high', ['United States']]],
  ),
};

// Sector/industry fallback templates when a ticker has no explicit profile.
function profileForSector(entry: StockCatalogEntry): DependencyProfile {
  const sector = entry.sector.toLowerCase();
  const industry = entry.industry.toLowerCase();

  if (industry.includes('semiconductor')) {
    return profile(
      [['Rare Earths', 'Process materials and magnets.', 'high'], ['Copper', 'Interconnect.', 'medium'], ['Tin', 'Packaging solder.', 'medium']],
      [['Grid Electricity', 'Fab power intensity.', 'high', ['East Asia']]],
    );
  }
  if (sector.includes('energy') || industry.includes('oil') || industry.includes('gas') || industry.includes('pipeline')) {
    return profile(
      [['Iron Ore', 'Steel infrastructure.', 'low']],
      [['Crude Oil', 'Hydrocarbon production/transport.', 'high', ['Middle East', 'North America']], ['Natural Gas / LNG', 'Gas value chain.', 'high', ['Global']]],
    );
  }
  if (sector.includes('utilit')) {
    return profile(
      [['Copper', 'Grid wiring and transformers.', 'high']],
      [['Grid Electricity', 'Core generation output.', 'high', ['Domestic grid']], ['Natural Gas / LNG', 'Generation fuel.', 'medium', ['Regional']]],
    );
  }
  if (industry.includes('aerospace') || industry.includes('defense')) {
    return profile(
      [['Aluminum', 'Airframe structures.', 'high'], ['Rare Earths', 'Defense electronics.', 'high'], ['Nickel', 'Engine superalloys.', 'medium']],
      [['Refined Fuels', 'Jet-fuel-linked demand.', 'medium', ['Global']]],
    );
  }
  if (industry.includes('shipping')) {
    return profile(
      [['Iron Ore', 'Dry-bulk cargo mix.', 'medium'], ['Coal', 'Bulk freight volumes.', 'medium']],
      [['Refined Fuels', 'Bunker fuel cost.', 'high', ['Global bunkering']]],
    );
  }
  if (industry.includes('electric vehicle') || industry.includes('automotive')) {
    return profile(
      [['Lithium', 'EV batteries.', 'high'], ['Cobalt', 'Cathodes.', 'high'], ['Nickel', 'Cathodes.', 'high'], ['Copper', 'Motors and wiring.', 'high'], ['Rare Earths', 'Traction motors.', 'high']],
      [['Grid Electricity', 'Manufacturing and charging.', 'medium', ['Global']]],
    );
  }
  if (sector.includes('technology') || sector.includes('communication') || industry.includes('cloud') || industry.includes('internet') || industry.includes('software') || industry.includes('streaming') || industry.includes('social')) {
    return profile(
      [['Copper', 'Datacenter power and networking.', 'medium'], ['Rare Earths', 'Server hardware.', 'medium']],
      [['Grid Electricity', 'Datacenter power demand.', 'medium', ['United States', 'Europe']]],
    );
  }
  // Financials, healthcare, consumer staples — light, indirect geo wiring.
  return profile(
    [['Copper', 'Indirect exposure via facilities and broad economic demand.', 'low']],
    [['Grid Electricity', 'Operational power use.', 'low', ['Domestic grid']]],
  );
}

function profile(
  minerals: Array<[MineralType, string, GeoRiskLevel]>,
  energy: Array<[EnergyInput, string, GeoRiskLevel, string[]]>,
): DependencyProfile {
  return {
    minerals: minerals.map(([mineral, reason, intensity]) => ({ mineral, reason, intensity })),
    energy: energy.map(([input, reason, intensity, sourceRegions]) => ({ input, reason, intensity, sourceRegions })),
  };
}

// --- Chokepoint wiring ------------------------------------------------------
// Map a dependency's source geography to the maritime chokepoints its supply
// must transit. Keyed by canonical chokepoint id from CHOKEPOINT_REGISTRY.

const CHOKEPOINT_BY_ID = new Map(CHOKEPOINT_REGISTRY.map((c) => [c.id, c]));

const MINERAL_CHOKEPOINTS: Partial<Record<MineralType, string[]>> = {
  'Rare Earths': ['malacca_strait', 'taiwan_strait', 'korea_strait'],
  Cobalt: ['cape_of_good_hope', 'bab_el_mandeb', 'suez', 'malacca_strait'],
  Lithium: ['panama', 'malacca_strait'],
  Nickel: ['malacca_strait', 'lombok_strait'],
  Copper: ['panama', 'cape_of_good_hope'],
  'Iron Ore': ['malacca_strait', 'cape_of_good_hope'],
  Tin: ['malacca_strait'],
  Aluminum: ['malacca_strait', 'suez'],
  Coal: ['malacca_strait', 'cape_of_good_hope'],
};

const ENERGY_CHOKEPOINTS: Partial<Record<EnergyInput, string[]>> = {
  'Crude Oil': ['hormuz_strait', 'malacca_strait', 'bab_el_mandeb', 'suez'],
  'Natural Gas / LNG': ['hormuz_strait', 'malacca_strait', 'suez', 'panama'],
  'Refined Fuels': ['hormuz_strait', 'malacca_strait', 'suez', 'bab_el_mandeb'],
  'Uranium / Nuclear Fuel': ['bosphorus'],
  'Thermal Coal': ['malacca_strait', 'lombok_strait'],
};

const HIGH_RISK_CHOKEPOINTS = new Set(['hormuz_strait', 'bab_el_mandeb', 'taiwan_strait', 'suez']);
const MEDIUM_RISK_CHOKEPOINTS = new Set(['malacca_strait', 'bosphorus', 'kerch_strait', 'panama']);

function chokepointRisk(id: string): GeoRiskLevel {
  if (HIGH_RISK_CHOKEPOINTS.has(id)) return 'high';
  if (MEDIUM_RISK_CHOKEPOINTS.has(id)) return 'medium';
  return 'low';
}

const INTENSITY_WEIGHT: Record<GeoRiskLevel, number> = { high: 1, medium: 0.6, low: 0.3 };

// --- Public resolver --------------------------------------------------------

export function resolveStockGeoDependencies(entry: StockCatalogEntry): StockGeoDependencies {
  const base = TICKER_PROFILE[entry.ticker] ?? profileForSector(entry);

  const minerals: MineralDependency[] = base.minerals.map((dep) => {
    const conc = MINERAL_CONCENTRATION.get(dep.mineral);
    return {
      mineral: dep.mineral,
      reason: dep.reason,
      intensity: dep.intensity,
      topProducers: conc?.producers ?? [],
      topProcessors: conc?.processors ?? [],
      concentrationScore: conc?.concentrationScore ?? 0,
      concentrationRisk: conc?.concentrationRisk ?? 'low',
    };
  });

  const energy: EnergyDependency[] = base.energy.map((dep) => ({
    input: dep.input,
    reason: dep.reason,
    intensity: dep.intensity,
    sourceRegions: dep.sourceRegions,
  }));

  const chokepoints = resolveChokepoints(minerals, energy);

  // Composite score: mineral concentration (weighted by intensity) + energy
  // intensity + chokepoint load, normalised to 0-100.
  let mineralLoad = 0;
  let mineralWeight = 0;
  for (const dep of minerals) {
    const w = INTENSITY_WEIGHT[dep.intensity];
    mineralLoad += dep.concentrationScore * w;
    mineralWeight += w;
  }
  const mineralComponent = mineralWeight > 0 ? mineralLoad / mineralWeight : 0;

  const energyComponent = energy.length > 0
    ? (energy.reduce((sum, dep) => sum + INTENSITY_WEIGHT[dep.intensity], 0) / energy.length) * 100
    : 0;

  const chokepointComponent = chokepoints.length > 0
    ? Math.min(100, chokepoints.reduce((sum, cp) => sum + INTENSITY_WEIGHT[cp.risk] * 25, 0))
    : 0;

  const geoDependencyScore = Math.round(
    mineralComponent * 0.5 + energyComponent * 0.25 + chokepointComponent * 0.25,
  );

  return {
    minerals,
    energy,
    chokepoints,
    geoDependencyScore,
    geoDependencyLevel: riskFromScore(geoDependencyScore),
    headline: buildHeadline(minerals, energy, chokepoints),
  };
}

function resolveChokepoints(minerals: MineralDependency[], energy: EnergyDependency[]): ChokepointExposure[] {
  const byId = new Map<string, { drivers: Set<string>; risk: GeoRiskLevel }>();

  const add = (ids: string[] | undefined, driver: string) => {
    if (!ids) return;
    for (const id of ids) {
      if (!CHOKEPOINT_BY_ID.has(id)) continue;
      const existing = byId.get(id);
      if (existing) {
        existing.drivers.add(driver);
      } else {
        byId.set(id, { drivers: new Set([driver]), risk: chokepointRisk(id) });
      }
    }
  };

  for (const dep of minerals) {
    if (dep.intensity === 'low') continue;
    add(MINERAL_CHOKEPOINTS[dep.mineral], dep.mineral);
  }
  for (const dep of energy) {
    if (dep.intensity === 'low') continue;
    add(ENERGY_CHOKEPOINTS[dep.input], dep.input);
  }

  const riskRank: Record<GeoRiskLevel, number> = { high: 0, medium: 1, low: 2 };
  return [...byId.entries()]
    .map(([id, info]) => {
      const cp = CHOKEPOINT_BY_ID.get(id)!;
      return {
        id,
        name: cp.displayName,
        lat: cp.lat,
        lon: cp.lon,
        drivers: [...info.drivers],
        risk: info.risk,
      };
    })
    .sort((a, b) => riskRank[a.risk] - riskRank[b.risk] || b.drivers.length - a.drivers.length)
    .slice(0, 6);
}

function buildHeadline(
  minerals: MineralDependency[],
  energy: EnergyDependency[],
  chokepoints: ChokepointExposure[],
): string | null {
  const criticalMineral = minerals
    .filter((m) => m.intensity === 'high')
    .sort((a, b) => b.concentrationScore - a.concentrationScore)[0];
  const topChokepoint = chokepoints[0];
  const criticalEnergy = energy.find((e) => e.intensity === 'high');

  if (criticalMineral) {
    const top = criticalMineral.topProcessors[0] ?? criticalMineral.topProducers[0];
    const loc = top ? ` — concentrated in ${top.country} (${Math.round(top.sharePct)}%)` : '';
    return `Most exposed to ${criticalMineral.mineral}${loc}.`;
  }
  if (criticalEnergy) {
    return `Key energy dependency: ${criticalEnergy.input} from ${criticalEnergy.sourceRegions[0] ?? 'global supply'}.`;
  }
  if (topChokepoint) {
    return `Supply transits the ${topChokepoint.name} chokepoint.`;
  }
  return null;
}
