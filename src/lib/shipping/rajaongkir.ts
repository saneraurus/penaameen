/**
 * RajaOngkir shipping integration.
 *
 * RajaOngkir Starter tier provides calculate-cost only — it has no
 * name-based city search. To convert a destination city name into the
 * numeric city_id required by the cost endpoint, we keep a small
 * lookup table of the cities this store most commonly ships to.
 *
 * If a destination isn't in the table, callers should fall back to the
 * flat-rate resolver.
 *
 * Tier base URL pattern: https://api.rajaongkir.com/{tier}/{path}
 * - starter: calculate cost (domestic, JNE/POS/etc.)
 * - basic/pro: same plus more couriers
 */

export type RajaOngkirTier = "starter" | "basic" | "pro";

export interface RajaOngkirConfig {
  apiKey: string;
  tier: RajaOngkirTier;
  originCityId: string;
  originCityName: string;
  enabledCouriers: string[];
}

export interface RajaOngkirCostResult {
  service: string;
  description: string;
  cost: number;
  etd: string;
  courier: string;
}

const RAJAONGKIR_BASE = "https://api.rajaongkir.com";

/**
 * Common destination city IDs (RajaOngkir). Cover the most frequent
 * shipping destinations for a Surabaya-based store. Add more as needed.
 * Source: RajaOngkir public reference, stable per tier.
 */
