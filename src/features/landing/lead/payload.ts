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
 * chave desconhecida derruba o lead inteiro com 400 - por isso este tipo é fechado
 * e endereço/cidade viajam em `tags`, não em campo próprio.
 */
export interface QualificouLead {
  source: string;
  externalId: string;
  contact: { fullName: string; phone: string };
  campaign: string;
  tags: string[];
  landing?: string;
  utm?: Utm;
}

export const LEAD_SOURCE = "landing-vbz";
export const LEAD_CAMPAIGN = "Viabilidade - landing";
/** Limite por tag no contrato do CRM. Estourar derruba o lead, então trunca. */
const TAG_MAX = 60;

function tag(prefix: string, value: string): string {
  return `${prefix}:${value}`.slice(0, TAG_MAX);
}

function isoDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function compactUtm(utm?: Utm): Utm | undefined {
  if (!utm) return undefined;
  const entries = Object.entries(utm).filter(([, v]) => Boolean(v));
  return entries.length ? (Object.fromEntries(entries) as Utm) : undefined;
}

/**
 * `externalId` é `(telefone, dia)`: o inbound é idempotente por `(source, externalId)`,
 * então o mesmo visitante mandando o formulário duas vezes no mesmo dia vira UM lead -
 * e volta a abrir lead novo no dia seguinte, que é quando a repetição vira sinal real.
 */
export function buildQualificouLead(form: ViabilityForm, ctx: BuildContext): QualificouLead {
  const phone = phoneToE164(form.telefone);
  const lead: QualificouLead = {
    source: LEAD_SOURCE,
    externalId: `${phone}-${isoDay(ctx.now)}`,
    contact: { fullName: form.nome.trim(), phone },
    campaign: LEAD_CAMPAIGN,
    tags: [tag("endereco", form.endereco.trim()), tag("cidade", form.cidade.trim())],
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
