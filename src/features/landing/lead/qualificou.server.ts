import process from "node:process";

import type { QualificouLead } from "./payload";

/**
 * Cliente do inbound do CRM (Qualificou). Vive num `.server.ts` porque carrega a
 * API KEY — que define o tenant e por isso NUNCA pode chegar ao browser.
 *
 * Envs (ambas obrigatórias; sem elas o envio fica desligado e apenas loga):
 *   QUALIFICOU_INBOUND_URL  → https://api.qualificou.com.br/api/v1/inbound/leads
 *   QUALIFICOU_INBOUND_KEY  → chave do tenant VBZ (prefixo crm_)
 *
 * Ler process.env DENTRO da função: em runtime serverless o env liga por request.
 */
export type LeadDelivery =
  | { delivered: true; status: "created" | "duplicate" }
  | { delivered: false; reason: "not_configured" | "rejected" | "unreachable" };

const TIMEOUT_MS = 8_000;

export async function sendLeadToCrm(lead: QualificouLead): Promise<LeadDelivery> {
  const url = process.env.QUALIFICOU_INBOUND_URL;
  const key = process.env.QUALIFICOU_INBOUND_KEY;

  if (!url || !key) {
    console.warn("[lead] Qualificou não configurado — lead não espelhado no CRM.");
    return { delivered: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      // Corpo do erro entra no log porque `.strict()` recusa por FORMA — sem o
      // motivo, um campo novo quebrando a integração vira mistério.
      console.error(`[lead] Qualificou recusou (${response.status}): ${await response.text()}`);
      return { delivered: false, reason: "rejected" };
    }

    // 201 = criado, 200 = já existia (idempotente por (source, externalId)).
    return { delivered: true, status: response.status === 201 ? "created" : "duplicate" };
  } catch (error) {
    console.error("[lead] Qualificou inalcançável:", error);
    return { delivered: false, reason: "unreachable" };
  }
}
