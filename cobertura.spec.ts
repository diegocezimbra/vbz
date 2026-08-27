import { describe, expect, it } from "vitest";

import { cidadesAtendidas, decidirCobertura } from "./cobertura.mjs";

describe("cidadesAtendidas", () => {
  it("aceita lista separada por virgula, ignorando espaco e caixa", () => {
    expect(cidadesAtendidas(" Pouso Alegre-MG , BETIM-mg ")).toEqual(["pouso alegre-mg", "betim-mg"]);
  });

  it("env vazia vira lista vazia", () => {
    expect(cidadesAtendidas("")).toEqual([]);
    expect(cidadesAtendidas(undefined)).toEqual([]);
  });
});

describe("decidirCobertura", () => {
  const ATENDIDAS = ["pouso alegre-mg", "betim-mg", "belo horizonte-mg"];

  it("confirma quando a cidade esta na lista", () => {
    expect(decidirCobertura("Pouso Alegre", "MG", ATENDIDAS).status).toBe("disponivel");
  });

  it("compara sem depender de acento nem de caixa", () => {
    expect(decidirCobertura("POUSO ALEGRE", "mg", ATENDIDAS).status).toBe("disponivel");
    expect(decidirCobertura("Belo Horizonte", "MG", ATENDIDAS).status).toBe("disponivel");
  });

  it("nao confunde cidade de mesmo nome em outro estado", () => {
    // existe Betim-MG; um "Betim-SP" hipotetico nao pode passar
    expect(decidirCobertura("Betim", "SP", ATENDIDAS).status).toBe("fora");
  });

  it("recusa cidade fora da lista", () => {
    const r = decidirCobertura("São Paulo", "SP", ATENDIDAS);
    expect(r.status).toBe("fora");
    expect(r.mensagem).toMatch(/ainda não chegamos/i);
  });

  it("sem lista configurada NUNCA afirma cobertura - promete conferencia", () => {
    // vazio significa "nao sabemos", nao "atende todo mundo". Afirmar cobertura
    // que nao existe faz o cliente assinar e descobrir na instalacao.
    const r = decidirCobertura("Qualquer Lugar", "XX", []);
    expect(r.status).toBe("verificar");
    expect(r.mensagem).toMatch(/confirmar/i);
  });
});
