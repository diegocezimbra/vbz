import { isValidCEP, isValidCPF } from "../lead/documents";
import { isValidPhoneBR } from "../lead/phone";

export const STEP_ORDER = ["cep", "plano", "dados", "credito", "contrato", "pronto"] as const;
export type Step = (typeof STEP_ORDER)[number];

export type CreditResult = "aprovado" | "analise_manual" | "recusado" | null;

export interface ContratacaoState {
  cep: string;
  numero: string;
  complemento: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  disponivel: boolean | null;
  plano: string;
  nome: string;
  cpf: string;
  nascimento: string;
  email: string;
  telefone: string;
  credito: CreditResult;
  aceite: boolean;
  assinatura: string;
}

export function emptyState(): ContratacaoState {
  return {
    cep: "", numero: "", complemento: "", logradouro: "", bairro: "", cidade: "", uf: "",
    disponivel: null, plano: "", nome: "", cpf: "", nascimento: "", email: "", telefone: "",
    credito: null, aceite: false, assinatura: "",
  };
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cada passo declara a própria condição de saída. Centralizar aqui — em vez de
 * espalhar `disabled={...}` por componente — é o que permite testar o fluxo inteiro
 * sem renderizar nada e garante que o botão "continuar" e a validação nunca divirjam.
 */
export function canAdvance(step: Step, s: ContratacaoState): boolean {
  switch (step) {
    case "cep":
      return isValidCEP(s.cep) && s.numero.trim().length > 0 && s.disponivel === true;
    case "plano":
      return s.plano.length > 0;
    case "dados":
      return (
        s.nome.trim().split(" ").filter(Boolean).length >= 2 &&
        isValidCPF(s.cpf) &&
        /^\d{4}-\d{2}-\d{2}$/.test(s.nascimento) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) &&
        isValidPhoneBR(s.telefone)
      );
    case "credito":
      // "recusado" não avança: o contrato não é oferecido a quem a análise reprovou.
      return s.credito === "aprovado" || s.credito === "analise_manual";
    case "contrato":
      // Assinatura digitada tem que bater com o nome do titular — aceite sem conferência
      // é caixinha marcada, não manifestação de vontade.
      return s.aceite && normalize(s.assinatura) === normalize(s.nome) && s.assinatura.length > 0;
    case "pronto":
      return true;
  }
}

export function nextStep(step: Step): Step {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
}

export function prevStep(step: Step): Step {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.max(i - 1, 0)];
}

export function progress(step: Step): number {
  return Math.round((STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100);
}
