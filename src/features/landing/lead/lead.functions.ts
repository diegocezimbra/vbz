import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildQualificouLead } from "./payload";
import { sendLeadToCrm } from "./qualificou.server";
import { isValidPhoneBR } from "./phone";

const viabilitySchema = z.object({
  nome: z.string().trim().min(3).max(120),
  telefone: z.string().refine(isValidPhoneBR, "Telefone inválido"),
  endereco: z.string().trim().min(5).max(200),
  cidade: z.string().trim().min(2).max(80),
  landing: z.string().max(2000).optional(),
  utm: z
    .object({
      source: z.string().max(200).optional(),
      medium: z.string().max(200).optional(),
      campaign: z.string().max(200).optional(),
      content: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
    })
    .optional(),
});

/**
 * Recebe o formulário de viabilidade e espelha o lead no CRM.
 *
 * O resultado do CRM NÃO vira erro pra quem preencheu: se o Qualificou estiver fora,
 * a pessoa continua sendo levada ao WhatsApp (o caminho que fecha venda) e a falha
 * fica no log do servidor. Perder o lead na tela pra sinalizar um problema de
 * back-office seria trocar receita por diagnóstico.
 */
export const submitViability = createServerFn({ method: "POST" })
  .inputValidator(viabilitySchema)
  .handler(async ({ data }) => {
    const lead = buildQualificouLead(data, {
      now: new Date(),
      landing: data.landing,
      utm: data.utm,
    });
    const delivery = await sendLeadToCrm(lead);
    return { ok: true as const, crm: delivery };
  });
