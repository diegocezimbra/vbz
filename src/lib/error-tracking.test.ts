import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const initMock = vi.fn();
const captureMock = vi.fn();

vi.mock("@sentry/react", () => ({
  init: (...args: unknown[]) => initMock(...args),
  captureException: (...args: unknown[]) => captureMock(...args),
}));

describe("rastreamento de erro do navegador", () => {
  beforeEach(() => {
    vi.resetModules();
    initMock.mockReset();
    captureMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fica inerte sem VITE_SENTRY_DSN", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    const mod = await import("./error-tracking");

    await expect(mod.initBrowserErrorTracking()).resolves.toBe(false);
    expect(initMock).not.toHaveBeenCalled();
  });

  it("não reporta nada enquanto estiver desligado", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    const mod = await import("./error-tracking");
    await mod.initBrowserErrorTracking();

    mod.captureBrowserError(new Error("boom"));

    expect(captureMock).not.toHaveBeenCalled();
  });

  it("liga com a DSN e passa a reportar", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://key@glitchtip.example/22");
    const mod = await import("./error-tracking");

    await expect(mod.initBrowserErrorTracking()).resolves.toBe(true);
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://key@glitchtip.example/22",
        tracesSampleRate: 0,
      }),
    );

    const erro = new Error("boom");
    mod.captureBrowserError(erro);
    expect(captureMock).toHaveBeenCalledWith(erro);
  });

  it("liga uma vez só, mesmo chamando de novo", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://key@glitchtip.example/22");
    const mod = await import("./error-tracking");

    await mod.initBrowserErrorTracking();
    await mod.initBrowserErrorTracking();

    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it("nunca quebra a página se o SDK explodir", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://key@glitchtip.example/22");
    initMock.mockImplementation(() => {
      throw new Error("sdk quebrado");
    });
    const mod = await import("./error-tracking");

    await expect(mod.initBrowserErrorTracking()).resolves.toBe(false);
  });
});
