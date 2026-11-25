import { z } from "zod";

import { isValidPhoneBR } from "./phone";

/** Formulário de viabilidade da landing: o que o servidor aceita antes de espelhar o lead no CRM. */
export const viabilitySchema = z.object({
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
