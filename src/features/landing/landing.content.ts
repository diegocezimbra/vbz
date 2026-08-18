import { whatsappUrl } from "@/lib/contact";

import { WHATSAPP_SALES, WHATSAPP_SUPPORT } from "./landing.config";

/** Comparativo: cada dor da coluna esquerda é pareada, no mesmo índice, com a resposta da VBZ. */
export interface CmpPair {
  pain: { title: string; desc: string };
  ours: { title: string; desc: string };
}

export const CMP_STALE_TITLE = "O provedor que você tem hoje";
export const CMP_OURS_TITLE = "A VBZ";

export const COMPARISON: CmpPair[] = [
  {
    pain: { title: "“Até 300 Mega”", desc: "O “até” é onde mora a diferença entre o que você paga e o que chega no aparelho." },
    ours: { title: "A velocidade contratada, medida na instalação", desc: "O técnico roda o teste com você antes de ir embora — e o número fica registrado." },
  },
  {
    pain: { title: "Cai toda noite, justo quando a casa usa", desc: "Rede compartilhada demais: no horário de pico, todo mundo disputa a mesma banda." },
    ours: { title: "Capacidade dimensionada pro pico", desc: "A rede é planejada pelo horário de maior uso, não pela média do dia." },
  },
  {
    pain: { title: "Suporte é um menu que nunca chega em ninguém", desc: "“Digite 1.” Meia hora depois, a orientação é reiniciar o roteador de novo." },
    ours: { title: "WhatsApp com gente de verdade", desc: "Time local, conversa que continua de onde parou e visita técnica quando o problema é na rua." },
  },
  {
    pain: { title: "O preço da promoção some no terceiro mês", desc: "A oferta de entrada vence e a fatura sobe sem ninguém avisar." },
    ours: { title: "Preço combinado é preço cobrado", desc: "O valor do plano está no contrato. Se mudar, você é avisado antes — não pela fatura." },
  },
  {
    pain: { title: "Wi-Fi que não passa da sala", desc: "Roteador antigo, colocado onde deu, e metade da casa fica no sinal fraco." },
    ours: { title: "Wi-Fi 6 posicionado com medição", desc: "Equipamento incluso, ponto mesh nos planos maiores e sinal conferido cômodo a cômodo." },
  },
];

export type PlanKind = "casa" | "empresa";

