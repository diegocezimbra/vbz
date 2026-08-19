import { whatsappUrl } from "@/lib/contact";

/**
 * Conteúdo da landing — fonte ÚNICA. Nenhuma seção escreve texto no JSX.
 *
 * ⚠️ NÚMERO SÓ ENTRA AQUI SE A VBZ CONSEGUIR PROVAR. Copy de concorrente ("99% dos
 * clientes", "8.500 assinantes") descreve a operação DELES; na página da VBZ vira
 * alegação indefensável no primeiro cliente que pedir a fonte. Onde falta o dado
 * real, o texto fala do mecanismo — que é verificável — em vez de inventar volume.
 */
export const WHATSAPP_VENDAS = whatsappUrl("Olá! Vim pelo site da VBZ e quero consultar a viabilidade no meu endereço.");
export const WHATSAPP_SUPORTE = whatsappUrl("Olá! Preciso de suporte técnico da VBZ.");

export const HERO = {
  eyebrow: "Fibra óptica no sul de Minas",
  title: "Esta vai ser a última vez que você vai",
  highlight: "procurar por Internet",
  lead: "Você já trocou de provedor antes. Trocou porque caía à noite, porque a velocidade nunca era a contratada, porque o suporte era um menu que não levava a ninguém. A VBZ existe pra ser a troca que encerra o assunto.",
  ctaPrimary: "Consultar meu endereço",
  ctaGhost: "Ver como funciona",
  ticks: ["Sem fidelidade e sem multa", "Instalação sem custo", "Resposta em minutos no WhatsApp"],
} as const;

export const TRUSTBAR = [
  "Fibra 100% óptica até dentro de casa",
  "Sem fidelidade, sem multa",
  "Instalação e equipamento inclusos",
  "Suporte humano no WhatsApp",
] as const;

/** Dor — cada card nomeia um problema concreto e o que ele custa. */
export const DOR = {
  eyebrow: "Pare para refletir",
  title: "Você já sabe como é ter uma Internet ruim",
  lead: "Não é sobre megabit. É sobre a reunião que travou, o jogo que perdeu no lag e a hora que você passou no telefone sem resolver nada.",
  cards: [
    { t: "Cai justo quando a casa toda usa", d: "Depois das 18h a rede lota e a velocidade despenca. O provedor jura que “está tudo normal na central”.", cost: "A noite inteira refém do 4G" },
    { t: "O “até” do plano é onde mora a pegadinha", d: "Você contrata 500 e recebe uma fração. Ninguém mede junto com você, e a fatura não muda.", cost: "Você paga o que não recebe" },
    { t: "Suporte que não atende quem precisa", d: "Menu, espera, script, “reinicie o roteador”. Fora do horário comercial, nem isso.", cost: "Dias parados esperando visita" },
    { t: "Contrato que prende", d: "Fidelidade de dois anos e multa pra sair. O provedor sabe que você fica por falta de opção, não por gostar.", cost: "Multa pra se livrar de um serviço ruim" },
  ],
} as const;

export const PASSOS = {
  eyebrow: "Como funciona",
  title: "Do seu endereço ao Wi-Fi ligado",
  lead: "Sem burocracia, sem “aguarde das 8h às 18h” e sem promessa que a operação não cumpre.",
  steps: [
    { n: "1", t: "Você manda o endereço", d: "Nome, telefone e onde você mora. Não pedimos documento nem cartão pra consultar.", time: "1 minuto" },
    { n: "2", t: "A gente confere a viabilidade", d: "Olhamos a rede no seu endereço e respondemos — inclusive quando a resposta é que ainda não chegamos aí.", time: "no mesmo dia" },
    { n: "3", t: "Você escolhe o plano e assina", d: "Contrato claro, sem letra miúda, assinado pelo site. Análise de crédito na hora.", time: "poucos minutos" },
    { n: "4", t: "Instalação com hora marcada", d: "Técnico próprio, cabo organizado e a velocidade medida na sua frente antes de ir embora.", time: "no dia que você escolher" },
  ],
} as const;

export const RECURSOS = {
  eyebrow: "O que vem junto",
  title: "Tudo que faz a Internet parar de ser um problema",
  cards: [
    { t: "Velocidade medida com você", d: "Fibra simétrica: mesma velocidade pra baixar e pra subir. No dia da instalação o técnico roda o teste na sua frente e o número fica registrado." },
    { t: "Wi-Fi 6 que cobre a casa", d: "Roteador incluso e ponto mesh nos planos maiores. O sinal é conferido cômodo a cômodo — inclusive no quarto dos fundos." },
    { t: "Suporte com gente de verdade", d: "WhatsApp com time local. A conversa continua de onde parou, sem repetir o problema pra cada atendente novo." },
    { t: "Rede monitorada 24 horas", d: "NOC acompanhando a rede o tempo todo. Muitas vezes a gente vê o problema e age antes de você perceber." },
    { t: "Sem fidelidade, sem multa", d: "Você fica porque quer. Se um dia quiser sair, é só avisar — e isso está escrito no contrato que você assina." },
    { t: "Instalação sem custo", d: "Sem taxa de adesão. O equipamento vem em comodato, com manutenção por nossa conta enquanto você for cliente." },
  ],
} as const;