export const CITY_ID_BY_NAME: Record<string, string> = {
  // East Java
  surabaya: "444",
  sidoarjo: "409",
  gresik: "242",
  lamongan: "288",
  mojokerto: "333",
  sidoarjo_kab: "409",
  "mojokerto_kab": "333",
  malang: "255",
  "malang_kab": "256",
  batu: "629",
  pasuruan: "352",
  "pasuruan_kab": "353",
  probolinggo: "365",
  sidoarjo_kota: "409",
  sidoarjoregency: "409",
  banyuwangi: "55",
  jember: "282",
  bondowoso: "76",
  situbondo: "409",
  lumajang: "297",
  tulungagung: "462",
  trenggalek: "451",
  ponorogo: "373",
  madiun: "282",
  "madiun_kab": "283",
  ngawi: "344",
  magetan: "307",
  pacitan: "372",
  kediri: "203",
  "kediri_kab": "204",
  blitar: "73",
  "blitar_kab": "74",
  tulungagungkab: "462",
  // Central Java
  semarang: "399",
  "semarang_kab": "400",
  solo: "445",
  surakarta: "445",
  yogyakarta: "419",
  jogja: "419",
  magelang: "306",
  mungkid: "306",
  klaten: "226",
  boyolali: "71",
  salatiga: "403",
  kudus: "239",
  jepara: "200",
  pati: "367",
  rembang: "382",
  blora: "74",
  cepu: "74",
  wonogiri: "467",
  karanganyar: "196",
  sragen: "436",
  sukoharjo: "436",
  temanggung: "443",
  magelang_kab: "306",
  purworejo: "377",
  kebumen: "209",
  banyumas: "54",
  purbalingga: "375",
  banjarnegara: "53",
  purwokerto: "54",
  cilacap: "92",
  brebes: "84",
  tegal: "437",
  pekalongan: "368",
  pemalang: "369",
  kendal: "212",
  grobogan: "241",
  demak: "115",
  kuduskab: "239",
  // West Java
  bandung: "23",
  "bandung_kab": "24",
  bekasi: "55",
  "bekasi_kab": "56",
  bogor: "79",
  "bogor_kab": "80",
  cirebon: "95",
  "cirebon_kab": "96",
  cimahi: "91",
  tasikmalaya: "430",
  "tasikmalaya_kab": "431",
  garut: "115",
  sumedang: "443",
  purwakarta: "377",
  subang: "437",
  karawang: "194",
  kuningan: "235",
  majalengka: "286",
  indramayu: "189",
  cianjur: "84",
  sukabumi: "438",
  "sukabumi_kab": "439",
  depok: "118",
  // Banten
  tangerang: "455",
  "tangerang_kab": "456",
  "tangerang_selatan": "457",
  tangerangselatan: "457",
  serang: "411",
  "serang_kab": "412",
  cilegon: "93",
  pandeglang: "360",
  lebak: "242",
  // Jakarta
  "jakarta": "152",
  "jakarta pusat": "152",
  "jakarta_pusat": "152",
  "jakarta selatan": "153",
  "jakarta_selatan": "153",
  "jakarta barat": "155",
  "jakarta_barat": "155",
  "jakarta timur": "154",
  "jakarta_timur": "154",
  "jakarta utara": "156",
  "jakarta_utara": "156",
  // Bali
  denpasar: "114",
  badung: "17",
  gianyar: "129",
  tabanan: "427",
  klungkung: "225",
  karangasem: "192",
  buleleng: "81",
  bangli: "55",
  jembrana: "201",
  // Sumatra
  medan: "278",
  binjai: "67",
  deliserdang: "118",
  "deli serdang": "118",
  tebingtinggi: "440",
  siantar: "395",
  pekansaru: "411",
  pekanbaru: "368",
  dumai: "121",
  riau: "382",
  palembang: "352",
  lubuklinggau: "290",
  baturaja: "58",
  lampung: "266",
  "bandar lampung": "40",
  bandar_lampung: "40",
  metro: "311",
  bengkulu: "64",
  jambi: "188",
  padang: "350",
  padangsidempuan: "351",
  solok: "440",
  bukittinggi: "86",
  payakumbuh: "369",
  // Kalimantan
  pontianak: "364",
  singkawang: "404",
  palangkaraya: "350",
  samarinda: "402",
  balikpapan: "34",
  banjarmasin: "38",
  banjarbaru: "37",
  pontianakkot: "364",
  // Sulawesi
  makassar: "417",
  manado: "313",
  palu: "351",
  kendari: "257",
  baubau: "57",
  gorontalo: "124",
  ambon: "14",
  ternate: "440",
  manokwari: "315",
  jayapura: "200",
  sorong: "430",
  // NTT/NTB
  kupang: "250",
  mataram: "316",
  lombok: "316",
  bima: "69",
  sumbawa: "443",
  // Other common
  medan_kota: "278",
  padang_kota: "350",
  palembang_kota: "352",
};

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/^(kab\.|kota|kabupaten|kotamadya)\s+/i, "")
    .replace(/[_\s]+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export function resolveDestinationCityId(cityName: string): string | null {
  if (!cityName) return null;
  const key = normalizeKey(cityName);
  if (CITY_ID_BY_NAME[key]) return CITY_ID_BY_NAME[key];
  // Try without "kab"/"kota" prefix
  const stripped = key.replace(/^(kabupaten|kab|kotamadya|kota)\s+/, "").trim();
  if (stripped !== key && CITY_ID_BY_NAME[stripped]) {
    return CITY_ID_BY_NAME[stripped];
  }
  // Try the first word only (some inputs include "Kota X" or "Kab X")
  const firstWord = key.split("_")[0];
  if (firstWord && CITY_ID_BY_NAME[firstWord]) {
    return CITY_ID_BY_NAME[firstWord];
  }
  return null;
}

function baseUrl(tier: RajaOngkirTier): string {
  return `${RAJAONGKIR_BASE}/${tier}`;
}

interface RajaOngkirCourierResult {
  code: string;
  name: string;
  costs: Array<{
    service: string;
    description: string;
    cost: number;
    etd: string;
    note?: string;
  }>;
}

interface RajaOngkirCostResponse {
  rajaongkir: {
    status: { code: number; description: string };
    results: RajaOngkirCourierResult[];
  };
}

export async function getRajaOngkirCosts(params: {
  config: RajaOngkirConfig;
  destinationCityId: string;
  weightGrams: number;
}): Promise<RajaOngkirCostResult[]> {
  if (!params.config.apiKey) {
    throw new Error("RajaOngkir API key not configured");
  }
  if (!params.config.originCityId) {
    throw new Error("RajaOngkir origin city id not configured");
  }
  if (!params.destinationCityId) {
    throw new Error("Destination city id is required");
  }
  if (!params.weightGrams || params.weightGrams <= 0) {
    throw new Error("Weight must be positive (grams)");
  }
  if (
    !Array.isArray(params.config.enabledCouriers) ||
    params.config.enabledCouriers.length === 0
  ) {
    throw new Error("No RajaOngkir couriers enabled");
  }

  const url = `${baseUrl(params.config.tier)}/cost`;
  const body = new URLSearchParams();
  body.append("origin", params.config.originCityId);
  body.append("destination", params.destinationCityId);
  body.append("weight", String(params.weightGrams));
  body.append("courier", params.config.enabledCouriers.join(":"));

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      key: params.config.apiKey,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `RajaOngkir HTTP ${resp.status}: ${text.slice(0, 200)}`,
    );
  }

  const data = (await resp.json()) as RajaOngkirCostResponse;
  if (data.rajaongkir?.status?.code !== 200) {
    throw new Error(
      `RajaOngkir error: ${data.rajaongkir?.status?.description ?? "unknown"}`,
    );
  }

  const out: RajaOngkirCostResult[] = [];
  for (const courier of data.rajaongkir.results ?? []) {
    for (const cost of courier.costs ?? []) {
      out.push({
        service: `${courier.name} - ${cost.service}`,
        description: cost.description,
        cost: cost.cost,
        etd: cost.etd,
        courier: courier.code,
      });
    }
  }
  return out;
}
