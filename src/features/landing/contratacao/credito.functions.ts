import process from "node:process";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isValidCPF } from "../lead/documents";

export type CreditDecision = "aprovado" | "analise_manual" | "recusado";

export interface CreditResponse {
  decision: CreditDecision;
  message: string;
}

const TIMEOUT_MS = 12_000;
/** Abaixo disso a proposta vai pra mesa humana em vez de ser recusada na cara do cliente. */
const SCORE_APROVACAO = 500;

/**
 * Análise de crédito via Radar do Crédito (produto irmão — `POST /api/radar/v1/consulta-pf`).
 *
 * Envs: `RADAR_API_URL` + `RADAR_API_KEY`. Sem elas, o retorno é `analise_manual`:
 * o fluxo NUNCA trava e ninguém é recusado por falta de configuração nossa. Recusa
 * automática só acontece com resposta real do provedor.
 */
export const checkCredit = createServerFn({ method: "POST" })
  .inputValidator(z.object({ cpf: z.string(), nome: z.string().min(3) }))
  .handler(async ({ data }): Promise<CreditResponse> => {
    if (!isValidCPF(data.cpf)) {
      return { decision: "analise_manual", message: "Não consegui validar o CPF. Um consultor confere com você." };
    }

    const url = process.env.RADAR_API_URL;
    const key = process.env.RADAR_API_KEY;
    if (!url || !key) {
      console.warn("[credito] Radar do Crédito não configurado — proposta segue pra análise manual.");
      return { decision: "analise_manual", message: "Sua proposta vai passar por uma conferência rápida do nosso time." };
    }

    try {
      const response = await fetch(`${url.replace(/\/$/, "")}/consulta-pf`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({ documento: data.cpf.replace(/\D/g, "") }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        console.error(`[credito] Radar respondeu ${response.status}: ${await response.text()}`);
        return { decision: "analise_manual", message: "Sua proposta vai passar por uma conferência rápida do nosso time." };
      }

      const body = (await response.json()) as { resultado?: { score?: { valor?: number } | number } };
      const raw = body.resultado?.score;
      const score = typeof raw === "number" ? raw : raw?.valor;

      if (typeof score !== "number") {
        return { decision: "analise_manual", message: "Sua proposta vai passar por uma conferência rápida do nosso time." };
      }
      if (score >= SCORE_APROVACAO) {
        return { decision: "aprovado", message: "Análise aprovada. Vamos ao contrato." };
      }
      return { decision: "analise_manual", message: "Precisamos de uma conferência do time antes de seguir — já vamos te chamar." };
    } catch (error) {
      console.error("[credito] Radar inalcançável:", error);
      return { decision: "analise_manual", message: "Sua proposta vai passar por uma conferência rápida do nosso time." };
    }
  });
