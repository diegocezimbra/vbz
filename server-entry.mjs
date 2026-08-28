import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import serverModule from "./dist/server/server.js";
import { contentTypeOf, safeStaticPath } from "./server-static.mjs";

const server = serverModule;
const port = process.env.PORT || 3000;
const ROOT = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = join(ROOT, "static");
const CLIENT_DIR = join(ROOT, "dist", "client");
const LANDING = join(STATIC_DIR, "index.html");

/**
 * A landing e HTML estatico (static/index.html) servido na raiz; o app React segue
 * respondendo o resto (/lp/onboarding, /termo-consentimento). Foi decisao do Diego:
 * remontar aquele layout em componentes fazia a marcacao divergir do CSS e o
 * comparativo embaralhava. Com o HTML no controle, marcacao e CSS nao brigam.
 */
async function serveFile(res, path, cache) {
  const info = await stat(path);
  res.writeHead(200, {
    "content-type": contentTypeOf(path),
    "content-length": info.size,
    "cache-control": cache,
  });
  createReadStream(path).pipe(res);
}

/** Estaticos ANTES do SSR: sem isto /assets/*.css cai no handler de pagina e volta 404. */
async function tryStatic(req, res) {
  for (const [dir, cache] of [
    [STATIC_DIR, "public, max-age=3600"],
    [CLIENT_DIR, "public, max-age=31536000, immutable"],
  ]) {
    const path = safeStaticPath(req.url ?? "/", dir);
    if (!path) return false;
    try {
      const info = await stat(path);
      if (!info.isFile()) continue;
      await serveFile(res, path, req.url.startsWith("/assets/") ? cache : "public, max-age=3600");
      return true;
    } catch {
      // arquivo nao existe nesta pasta; tenta a proxima
    }
  }
  return false;
}

/**
 * Repasse do formulario ao inbound do CRM. A CHAVE mora aqui, NUNCA no HTML: numa
 * landing publica ela seria lida por qualquer um e viraria porta de entrada pra
 * injetar lead na base. O corpo vem pronto do navegador; so acrescentamos a chave.
 */
async function handleLead(req, res) {
  const url = process.env.QUALIFICOU_INBOUND_URL;
  const key = process.env.QUALIFICOU_INBOUND_KEY;
  if (!url || !key) {
    console.warn("[lead] Qualificou nao configurado - lead nao espelhado no CRM.");
    res.writeHead(202, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "not_configured" }));
    return;
  }
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 20_000) {
      res.writeHead(413).end();
      return;
    }
  }
  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const text = await upstream.text();
    if (!upstream.ok) console.error(`[lead] CRM recusou (${upstream.status}): ${text}`);
    res.writeHead(upstream.ok ? 200 : 502, { "content-type": "application/json" });
    res.end(upstream.ok ? text : JSON.stringify({ status: "upstream_error" }));
  } catch (error) {
    console.error("[lead] CRM inalcancavel:", error);
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "unreachable" }));
  }
}

const httpServer = createServer(async (req, res) => {
  try {
    const path = (req.url ?? "/").split("?")[0];

    if (req.method === "POST" && path === "/api/lead") return void (await handleLead(req, res));

    if (req.method === "GET" && (path === "/" || path === "/index.html")) {
      const html = await readFile(LANDING);
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "content-length": html.byteLength,
        "cache-control": "public, max-age=0, must-revalidate",
      });
      return void res.end(html);
    }

    if (await tryStatic(req, res)) return;

    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    });
    const response = await server.fetch(request);
    const headers = Object.fromEntries(response.headers);
    headers["cache-control"] = "public, max-age=0, must-revalidate";
    // arrayBuffer em vez de text(): .text() corrompe byte nao-UTF8 silenciosamente.
    const buf = Buffer.from(await response.arrayBuffer());
    headers["content-length"] = buf.byteLength;
    res.writeHead(response.status, headers);
    res.end(buf);
  } catch (error) {
    console.error("Server error:", error.message, error.stack);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error: " + error.message);
  }
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});
