import { afterEach, describe, expect, it, vi } from "vitest";
import {
  areasForPoint,
  checkCepInCoverage,
  normalizeCep,
  pointInPolygon,
} from "./coverage-polygons";

describe("coverage polygons", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normaliza CEP com mascara ou somente digitos", () => {
    expect(normalizeCep("08253300")).toBe("08253-300");
    expect(normalizeCep("08253-300")).toBe("08253-300");
    expect(normalizeCep("123")).toBeNull();
  });

  it("detecta ponto dentro de poligono", () => {
    const square: [number, number][] = [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ];

    expect(pointInPolygon(1, 1, square)).toBe(true);
    expect(pointInPolygon(3, 1, square)).toBe(false);
  });

  it("carrega os poligonos reais de cobertura", () => {
    const areas = areasForPoint(-46.44006508156468, -23.5480264392796);

    expect(areas).toContain("Polígono sem título");
  });

  it("consulta CEP e decide cobertura pelos poligonos", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const href = String(url);
        if (href.includes("viacep.com.br")) {
          return Response.json({
            cep: "08253-300",
            logradouro: "Rua Antônio Crespo",
            bairro: "Conjunto Residencial José Bonifácio",
            localidade: "São Paulo",
            uf: "SP",
          });
        }
        if (href.includes("nominatim.openstreetmap.org")) {
          return Response.json([{ lat: "-23.5480264392796", lon: "-46.44006508156468" }]);
        }
        throw new Error(`fetch inesperado: ${href}`);
      }),
    );

    const result = await checkCepInCoverage("08253-300");

    expect(result.address?.logradouro).toBe("Rua Antônio Crespo");
    expect(result.matchedAreas).toContain("Polígono sem título");
  });
});
