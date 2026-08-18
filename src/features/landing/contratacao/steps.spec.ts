import { describe, expect, it } from "vitest";

import { STEP_ORDER, canAdvance, emptyState, nextStep, prevStep, progress } from "./steps";

describe("fluxo de contratação", () => {
  it("começa no CEP e termina na confirmação", () => {
    expect(STEP_ORDER[0]).toBe("cep");
    expect(STEP_ORDER[STEP_ORDER.length - 1]).toBe("pronto");
  });

  it("avança e volta na ordem", () => {
    expect(nextStep("cep")).toBe("plano");
    expect(nextStep("plano")).toBe("dados");
    expect(prevStep("dados")).toBe("plano");
  });

  it("não passa do fim nem antes do começo", () => {
    expect(nextStep("pronto")).toBe("pronto");
    expect(prevStep("cep")).toBe("cep");
  });

  it("bloqueia o avanço enquanto o passo não está válido", () => {
    const s = emptyState();
    expect(canAdvance("cep", s)).toBe(false);
    expect(canAdvance("cep", { ...s, cep: "37550-000", numero: "100", disponivel: true })).toBe(true);
  });

  it("não deixa avançar do CEP quando o endereço está fora da área", () => {
    const s = { ...emptyState(), cep: "01001-000", numero: "1", disponivel: false };
    expect(canAdvance("cep", s)).toBe(false);
  });

  it("exige plano escolhido", () => {
    const s = emptyState();
    expect(canAdvance("plano", s)).toBe(false);
    expect(canAdvance("plano", { ...s, plano: "Super" })).toBe(true);
  });

  it("exige CPF válido e demais dados no passo de dados", () => {
    const base = { ...emptyState(), nome: "Maria de Souza", email: "maria@exemplo.com", telefone: "(35) 99842-3386", nascimento: "1990-04-12" };
    expect(canAdvance("dados", { ...base, cpf: "111.111.111-11" })).toBe(false);
    expect(canAdvance("dados", { ...base, cpf: "529.982.247-25" })).toBe(true);
  });

  it("só libera o contrato depois da análise de crédito ter resposta", () => {
    const s = emptyState();
    expect(canAdvance("credito", s)).toBe(false);
    expect(canAdvance("credito", { ...s, credito: "aprovado" })).toBe(true);
    expect(canAdvance("credito", { ...s, credito: "analise_manual" })).toBe(true);
  });

  it("exige aceite E assinatura conferindo com o nome pra fechar o contrato", () => {
    const base = { ...emptyState(), nome: "Maria de Souza", credito: "aprovado" as const };
    expect(canAdvance("contrato", { ...base, aceite: true, assinatura: "" })).toBe(false);
    expect(canAdvance("contrato", { ...base, aceite: false, assinatura: "Maria de Souza" })).toBe(false);
    expect(canAdvance("contrato", { ...base, aceite: true, assinatura: "maria de souza" })).toBe(true);
  });

  it("recusa assinatura que não é o nome informado", () => {
    const base = { ...emptyState(), nome: "Maria de Souza", credito: "aprovado" as const, aceite: true };
    expect(canAdvance("contrato", { ...base, assinatura: "Joana Silva" })).toBe(false);
  });

  it("progresso cresce do primeiro ao último passo", () => {
    expect(progress("cep")).toBeLessThan(progress("contrato"));
    expect(progress("pronto")).toBe(100);
  });
});
