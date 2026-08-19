import { describe, expect, it } from "vitest";

import { contentTypeOf, safeStaticPath } from "./server-static.mjs";

const ROOT = "/app/dist/client";

describe("safeStaticPath", () => {
  it("resolve arquivo dentro da raiz de estáticos", () => {
    expect(safeStaticPath("/assets/landing-abc.css", ROOT)).toBe(`${ROOT}/assets/landing-abc.css`);
  });

  it("ignora query string", () => {
    expect(safeStaticPath("/assets/app.js?v=2", ROOT)).toBe(`${ROOT}/assets/app.js`);
  });

  it("recusa travessia de diretório", () => {
    expect(safeStaticPath("/../../etc/passwd", ROOT)).toBeNull();
    expect(safeStaticPath("/assets/../../../etc/passwd", ROOT)).toBeNull();
    expect(safeStaticPath("/assets/%2e%2e%2f%2e%2e%2fetc/passwd", ROOT)).toBeNull();
  });

  it("recusa a raiz e caminho de rota (quem responde é o SSR)", () => {
    expect(safeStaticPath("/", ROOT)).toBeNull();
    expect(safeStaticPath("/lp/onboarding", ROOT)).toBeNull();
  });
});

describe("contentTypeOf", () => {
  it("cobre os tipos que a build gera", () => {
    expect(contentTypeOf("a.css")).toBe("text/css; charset=utf-8");
    expect(contentTypeOf("a.js")).toBe("text/javascript; charset=utf-8");
    expect(contentTypeOf("a.png")).toBe("image/png");
    expect(contentTypeOf("a.svg")).toBe("image/svg+xml");
    expect(contentTypeOf("a.woff2")).toBe("font/woff2");
  });

  it("cai num tipo genérico em vez de mentir o content-type", () => {
    expect(contentTypeOf("a.desconhecido")).toBe("application/octet-stream");
  });
});
