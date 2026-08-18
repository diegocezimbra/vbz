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

  it("usa externalId estável por telefone e dia — reenvio no mesmo dia é idempotente", () => {
    const a = buildQualificouLead(form, { now: new Date("2026-08-18T09:00:00Z") });
    const b = buildQualificouLead(form, { now: new Date("2026-08-18T22:30:00Z") });
    const outroDia = buildQualificouLead(form, { now: new Date("2026-08-19T09:00:00Z") });

    expect(a.externalId).toBe(b.externalId);
    expect(outroDia.externalId).not.toBe(a.externalId);
  });

  it("leva endereço e cidade em tags, porque o contrato .strict() não tem campo próprio", () => {
    const lead = buildQualificouLead(form, { now: new Date("2026-08-18T12:00:00Z") });

    expect(lead.tags).toContain("endereco:Rua das Flores, 1234, apto 502");
    expect(lead.tags).toContain("cidade:Pouso Alegre");
  });

  it("trunca tag em 60 chars — o CRM recusa acima disso e derrubaria o lead inteiro", () => {
    const lead = buildQualificouLead(
      { ...form, endereco: "A".repeat(200) },
      { now: new Date("2026-08-18T12:00:00Z") },
    );

    for (const tag of lead.tags) expect(tag.length).toBeLessThanOrEqual(60);
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

  it("omite utm quando não há nenhum parâmetro — o contrato é .strict()", () => {
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
