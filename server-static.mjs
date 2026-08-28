import { extname, normalize, resolve, sep } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

export function contentTypeOf(file) {
  return TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
}

/**
 * Caminho do arquivo estático correspondente à URL, ou null quando a URL não é um
 * arquivo (rota de página, que é do SSR) ou tenta escapar da pasta de estáticos.
 *
 * A checagem de escopo é feita DEPOIS de resolver o caminho: comparar a string crua
 * deixa passar `%2e%2e%2f` e symlink. Sem extensão também é null - rota como
 * `/lp/onboarding` tem que chegar no SSR, não virar 404 de arquivo.
 */
export function safeStaticPath(urlPath, root) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  if (!extname(decoded)) return null;

  const full = resolve(root, `.${normalize(decoded)}`);
  const base = resolve(root);
  if (full !== base && !full.startsWith(base + sep)) return null;
  return full;
}
