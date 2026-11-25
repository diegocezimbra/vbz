import { createServerFn } from "@tanstack/react-start";

import { buildQualificouLead } from "./payload";
import { sendLeadToCrm } from "./qualificou.server";
import { viabilitySchema } from "./viability-schema";

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