export interface Plan {
  kind: PlanKind;
  name: string;
  speed: string;
  price: string;
  priceNote: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

/**
 * PENDENTE: preços e velocidades vieram da versão anterior desta mesma página. Antes de
 * virar anúncio pago, confirmar com o Diego. Plano de empresa é sob consulta de propósito:
 * link dedicado é orçado por endereço, e preço falso na página queima a reunião.
 */
export const PLANS: Plan[] = [
  {
    kind: "casa", name: "Essencial", speed: "500 Mega", price: "R$ 100", priceNote: "/mês · R$ 90 no cartão",
    features: ["Fibra de 500 Mega", "Roteador Wi-Fi 5 incluso", "Suporte no WhatsApp", "Instalação com hora marcada"],
    cta: "Quero o Essencial",
  },
  {
    kind: "casa", name: "Super", speed: "700 Mega", price: "R$ 130", priceNote: "/mês · R$ 120 no cartão",
    features: ["Fibra de 700 Mega", "Roteador Wi-Fi 6 incluso", "Streaming Plus por 12 meses", "Suporte no WhatsApp"],
    featured: true, cta: "Quero o Super",
  },
  {
    kind: "casa", name: "Ultra", speed: "1 Giga", price: "R$ 160", priceNote: "/mês · R$ 150 no cartão",
    features: ["Fibra de 1 Giga", "Roteador Wi-Fi 6 + ponto mesh", "Streaming Plus por 12 meses", "Prioridade no atendimento"],
    cta: "Quero o Ultra",
  },
  {
    kind: "empresa", name: "Dedicado 50", speed: "50 Mbps", price: "Sob consulta", priceNote: "orçado por endereço",
    features: ["Banda 100% dedicada e simétrica", "SLA 99,9% em contrato", "Suporte NOC 24/7", "IP fixo"],
    cta: "Pedir proposta",
  },
  {
    kind: "empresa", name: "Dedicado 150", speed: "150 Mbps", price: "Sob consulta", priceNote: "orçado por endereço",
    features: ["Banda 100% dedicada e simétrica", "SLA 99,9% em contrato", "Suporte prioritário", "Redundância ativa"],
    featured: true, cta: "Pedir proposta",
  },
  {
    kind: "empresa", name: "Enterprise", speed: "Sob medida", price: "Sob consulta", priceNote: "projeto dedicado",
    features: ["Capacidade sob medida", "SLA 99,99%", "Multi-rota redundante", "Gerente de conta"],
    cta: "Falar com engenharia",
  },
];

export interface Step { num: string; title: string; desc: string }

export const STEPS: Step[] = [
  { num: "01", title: "Você manda o endereço", desc: "Pelo formulário ou pelo WhatsApp. Leva menos de um minuto e não precisa de documento nenhum." },
  { num: "02", title: "A gente confere a viabilidade", desc: "Olhamos a rede no seu endereço e voltamos com a resposta — inclusive quando ainda não chegamos lá." },
  { num: "03", title: "Instalação com hora marcada", desc: "Técnico próprio, cabo organizado e Wi-Fi testado antes de ir embora." },
];

export interface Quote { text: string; who: string; meta: string; initials: string }

/** PENDENTE: depoimento real, com nome e cidade de cliente que autorizou. */
export const QUOTES: Quote[] = [
  {
    text: "Trocamos de provedor sem parar a operação. O link dedicado chegou com a banda que está no contrato e o suporte responde no WhatsApp em minutos.",
    who: "Gerente de TI", meta: "E-commerce · 80 colaboradores", initials: "TI",
  },
  {
    text: "O que mais me pegou foi a instalação: hora marcada, cabo passado com capricho e o técnico só saiu depois de testar o Wi-Fi no quarto dos fundos.",
    who: "Cliente residencial", meta: "Plano Ultra · 1 Giga", initials: "CR",
  },
];

export interface Faq { q: string; a: string }

export const FAQS: Faq[] = [
  { q: "Como sei se tem VBZ no meu endereço?", a: "Informe o CEP e o número no formulário de contratação: a disponibilidade é consultada na hora. Se ainda não chegamos aí, a gente diz na hora e avisa quando a fibra chegar." },
  { q: "Tem fidelidade ou multa pra cancelar?", a: "Não. A VBZ não trabalha com fidelidade nem cobra multa de cancelamento — se um dia você quiser sair, é só avisar. Isso está escrito no contrato que você assina, não só aqui." },
  { q: "Quanto tempo demora pra instalar?", a: "Depois da viabilidade confirmada, a instalação é agendada com hora marcada. O prazo depende do endereço — e a gente informa a data antes de você fechar, não depois." },
  { q: "Quanto custa a instalação?", a: "Nada. Não tem taxa de adesão nem custo de instalação, e o roteador vem incluso em comodato — fica na sua casa enquanto você for cliente, com manutenção por nossa conta." },
  { q: "A velocidade é a mesma pra subir e baixar?", a: "Sim. Os planos de fibra são simétricos — a mesma velocidade de download e de upload, o que faz diferença em chamada de vídeo, backup em nuvem e live." },
  { q: "Atende empresa?", a: "Sim. Pra empresa o produto é link dedicado: banda garantida, SLA e prazo de reparo em contrato, com suporte NOC 24/7. O orçamento é por endereço." },
];

export interface FooterCol { title: string; links: { label: string; href: string; external?: boolean }[] }

export const FOOTER_COLS: FooterCol[] = [
  {
    title: "Planos",
    links: [
      { label: "Internet pra sua casa", href: "#planos" },
      { label: "Internet pra empresa", href: "#planos" },
      { label: "Consultar viabilidade", href: "#viabilidade" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Suporte técnico", href: WHATSAPP_SUPPORT, external: true },
      { label: "2ª via de fatura", href: whatsappUrl("Olá! Preciso da 2ª via da minha fatura VBZ."), external: true },
      { label: "Dúvidas frequentes", href: "#faq" },
    ],
  },
  {
    title: "VBZ",
    links: [
      { label: "Falar com vendas", href: WHATSAPP_SALES, external: true },
      { label: "Termo de Consentimento", href: "/termo-consentimento" },
    ],
  },
];