export const PARA_QUEM = {
  eyebrow: "Pra quem é",
  title: "A mesma fibra, três rotinas diferentes",
  cards: [
    { t: "Pra casa que não pode parar", d: "Home office, aula online e streaming ao mesmo tempo, sem ninguém pedir pra “sair da internet um minuto”." },
    { t: "Pra quem joga", d: "Rota estável e latência baixa. O que derruba partida não é velocidade, é oscilação — e é nela que a gente mexe." },
    { t: "Pra empresa", d: "Link dedicado, banda garantida, SLA e prazo de reparo em contrato, com suporte que entende urgência." },
  ],
} as const;

export const COMPARATIVO = {
  eyebrow: "Comparativo",
  staleTitle: "O provedor que você tem hoje",
  oursTitle: "A VBZ",
  title: "A diferença aparece no dia a dia",
  lead: "À esquerda, o que a gente mais ouve de quem chega. À direita, o que fazemos diferente — e por quê.",
  pairs: [
    { pain: { t: "“Até 300 Mega”", d: "O “até” é a diferença entre o que você paga e o que chega no aparelho." },
      ours: { t: "A velocidade contratada, medida na instalação", d: "O técnico roda o teste com você antes de ir embora e o número fica registrado." } },
    { pain: { t: "Cai toda noite", d: "Rede compartilhada demais: no pico, todo mundo disputa a mesma banda." },
      ours: { t: "Capacidade dimensionada pro pico", d: "A rede é planejada pelo horário de maior uso, não pela média do dia." } },
    { pain: { t: "Suporte é um menu sem saída", d: "“Digite 1.” Meia hora depois, a orientação é reiniciar o roteador de novo." },
      ours: { t: "WhatsApp com gente de verdade", d: "Time local, conversa que continua de onde parou e visita quando o problema é na rua." } },
    { pain: { t: "A promoção some no terceiro mês", d: "A oferta de entrada vence e a fatura sobe sem ninguém avisar." },
      ours: { t: "Preço combinado é preço cobrado", d: "O valor está no contrato. Se mudar, você é avisado antes — não pela fatura." } },
    { pain: { t: "Wi-Fi que não passa da sala", d: "Roteador antigo, instalado onde deu, e metade da casa no sinal fraco." },
      ours: { t: "Wi-Fi 6 posicionado com medição", d: "Equipamento incluso, ponto mesh nos planos maiores e sinal conferido cômodo a cômodo." } },
  ],
} as const;

export const FORMULARIO = {
  eyebrow: "Viabilidade",
  title: "Cansou de ter problemas com a Internet da sua casa?",
  lead: "Quem troca pra VBZ quase sempre chega pelo mesmo motivo: cansou. E é justamente por isso que a gente não vende promessa — vende o que está escrito no contrato.",
  checks: [
    "Consulta sem compromisso: não pedimos documento nem cartão",
    "Se ainda não chegamos no seu endereço, a gente diz na hora",
    "Quem responde é o time local, no WhatsApp",
  ],
} as const;

export type PlanKind = "casa" | "empresa";
export interface Plan {
  kind: PlanKind; name: string; speed: string; price: string; priceNote: string;
  features: string[]; featured?: boolean; cta: string;
}

/** PENDENTE: preços herdados da página anterior — validar antes de virar anúncio pago. */
export const PLANS: Plan[] = [
  { kind: "casa", name: "Essencial", speed: "500 Mega", price: "R$ 100", priceNote: "/mês · R$ 90 no cartão",
    features: ["500 Mega de download", "Upload na mesma velocidade", "Roteador Wi-Fi 5 incluso", "Instalação grátis", "Sem fidelidade", "Suporte no WhatsApp"], cta: "Quero o Essencial" },
  { kind: "casa", name: "Super", speed: "700 Mega", price: "R$ 130", priceNote: "/mês · R$ 120 no cartão", featured: true,
    features: ["700 Mega de download", "Upload na mesma velocidade", "Roteador Wi-Fi 6 incluso", "Streaming Plus por 12 meses", "Instalação grátis", "Sem fidelidade"], cta: "Quero o Super" },
  { kind: "casa", name: "Ultra", speed: "1 Giga", price: "R$ 160", priceNote: "/mês · R$ 150 no cartão",
    features: ["1 Giga de download", "Upload na mesma velocidade", "Wi-Fi 6 + ponto mesh", "Streaming Plus por 12 meses", "Instalação grátis", "Prioridade no atendimento"], cta: "Quero o Ultra" },
  { kind: "empresa", name: "Dedicado 50", speed: "50 Mbps", price: "Sob consulta", priceNote: "orçado por endereço",
    features: ["Banda 100% dedicada e simétrica", "SLA 99,9% em contrato", "Suporte NOC 24/7", "IP fixo"], cta: "Pedir proposta" },
  { kind: "empresa", name: "Dedicado 150", speed: "150 Mbps", price: "Sob consulta", priceNote: "orçado por endereço", featured: true,
    features: ["Banda 100% dedicada e simétrica", "SLA 99,9% em contrato", "Suporte prioritário", "Redundância ativa"], cta: "Pedir proposta" },
  { kind: "empresa", name: "Enterprise", speed: "Sob medida", price: "Sob consulta", priceNote: "projeto dedicado",
    features: ["Capacidade sob medida", "SLA 99,99%", "Multi-rota redundante", "Gerente de conta"], cta: "Falar com engenharia" },
];

