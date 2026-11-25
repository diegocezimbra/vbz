import { describe, expect, it } from "vitest";

import { viabilitySchema } from "./viability-schema";

const valid = {
  nome: "  Maria Silva  ",
  telefone: "(35) 99842-3386",
  endereco: "Rua das Flores, 100",
  cidade: "Pouso Alegre",
};

describe("viabilitySchema", () => {
  it("aceita o formulário mínimo e tira os espaços das pontas", () => {
    const result = viabilitySchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.nome).toBe("Maria Silva");
  });

  it("aceita landing e UTMs opcionais", () => {
    const result = viabilitySchema.safeParse({
      ...valid,
      landing: "https://vbz.com.br/lp/x",
      utm: { source: "meta", campaign: "fibra" },
    });
    expect(result.success).toBe(true);
    expect(result.data?.utm).toEqual({ source: "meta", campaign: "fibra" });
  });

  it("recusa telefone inválido com a mensagem que a tela mostra", () => {
    const result = viabilitySchema.safeParse({ ...valid, telefone: "123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain("Telefone inválido");
  });

  it("mede o nome depois de tirar os espaços", () => {
    expect(viabilitySchema.safeParse({ ...valid, nome: "  ab  " }).success).toBe(false);
  });

  it("recusa campo acima do limite e campo obrigatório ausente", () => {
    expect(viabilitySchema.safeParse({ ...valid, cidade: "x".repeat(81) }).success).toBe(false);
    expect(viabilitySchema.safeParse({ ...valid, landing: "x".repeat(2001) }).success).toBe(false);
    expect(viabilitySchema.safeParse({ ...valid, utm: { source: "x".repeat(201) } }).success).toBe(
      false,
    );
    const { endereco: _omitted, ...withoutAddress } = valid;
    expect(viabilitySchema.safeParse(withoutAddress).success).toBe(false);
  });
});
