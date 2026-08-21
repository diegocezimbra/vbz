/**
 * Rastreamento de erro do SSR (protocolo Sentry — o backend real é o GlitchTip
 * auto-hospedado em https://glitchtip.ohanax.com).
 *
 * Só é importado pelo bundle de servidor (`src/server.ts` / `src/start.ts`), por
 * isso pode usar `@sentry/node` direto. Diferente do lado navegador, aqui a DSN
 * vem de `process.env` em RUNTIME — trocar a env e reiniciar basta, sem rebuild.
 *
 * Env-gated: sem `SENTRY_DSN` fica 100% inerte.
 */
import * as Sentry from "@sentry/node";

let habilitado = false;

export function initServerErrorTracking(): boolean {
  if (habilitado) return true;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return false;

  try {
    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "production",
      release: process.env.SENTRY_RELEASE,
      tracesSampleRate: 0,
    });
    habilitado = true;
    return true;
  } catch {
    // nunca deixa o boot do SSR quebrar por causa do rastreamento
    return false;
  }
}

export function captureServerError(error: unknown): void {
  if (!habilitado) return;
  try {
    Sentry.captureException(error);
  } catch {
    // best-effort
  }
}
