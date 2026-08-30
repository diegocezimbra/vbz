import polygonsData from "./data/coverage-polygons.json";

export interface CoveragePolygon {
  id: number;
  name: string;
  points: [number, number][];
  centroid: [number, number];
  bbox: [number, number, number, number];
}

export interface CepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface CepPoint {
  lat: number;
  lon: number;
  source: string;
}

export interface PolygonCoverageResult {
  address: CepAddress | null;
  point: CepPoint | null;
  matchedAreas: string[];
}

const polygons = polygonsData as CoveragePolygon[];

const VIACEP_TIMEOUT_MS = 6_000;
const GEOCODE_TIMEOUT_MS = 8_000;

export function normalizeCep(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function pointInPolygon(lon: number, lat: number, points: [number, number][]): boolean {
  let inside = false;
  let j = points.length - 1;

  for (let i = 0; i < points.length; i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const crosses = yi > lat !== yj > lat;
    if (crosses) {
      const xIntersect = ((xj - xi) * (lat - yi)) / (yj - yi || 1e-15) + xi;
      if (lon < xIntersect) inside = !inside;
    }
    j = i;
  }

  return inside;
}

export function areasForPoint(lon: number, lat: number): string[] {
  return polygons
    .filter((polygon) => pointInPolygon(lon, lat, polygon.points))
    .map((polygon) => polygon.name);
}

export async function fetchCepAddress(cepRaw: string): Promise<CepAddress | null> {
  const cep = normalizeCep(cepRaw);
  if (!cep) return null;

  const digits = cep.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    signal: AbortSignal.timeout(VIACEP_TIMEOUT_MS),
  });
  const body = (await response.json()) as Record<string, string | boolean | undefined>;
  if (body.erro) return null;

  return {
    cep,
    logradouro: String(body.logradouro ?? ""),
    bairro: String(body.bairro ?? ""),
    cidade: String(body.localidade ?? ""),
    uf: String(body.uf ?? ""),
  };
}

export async function geocodeCep(address: CepAddress): Promise<CepPoint | null> {
  if (address.cidade) {
    const params = new URLSearchParams({
      format: "jsonv2",
      country: "Brazil",
      state: address.uf,
      city: address.cidade,
      limit: "1",
    });
    if (address.logradouro) params.set("street", address.logradouro);

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { "User-Agent": "vbz-landing-coverage/1.0" },
      signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS),
    });
    const data = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const first = data[0];
    if (first?.lat && first.lon) {
      return { lat: Number(first.lat), lon: Number(first.lon), source: "nominatim_estruturado" };
    }
  }

  const digits = address.cep.replace(/\D/g, "");
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${digits}`, {
    signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    location?: { coordinates?: { latitude?: string | number; longitude?: string | number } };
  };
  const coords = body.location?.coordinates;
  if (coords?.latitude == null || coords.longitude == null) return null;

  return {
    lat: Number(coords.latitude),
    lon: Number(coords.longitude),
    source: "brasilapi_cep_v2_fallback",
  };
}

export async function checkCepInCoverage(cepRaw: string): Promise<PolygonCoverageResult> {
  const address = await fetchCepAddress(cepRaw);
  if (!address) return { address: null, point: null, matchedAreas: [] };

  const point = await geocodeCep(address);
  if (!point) return { address, point: null, matchedAreas: [] };

  return {
    address,
    point,
    matchedAreas: areasForPoint(point.lon, point.lat),
  };
}
