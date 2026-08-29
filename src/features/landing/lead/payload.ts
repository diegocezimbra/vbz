import { phoneToE164 } from "./phone";

/** Campos do formulário de viabilidade, como a pessoa digitou. */
export interface ViabilityForm {
  nome: string;
  telefone: string;
  endereco: string;
  cidade: string;
}

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface BuildContext {
  now: Date;
  landing?: string;
  utm?: Utm;
}

/**
 * Corpo do `POST /api/v1/inbound/leads` do Qualificou. O contrato lá é `.strict()`:
 * chave desconhecida derruba o lead inteiro com 400 - por isso este tipo é fechado.
 * Endereço e cidade são campo próprio do lead desde 29/08 (antes iam em `tags`,
 * onde nenhuma tela do CRM lia e nenhum filtro alcançava).
 */
export interface QualificouLead {
  source: string;
  externalId: string;
  contact: { fullName: string; phone: string };
  campaign: string;
  enderecoCompleto?: string;
  cidade?: string;
  tags?: string[];
  landing?: string;
  utm?: Utm;
}

export const LEAD_SOURCE = "landing-vbz";
export const LEAD_CAMPAIGN = "Viabilidade - landing";

function compactUtm(utm?: Utm): Utm | undefined {
  if (!utm) return undefined;
  const entries = Object.entries(utm).filter(([, v]) => Boolean(v));
  return entries.length ? (Object.fromEntries(entries) as Utm) : undefined;
}

/**
 * `externalId` ÚNICO por envio (Diego, 27/08: "todo clique no formulário tem que
 * virar lead"). O inbound é idempotente por `(source, externalId)`, então a versão
 * anterior - `(telefone, dia)` - fazia o CRM responder `duplicate` do 2º envio do
 * dia em diante: a tela dizia "recebemos" e não entrava nada. Quem preenche de
 * novo com outro endereço ou outro plano está mandando informação nova.
 */
export function buildQualificouLead(form: ViabilityForm, ctx: BuildContext): QualificouLead {
  const phone = phoneToE164(form.telefone);
  const lead: QualificouLead = {
    source: LEAD_SOURCE,
    externalId: `${LEAD_SOURCE}-${ctx.now.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
    contact: { fullName: form.nome.trim(), phone },
    campaign: LEAD_CAMPAIGN,
    enderecoCompleto: form.endereco.trim(),
    cidade: form.cidade.trim(),
  };
  if (ctx.landing) lead.landing = ctx.landing;
  const utm = compactUtm(ctx.utm);
  if (utm) lead.utm = utm;
  return lead;
}

/** Mesma informação do lead, no formato que o time de vendas lê no WhatsApp. */
export function viabilityWhatsappMessage(form: ViabilityForm): string {
  return [
    "Olá! Quero consultar a viabilidade da VBZ no meu endereço.",
    "",
    `Nome: ${form.nome}`,
    `Telefone: ${form.telefone}`,
    `Endereço: ${form.endereco}`,
    `Cidade: ${form.cidade}`,
  ].join("\n");
}
