import { describe, expect, it } from "vitest";

import { buildQualificouLead, viabilityWhatsappMessage } from "./payload";

const form = {
  nome: "Maria Aparecida de Souza",
  telefone: "(35) 99842-3386",
  endereco: "Rua das Flores, 1234, apto 502",
  cidade: "Pouso Alegre",
};

describe("buildQualificouLead", () => {
  it("mapeia nome e telefone normalizado pro contato", () => {
    const lead = buildQualificouLead(form, { now: new Date("2026-08-18T12:00:00Z") });

    expect(lead.contact.fullName).toBe("Maria Aparecida de Souza");
    expect(lead.contact.phone).toBe("+5535998423386");
  });

  it("cada envio é um lead: externalId nunca se repete", () => {
    const a = buildQualificouLead(form, { now: new Date("2026-08-18T09:00:00Z") });
    const b = buildQualificouLead(form, { now: new Date("2026-08-18T09:00:00Z") });

    expect(a.externalId).not.toBe(b.externalId);
  });

  it("endereço e cidade vão em CAMPO do lead, não em tag", () => {
    const lead = buildQualificouLead(form, { now: new Date("2026-08-18T12:00:00Z") });

    expect(lead.enderecoCompleto).toBe("Rua das Flores, 1234, apto 502");
    expect(lead.cidade).toBe("Pouso Alegre");
    expect(lead.tags).toBeUndefined();
  });

  it("repassa utm e landing quando existirem", () => {
    const lead = buildQualificouLead(form, {
      now: new Date("2026-08-18T12:00:00Z"),
      landing: "https://vbz.com.br/?utm_source=meta",
      utm: { source: "meta", medium: "cpc", campaign: "viabilidade" },
    });

    expect(lead.landing).toBe("https://vbz.com.br/?utm_source=meta");
    expect(lead.utm).toEqual({ source: "meta", medium: "cpc", campaign: "viabilidade" });
  });

  it("omite utm quando não há nenhum parâmetro - o contrato é .strict()", () => {
    const lead = buildQualificouLead(form, { now: new Date("2026-08-18T12:00:00Z") });
    expect(lead.utm).toBeUndefined();
  });
});

describe("viabilityWhatsappMessage", () => {
  it("monta a mensagem com os quatro campos do formulário", () => {
    const msg = viabilityWhatsappMessage(form);

    expect(msg).toContain("Maria Aparecida de Souza");
    expect(msg).toContain("(35) 99842-3386");
    expect(msg).toContain("Rua das Flores, 1234, apto 502");
    expect(msg).toContain("Pouso Alegre");
  });
});
