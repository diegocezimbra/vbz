/**
 * Rastreamento de erro do NAVEGADOR (protocolo Sentry — o backend real é o
 * GlitchTip auto-hospedado em https://glitchtip.ohanax.com).
 *
 * Este arquivo é isomórfico: o mesmo bundle roda no SSR e no browser. Por isso
 * o SDK entra por `import()` DINÂMICO e só depois do guarda de `window` — o
 * `@sentry/react` mexe em API de browser e não pode ser avaliado no servidor.
 * O lado servidor tem módulo próprio (`error-tracking.server.ts`).
 *
 * Env-gated: sem `VITE_SENTRY_DSN` fica 100% inerte.
 */
type SentryBrowser = {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: unknown) => void;
};

let sentry: SentryBrowser | undefined;

function noBrowser(): boolean {
  return typeof window === "undefined";
}

export async function initBrowserErrorTracking(): Promise<boolean> {
  if (noBrowser() || sentry !== undefined) return sentry !== undefined;

  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return false;

  try {
    const mod = (await import("@sentry/react")) as unknown as SentryBrowser;
    mod.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_SENTRY_RELEASE as string | undefined,
      // Só rastreamento de erro (sem performance/tracing) por padrão.
      tracesSampleRate: 0,
    });
    sentry = mod;
    return true;
  } catch {
    // nunca quebra a página por causa do rastreamento
    return false;
  }
}

export function captureBrowserError(error: unknown): void {
  if (sentry === undefined) return;
  try {
    sentry.captureException(error);
  } catch {
    // best-effort
  }
}