export const GARANTIA = {
  eyebrow: "Sem risco",
  title: "Se não ficar satisfeito, cancele sem multa",
  lead: "A VBZ não trabalha com fidelidade. Você não precisa se prender a um contrato de dois anos pra ter uma internet que funciona — e essa cláusula está no documento que você assina, não só nesta página.",
  cta: "Receber a viabilidade do meu endereço",
} as const;

/** PENDENTE: depoimento real, com nome e cidade de cliente que autorizou o uso. */
export const DEPOIMENTOS = [
  { texto: "Trocamos de provedor sem parar a operação. O link chegou com a banda que está no contrato e o suporte responde no WhatsApp em minutos.", quem: "Gerente de TI", meta: "Empresa · 80 colaboradores", iniciais: "TI" },
  { texto: "O que me pegou foi a instalação: hora marcada, cabo passado com capricho e o técnico só saiu depois de testar o Wi-Fi no quarto dos fundos.", quem: "Cliente residencial", meta: "Plano Ultra · 1 Giga", iniciais: "CR" },
  { texto: "Antes eu reiniciava o roteador toda noite. Faz meses que não penso na internet — que é exatamente o que eu queria.", quem: "Cliente residencial", meta: "Plano Super · 700 Mega", iniciais: "CS" },
] as const;

export const FAQS = [
  { q: "A VBZ tem fidelidade ou multa contratual?", a: "Não. Sem fidelidade e sem multa de cancelamento — se um dia você quiser sair, é só avisar. A cláusula está no contrato que você assina, não só nesta página." },
  { q: "A instalação é cobrada?", a: "Não. Não há taxa de adesão nem custo de instalação, e o roteador vem incluso em comodato: fica na sua casa enquanto você for cliente, com manutenção por nossa conta." },
  { q: "Visita técnica tem custo?", a: "Não para problema na nossa rede ou no equipamento que fornecemos. Se a causa for algo dentro da sua casa que não faz parte do serviço, o técnico explica e combina com você antes de qualquer cobrança." },
  { q: "Como sei se tem VBZ no meu endereço?", a: "Preencha o formulário com seu endereço ou informe o CEP no fluxo de contratação: a disponibilidade é consultada na hora. Se ainda não chegamos aí, dizemos na hora e avisamos quando a fibra chegar." },
  { q: "A velocidade é a mesma pra subir e baixar?", a: "Sim. Os planos são simétricos — a mesma velocidade de download e upload, o que faz diferença real em chamada de vídeo, backup em nuvem e transmissão ao vivo." },
  { q: "Vocês colocam serviço na conta sem avisar?", a: "Não. O que você contrata é o que aparece na fatura. Qualquer adicional depende de você pedir, e mudança de valor é comunicada antes — nunca descoberta pela fatura." },
  { q: "O atendimento segue script?", a: "O time é local e conhece a rede da região. Existe roteiro técnico pra não pular etapa de diagnóstico, mas quem responde é uma pessoa, e a conversa continua de onde parou." },
  { q: "Atende empresa?", a: "Sim. Para empresa o produto é link dedicado: banda garantida, SLA e prazo de reparo em contrato, com suporte NOC 24/7. O orçamento é feito por endereço." },
] as const;

export const FINAL = {
  title: "Uma última troca e você para de procurar",
  lead: "Manda o endereço. A gente confere a viabilidade e responde — inclusive se ainda não der pra atender aí.",
  ctaPrimary: "Consultar meu endereço",
  ctaGhost: "Falar no WhatsApp",
} as const;

export const EXIT = {
  title: "Antes de sair: seu endereço tem VBZ?",
  body: "A consulta leva menos de um minuto, não pede documento nem cartão, e você descobre na hora se já chegamos aí.",
  ctaPrimary: "Consultar agora",
  ctaGhost: "Falar no WhatsApp",
} as const;

export const FOOTER_COLS = [
  { title: "Planos", links: [
    { label: "Internet pra sua casa", href: "#planos" },
    { label: "Internet pra empresa", href: "#planos" },
    { label: "Consultar viabilidade", href: "#viabilidade" },
  ] },
  { title: "Ajuda", links: [
    { label: "Suporte técnico", href: WHATSAPP_SUPORTE, external: true },
    { label: "2ª via de fatura", href: whatsappUrl("Olá! Preciso da 2ª via da minha fatura VBZ."), external: true },
    { label: "Dúvidas frequentes", href: "#faq" },
  ] },
  { title: "VBZ", links: [
    { label: "Falar com vendas", href: WHATSAPP_VENDAS, external: true },
    { label: "Termo de Consentimento", href: "/termo-consentimento" },
  ] },
] as const;
