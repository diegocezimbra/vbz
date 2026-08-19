import { CONTACT_PHONE_LABEL, whatsappUrl } from "@/lib/contact";

/**
 * Conteúdo da landing — fonte ÚNICA. Seção nova pega o texto daqui, nunca hardcoda no JSX.
 *
 * ⚠️ REGRA HERDADA DO CENVIA: só entra número que a VBZ consegue PROVAR se um cliente pedir
 * a fonte. Os marcados `PENDENTE` vieram da versão anterior da página e continuam no ar,
 * mas ninguém validou — trocar pelo real (ou remover) é tarefa do Diego, não invenção nossa.
 */
export const BRAND = "VBZ";

/** Nome próprio inventado é candidato a ser "traduzido" pelo browser — blindar sempre. */
export const NO_TRANSLATE = { translate: "no" } as const;

export const PHONE_LABEL = CONTACT_PHONE_LABEL;
export const WHATSAPP_HERO = whatsappUrl("Olá! Vim pelo site da VBZ e quero saber se tem fibra no meu endereço.");
export const WHATSAPP_SALES = whatsappUrl("Olá! Quero falar com um consultor da VBZ.");
export const WHATSAPP_SUPPORT = whatsappUrl("Olá! Preciso de suporte técnico da VBZ.");

/** PENDENTE: URL real da área do cliente. Enquanto for null, o botão "Entrar" some. */
export const CLIENT_AREA_URL: string | null = null;

/** PENDENTE: @ real da VBZ. Enquanto for null o botao do Instagram nao aparece —
 *  mandar cliente pro perfil errado e pior que nao ter o botao. */
export const INSTAGRAM_URL: string | null = null;

export interface MenuItem { label: string; desc: string; href: string; external?: boolean }
export interface Menu { label: string; items: MenuItem[] }

/** Menus do topo — atalho pra todas as áreas, no padrão do airbroker. */
export const MENUS: Menu[] = [
  {
    label: "Planos",
    items: [
      { label: "Internet pra sua casa", desc: "500 Mega a 1 Giga, com Wi-Fi 6 e streaming", href: "#planos" },
      { label: "Internet pra empresa", desc: "Fibra 100% dedicada com SLA em contrato", href: "#planos" },
      { label: "Wi-Fi 6 e mesh", desc: "Sinal forte em cada cômodo, sem ponto morto", href: "#recursos" },
      { label: "Gamer", desc: "Latência baixa e rota estável pra jogar online", href: "#recursos" },
    ],
  },
  {
    label: "Empresas",
    items: [
      { label: "Link dedicado", desc: "Banda garantida, simétrica, sem disputa", href: "#planos" },
      { label: "SLA e redundância", desc: "Rota alternativa e prazo de reparo no contrato", href: "#comparativo" },
      { label: "Suporte NOC 24/7", desc: "Rede monitorada o tempo todo, gente de verdade no telefone", href: "#recursos" },
      { label: "Falar com um consultor", desc: "Proposta pro seu endereço em até 2 horas", href: WHATSAPP_SALES, external: true },
    ],
  },
  {
    label: "Cobertura",
    items: [
      { label: "Consultar viabilidade", desc: "Descubra se já chegamos no seu endereço", href: "#viabilidade" },
      { label: "Como é a instalação", desc: "Do aceite ao Wi-Fi funcionando", href: "#como" },
    ],
  },
  {
    label: "Ajuda",
    items: [
      { label: "Suporte técnico", desc: "Internet oscilando? Fale agora no WhatsApp", href: WHATSAPP_SUPPORT, external: true },
      { label: "2ª via de fatura", desc: "Peça a segunda via pelo WhatsApp", href: whatsappUrl("Olá! Preciso da 2ª via da minha fatura VBZ."), external: true },
      { label: "Mudar de plano", desc: "Subir a velocidade ou trocar de pacote", href: whatsappUrl("Olá! Quero mudar o meu plano VBZ."), external: true },
      { label: "Mudança de endereço", desc: "Leve a sua VBZ pra casa nova", href: whatsappUrl("Olá! Vou mudar de endereço e quero levar a VBZ."), external: true },
      { label: "Dúvidas frequentes", desc: "As perguntas que mais chegam pra gente", href: "#faq" },
    ],
  },
];

export type SlideArt = "fibra" | "wifi" | "suporte" | "streaming" | "instalacao";

export interface Slide {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  art: SlideArt;
}

/** Hero: um slide por funcionalidade, com o texto que detalha aquela funcionalidade. */
export const SLIDES: Slide[] = [
  {
    tag: "Fibra dedicada",
    title: "A velocidade que você contrata é a que chega",
    desc: "Fibra óptica até dentro de casa, sem cabo de cobre no meio do caminho e sem dividir a banda com o quarteirão inteiro.",
    bullets: ["Download e upload na mesma velocidade", "Sem queda no horário de pico", "Teste de velocidade na instalação"],
    art: "fibra",
  },
  {
    tag: "Wi-Fi 6 e mesh",
    title: "Sinal forte no cômodo mais longe da casa",
    desc: "Roteador Wi-Fi 6 incluso e ponto extra mesh nos planos maiores. A gente mede o sinal na instalação e posiciona o equipamento junto com você.",
    bullets: ["Roteador Wi-Fi 6 incluso", "Ponto mesh no plano Ultra", "Dezenas de aparelhos ao mesmo tempo"],
    art: "wifi",
  },
  {
    tag: "Suporte 24/7",
    title: "Gente de verdade atendendo, não robô de menu",
    desc: "NOC monitorando a rede o tempo todo e time local que conhece a cidade. Você fala no WhatsApp e continua a conversa de onde parou.",
    bullets: ["Atendimento humano no WhatsApp", "Rede monitorada 24 horas", "Visita técnica quando precisa"],
    art: "suporte",
  },
  {
    tag: "Streaming incluso",
    title: "Seu pacote de streaming já vem junto",
    desc: "A partir do plano Super, o Streaming Plus vem incluso por 12 meses. Sem cadastrar outro cartão e sem taxa escondida.",
    bullets: ["Streaming Plus por 12 meses", "A partir de 700 Mega", "Cancelamento sem multa escondida"],
    art: "streaming",
  },
  {
    tag: "Instalação",
    title: "Instalação limpa, feita no horário combinado",
    desc: "Técnico próprio, cabo passado com organização e Wi-Fi testado antes de ir embora. Você não fica esperando o dia inteiro.",
    bullets: ["Horário combinado, não “período”", "Técnico próprio, uniformizado", "Wi-Fi testado antes de sair"],
    art: "instalacao",
  },
];

export interface Stat { num: string; label: string; note?: string }

/** PENDENTE: números herdados da página anterior — validar com o Diego antes de virar campanha. */
export const STATS: Stat[] = [
  { num: "99,9%", label: "SLA em contrato", note: "com crédito automático se furar" },
  { num: "1 Giga", label: "Plano mais rápido", note: "fibra simétrica" },
  { num: "24/7", label: "NOC monitorando", note: "rede vigiada o tempo todo" },
  { num: "< 4h", label: "MTTR alvo", note: "tempo médio de reparo" },
];

export const CHAT = {
  title: "Oi! Como podemos te ajudar?",
  body: "Responde na hora, no WhatsApp — sem robô, sem menu.",
  href: whatsappUrl("Oi! Vim pelo site da VBZ e preciso de ajuda."),
} as const;
