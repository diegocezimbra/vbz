import { describe, expect, it } from "vitest";

import {
  ONB_STEPS,
  canAdvance,
  emptyOnboarding,
  isSalesStep,
  nextOnb,
  prevOnb,
  onbProgress,
} from "./steps";

const base = () => ({
  ...emptyOnboarding(),
  cep: "37550-340",
  numero: "450",
  disponivel: true,
  cidade: "Pouso Alegre",
  plano: "Super",
  nome: "Maria de Souza",
  email: "maria@exemplo.com",
  telefone: "(35) 99842-3386",
  cpf: "529.982.247-25",
  nascimento: "1990-04-12",
  aceite: true,
  assinatura: "Maria de Souza",
});

describe("onboarding VBZ", () => {
  it("vende antes de pedir dado: os primeiros passos não coletam nada", () => {
    expect(ONB_STEPS.slice(0, 4)).toEqual(["hook", "como", "garantias", "oferta"]);
    expect(isSalesStep("como")).toBe(true);
    expect(isSalesStep("conta")).toBe(false);
  });

  it("não consulta crédito: do titular vai direto pro contrato", () => {
    expect(ONB_STEPS).not.toContain("credito");
    expect(nextOnb("titular")).toBe("contrato");
    expect(prevOnb("contrato")).toBe("titular");
  });

  it("termina configurado, não no contrato", () => {
    expect(ONB_STEPS[ONB_STEPS.length - 1]).toBe("pronto");
    expect(ONB_STEPS).toContain("pagamento");
    expect(ONB_STEPS).toContain("instalacao");
    expect(ONB_STEPS).toContain("wifi");
  });

  it("passo puramente de venda sempre avança - não há o que validar", () => {
    for (const step of ["hook", "como", "garantias"] as const) {
      expect(canAdvance(step, emptyOnboarding())).toBe(true);
    }
  });

  it("a oferta é onde o plano é escolhido - e não avança sem escolha", () => {
    expect(canAdvance("oferta", emptyOnboarding())).toBe(false);
    expect(canAdvance("oferta", { ...emptyOnboarding(), plano: "Super" })).toBe(true);
  });

  it("não pede o plano duas vezes: depois da oferta vem o endereço", () => {
    expect(ONB_STEPS.filter((s) => s === "oferta")).toHaveLength(1);
    expect(nextOnb("oferta")).toBe("cep");
  });

  it("exige disponibilidade confirmada pra sair do CEP", () => {
    const s = emptyOnboarding();
    expect(canAdvance("cep", s)).toBe(false);
    expect(canAdvance("cep", { ...s, cep: "37550-340", numero: "450", disponivel: true })).toBe(
      true,
    );
  });

  it("conta exige nome, email e celular válidos - e nunca senha", () => {
    const s = emptyOnboarding();
    expect(canAdvance("conta", s)).toBe(false);
    expect(
      canAdvance("conta", {
        ...s,
        nome: "Maria de Souza",
        email: "maria@exemplo.com",
        telefone: "(35) 99842-3386",
      }),
    ).toBe(true);
    expect(Object.keys(s)).not.toContain("senha");
  });

  it("titular exige CPF válido de verdade", () => {
    const s = { ...base(), cpf: "111.111.111-11" };
    expect(canAdvance("titular", s)).toBe(false);
    expect(canAdvance("titular", { ...s, cpf: "529.982.247-25" })).toBe(true);
  });

  it("contrato exige aceite e assinatura igual ao nome", () => {
    expect(canAdvance("contrato", { ...base(), assinatura: "Outra Pessoa" })).toBe(false);
    expect(canAdvance("contrato", base())).toBe(true);
  });

  it("pagamento exige forma e dia de vencimento", () => {
    const s = base();
    expect(canAdvance("pagamento", s)).toBe(false);
    expect(canAdvance("pagamento", { ...s, pagamento: "pix", vencimento: 10 })).toBe(true);
  });

  it("instalação exige data, turno e quem recebe o técnico", () => {
    const s = { ...base(), instalacaoData: "2026-08-25", instalacaoTurno: "manha" as const };
    expect(canAdvance("instalacao", s)).toBe(false);
    expect(canAdvance("instalacao", { ...s, recebePor: "Maria de Souza" })).toBe(true);
  });

  it("wifi exige nome de rede e senha de no mínimo 8 caracteres (padrão WPA2)", () => {
    const s = base();
    expect(canAdvance("wifi", { ...s, wifiNome: "Casa da Maria", wifiSenha: "1234" })).toBe(false);
    expect(canAdvance("wifi", { ...s, wifiNome: "Casa da Maria", wifiSenha: "fibra2026" })).toBe(
      true,
    );
  });

  it("navega pra frente e pra trás sem sair das pontas", () => {
    expect(nextOnb("hook")).toBe("como");
    expect(prevOnb("como")).toBe("hook");
    expect(prevOnb("hook")).toBe("hook");
    expect(nextOnb("pronto")).toBe("pronto");
  });

  it("progresso só começa a contar quando a coleta começa", () => {
    expect(onbProgress("hook")).toBe(0);
    expect(onbProgress("cep")).toBeGreaterThan(0);
    expect(onbProgress("pronto")).toBe(100);
  });
});
