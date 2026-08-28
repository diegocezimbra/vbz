import { whatsappUrl } from "@/lib/contact";
import { PLANS } from "../landing/landing.content";

/** Conteúdo do onboarding - fonte única. Nada de texto solto no JSX. */
export const ONB_WHATSAPP = whatsappUrl(
  "Olá! Estou fazendo a contratação no site da VBZ e queria falar com um consultor.",
);

export const HOOK = {
  kicker: "Fibra óptica no sul de Minas",
  title: "E se você nunca mais precisasse trocar de provedor?",
  body: "A maioria de quem assina a VBZ chega cansada: velocidade que não bate, queda toda noite, suporte que é um menu sem fim. A ideia aqui é simples - entregar o que está no contrato e atender quando você chama.",
  cta: "Quero ver como funciona",
} as const;

export const COMO = {
  title: "O que você contrata, na prática",
  body: "Três coisas, e nenhuma delas depende de sorte.",
  pilares: [
    {
      t: "A velocidade contratada",
      d: "Fibra simétrica, medida na sua frente no dia da instalação. O número fica registrado.",
    },
    {
      t: "Wi-Fi que cobre a casa",
      d: "Roteador Wi-Fi 6 incluso e ponto mesh no plano maior. O sinal é conferido cômodo a cômodo.",
    },
    {
      t: "Suporte com gente de verdade",
      d: "WhatsApp com time local. A conversa continua de onde parou, sem repetir o problema.",
    },
  ],
  cta: "Faz sentido, continuar",
} as const;

export const GARANTIAS = {
  title: "O que a VBZ assume por escrito",
  body: "Isso não é promessa de página de vendas: as três linhas abaixo estão nas cláusulas do contrato que você assina no fim.",
  cta: "Bora, quero ver os planos",
} as const;

export const OFERTA = {
  title: "Escolha a velocidade e a gente cuida do resto",
  body: "Equipamento, instalação e visita técnica inclusos. Você paga a mensalidade - e só.",
  micro: "Sem fidelidade · Sem taxa de instalação · Cancela quando quiser",
  cta: "Consultar meu endereço",
} as const;

export const PLANOS_CASA = PLANS;

export const VENCIMENTOS = [5, 10, 15, 20, 25] as const;

export const PAGAMENTOS = [
  { key: "pix", label: "PIX", desc: "A fatura chega no WhatsApp com o QR Code todo mês." },
  {
    key: "boleto",
    label: "Boleto",
    desc: "Boleto por e-mail e WhatsApp, alguns dias antes do vencimento.",
  },
] as const;

export const TURNOS = [
  { key: "manha", label: "Manhã", desc: "das 8h às 12h" },
  { key: "tarde", label: "Tarde", desc: "das 13h às 18h" },
] as const;

/** Painel de venda que acompanha a coleta - o motivo de a pessoa ter começado não some da tela. */
export const ASIDE = {
  title: "Por que quem troca pra VBZ para de trocar",
  bullets: [
    "A velocidade é medida na instalação, com você olhando",
    "Sem multa e sem fidelidade - sair é só avisar",
    "Instalação e equipamento sem custo de adesão",
    "Suporte no WhatsApp com time local, não robô",
  ],
} as const;
