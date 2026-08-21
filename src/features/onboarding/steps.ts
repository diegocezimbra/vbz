import { isValidCEP, isValidCPF } from "../landing/lead/documents";
import { isValidPhoneBR } from "../landing/lead/phone";

export const ONB_STEPS = [
  "hook", "como", "garantias", "oferta",
  "cep", "conta", "titular", "credito", "contrato",
  "pagamento", "instalacao", "wifi", "pronto",
] as const;
export type OnbStep = (typeof ONB_STEPS)[number];

/**
 * Passos de venda: sem barra de progresso, porque ainda não começou coleta nenhuma.
 * `oferta` entra aqui pela aparência (é tela de venda) mas é ela que colhe o plano -
 * ter um passo "plano" depois faria a pessoa escolher a mesma coisa duas vezes.
 */
const SALES_STEPS: OnbStep[] = ["hook", "como", "garantias", "oferta"];
export function isSalesStep(step: OnbStep): boolean {
  return SALES_STEPS.includes(step);
}

export type Turno = "manha" | "tarde";
export type FormaPagamento = "pix" | "boleto" | "";

export interface OnboardingState {
  cep: string; numero: string; complemento: string;
  logradouro: string; bairro: string; cidade: string; uf: string;
  disponivel: boolean | null;
  plano: string;
  nome: string; email: string; telefone: string;
  cpf: string; nascimento: string;
  credito: "aprovado" | "analise_manual" | "recusado" | null;
  aceite: boolean; assinatura: string;
  pagamento: FormaPagamento; vencimento: number | null;
  instalacaoData: string; instalacaoTurno: Turno | ""; recebePor: string;
  wifiNome: string; wifiSenha: string;
}

/**
 * Note o que NÃO existe aqui: senha. Sem um serviço de identidade plugado, guardar
 * senha (ou pior, mandar pro CRM) seria criar um vazamento com data marcada. O acesso
 * do cliente vai por link de primeiro acesso no WhatsApp/e-mail que ele já informou.
 */
export function emptyOnboarding(): OnboardingState {
  return {
    cep: "", numero: "", complemento: "", logradouro: "", bairro: "", cidade: "", uf: "",
    disponivel: null, plano: "", nome: "", email: "", telefone: "", cpf: "", nascimento: "",
    credito: null, aceite: false, assinatura: "",
    pagamento: "", vencimento: null,
    instalacaoData: "", instalacaoTurno: "", recebePor: "",
    wifiNome: "", wifiSenha: "",
  };
}

function normalize(v: string): string {
  return v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Senha de Wi-Fi tem mínimo de 8 caracteres no WPA2 - abaixo disso o roteador recusa. */
const WIFI_MIN = 8;

export function canAdvance(step: OnbStep, s: OnboardingState): boolean {
  switch (step) {
    case "hook": case "como": case "garantias":
      return true;
    case "oferta":
      return s.plano.length > 0;
    case "cep":
      return isValidCEP(s.cep) && s.numero.trim().length > 0 && s.disponivel === true;
    case "conta":
      return (
        s.nome.trim().split(" ").filter(Boolean).length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) &&
        isValidPhoneBR(s.telefone)
      );
    case "titular":
      return isValidCPF(s.cpf) && /^\d{4}-\d{2}-\d{2}$/.test(s.nascimento);
    case "credito":
      return s.credito === "aprovado" || s.credito === "analise_manual";
    case "contrato":
      return s.aceite && s.assinatura.length > 0 && normalize(s.assinatura) === normalize(s.nome);
    case "pagamento":
      return s.pagamento !== "" && s.vencimento !== null;
    case "instalacao":
      return Boolean(s.instalacaoData) && s.instalacaoTurno !== "" && s.recebePor.trim().length > 2;
    case "wifi":
      return s.wifiNome.trim().length > 1 && s.wifiSenha.length >= WIFI_MIN;
    case "pronto":
      return true;
  }
}

export function nextOnb(step: OnbStep): OnbStep {
  const i = ONB_STEPS.indexOf(step);
  return ONB_STEPS[Math.min(i + 1, ONB_STEPS.length - 1)];
}

export function prevOnb(step: OnbStep): OnbStep {
  const i = ONB_STEPS.indexOf(step);
  return ONB_STEPS[Math.max(i - 1, 0)];
}

/** Barra só anda depois que a coleta começa: mostrar 30% em tela de venda é mentira. */
export function onbProgress(step: OnbStep): number {
  const first = ONB_STEPS.indexOf("cep");
  const i = ONB_STEPS.indexOf(step);
  if (i < first) return 0;
  // Conta o passo em que a pessoa ESTÁ como já andado: barra em 0% com o formulário
  // na tela é lida como travada, não como "acabei de começar".
  return Math.round(((i - first + 1) / (ONB_STEPS.length - first)) * 100);
}
