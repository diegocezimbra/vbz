/**
 * Compromissos comerciais que a VBZ assume na contratação (Diego, 18/08/2026).
 * Ficam aqui porque aparecem em DOIS lugares — na venda e no texto do contrato — e
 * promessa que diverge entre a página e o contrato é a origem clássica de reclamação.
 */
export const COMPROMISSOS = [
  {
    titulo: "Cancelou, não paga multa",
    desc: "Sem fidelidade e sem multa de cancelamento. Se um dia você quiser sair, é só avisar.",
  },
  {
    titulo: "Instalação sem custo",
    desc: "A instalação e o equipamento não têm custo de adesão. Você paga a mensalidade, e só.",
  },
  {
    titulo: "A última troca de provedor",
    desc: "A gente entrega a velocidade contratada e atende quando você chama. É por isso que quem troca pra VBZ para de trocar.",
  },
] as const;

export interface ContractSummary {
  titular: string;
  cpf: string;
  endereco: string;
  plano: string;
}

/** Cláusulas do aceite, montadas a partir do que a pessoa preencheu. */
export function contractClauses(summary: ContractSummary): string[] {
  return [
    `Titular: ${summary.titular}, CPF ${summary.cpf}.`,
    `Endereço de instalação: ${summary.endereco}.`,
    `Plano contratado: ${summary.plano}, cobrado mensalmente.`,
    "Sem prazo de fidelidade e sem multa em caso de cancelamento, a qualquer momento.",
    "Sem taxa de adesão e sem custo de instalação. O equipamento é cedido em comodato e volta pra VBZ no fim do contrato.",
    "A velocidade contratada é medida na instalação, na presença do titular.",
    "A contratação depende de viabilidade técnica no endereço e de análise de crédito.",
    "Os dados informados são usados para viabilizar a contratação e o atendimento, nos termos do Termo de Consentimento.",
  ];
}
