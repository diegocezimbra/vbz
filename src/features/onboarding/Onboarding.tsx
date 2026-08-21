import { useMemo, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";

import vbzLogo from "@/assets/vbz-logo.png";
import { checkCoverage } from "../landing/contratacao/cobertura.functions";
import { checkCredit } from "../landing/contratacao/credito.functions";
import { submitViability } from "../landing/lead/lead.functions";
import { ASIDE, COMO, GARANTIAS, HOOK, OFERTA, ONB_WHATSAPP } from "./onboarding.config";
import {
  StepCep, StepConta, StepContrato, StepCredito, StepInstalacao,
  StepPagamento, StepTitular, StepWifi,
} from "./CollectSteps";
import { StepComo, StepGarantias, StepHook, StepOferta } from "./SalesSteps";
import { StepPronto } from "./DoneStep";
import {
  ONB_STEPS, canAdvance, emptyOnboarding, isSalesStep, nextOnb, onbProgress, prevOnb,
  type OnbStep, type OnboardingState,
} from "./steps";
import "../landing/landing.css";
import "../landing/contratacao/contratacao.css";
import "./onboarding.css";

const CTA_LABEL: Partial<Record<OnbStep, string>> = {
  hook: HOOK.cta, como: COMO.cta, garantias: GARANTIAS.cta, oferta: OFERTA.cta,
  contrato: "Assinar contrato", wifi: "Concluir contratação",
};

/** Instalação só a partir do dia seguinte - agenda pra hoje não existe na prática. */
function amanha(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function Aside({ state }: { state: OnboardingState }) {
  const linhas = [
    state.plano && { t: "Plano", v: state.plano },
    state.cidade && { t: "Endereço", v: `${state.cidade}/${state.uf}` },
    state.vencimento && { t: "Vencimento", v: `dia ${state.vencimento}` },
    state.instalacaoData && { t: "Instalação", v: state.instalacaoData.split("-").reverse().join("/") },
  ].filter(Boolean) as { t: string; v: string }[];

  return (
    <aside className="onb__aside">
      <h3>{ASIDE.title}</h3>
      <ul>
        {ASIDE.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
      {linhas.length > 0 && (
        <div className="onb__resumo">
          <h4>Sua contratação</h4>
          <dl>
            {linhas.map((l) => (
              <div className="onb__linha" key={l.t}>
                <dt>{l.t}</dt>
                <dd>{l.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </aside>
  );
}

/**
 * Onboarding completo: vende, cadastra, contrata e configura na mesma rota.
 *
 * A ordem é deliberada - os quatro primeiros passos não pedem nada. Quem chega de
 * anúncio ainda não sabe o que a VBZ entrega; pedir CEP na primeira tela troca a
 * conversa por um formulário e perde quem ainda estava decidindo.
 */
export function Onboarding() {
  const [step, setStep] = useState<OnbStep>("hook");
  const [state, setState] = useState<OnboardingState>(emptyOnboarding());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const minDate = useMemo(amanha, []);

  const patch = (p: Partial<OnboardingState>) => setState((s) => ({ ...s, ...p }));

  const mirrorLead = async (marcador: string) => {
    try {
      await submitViability({
        data: {
          nome: state.nome,
          telefone: state.telefone,
          endereco: `${state.logradouro || state.cep}, ${state.numero} [${marcador}]`.slice(0, 200),
          cidade: state.cidade || "não informada",
          landing: typeof window === "undefined" ? undefined : window.location.href,
        },
      });
    } catch (error) {
      console.error("[onboarding] espelho no CRM falhou:", error);
    }
  };

  const onCheckCoverage = async () => {
    setBusy(true);
    try {
      const r = await checkCoverage({ data: { cep: state.cep } });
      patch({
        logradouro: r.logradouro, bairro: r.bairro, cidade: r.cidade, uf: r.uf,
        disponivel: r.status === "nao_encontrado" ? null : r.status !== "fora",
      });
      setMessage(r.message);
    } catch (error) {
      console.error("[onboarding] consulta de CEP falhou:", error);
      patch({ disponivel: true });
      setMessage("Não consegui consultar agora. Seguimos e confirmamos com você.");
    } finally {
      setBusy(false);
    }
  };

  const onRunCredit = async () => {
    setBusy(true);
    try {
      const r = await checkCredit({ data: { cpf: state.cpf, nome: state.nome } });
      patch({ credito: r.decision });
      setMessage(r.message);
    } catch (error) {
      console.error("[onboarding] análise de crédito falhou:", error);
      patch({ credito: "analise_manual" });
      setMessage("Sua proposta vai passar por uma conferência rápida do nosso time.");
    } finally {
      setBusy(false);
    }
  };

  const advance = () => {
    if (!canAdvance(step, state)) return;
    if (step === "conta") void mirrorLead(`onboarding - plano ${state.plano}`);
    if (step === "wifi") {
      void mirrorLead(
        `CONTRATADO - ${state.plano} - ${state.pagamento} venc. ${state.vencimento} - instalar ${state.instalacaoData} ${state.instalacaoTurno}`,
      );
    }
    setMessage("");
    setStep(nextOnb(step));
  };

  const podeAvancar = canAdvance(step, state);

  return (
    <div className="lp onb">
      <div className="onb__main">
        <div className="onb__top">
          {step === "hook" ? (
            <a href="/"><img src={vbzLogo} alt="VBZ" /></a>
          ) : (
            <button type="button" className="onb__back" onClick={() => setStep(prevOnb(step))}>
              <ArrowLeft size={16} /> voltar
            </button>
          )}
          <a className="onb__back" href={ONB_WHATSAPP} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Falar com um consultor
          </a>
        </div>

        {!isSalesStep(step) && (
          <div className="onb__bar" role="progressbar" aria-valuenow={onbProgress(step)} aria-valuemin={0} aria-valuemax={100}>
            <div className="onb__fill" style={{ width: `${onbProgress(step)}%` }} />
          </div>
        )}

        <div className="onb__body">
          {step === "hook" && <StepHook />}
          {step === "como" && <StepComo />}
          {step === "garantias" && <StepGarantias />}
          {step === "oferta" && <StepOferta state={state} patch={patch} />}
          {step === "cep" && <StepCep state={state} patch={patch} busy={busy} message={message} onCheck={onCheckCoverage} />}
          {step === "conta" && <StepConta state={state} patch={patch} />}
          {step === "titular" && <StepTitular state={state} patch={patch} />}
          {step === "credito" && <StepCredito state={state} busy={busy} message={message} onRun={onRunCredit} />}
          {step === "contrato" && <StepContrato state={state} patch={patch} />}
          {step === "pagamento" && <StepPagamento state={state} patch={patch} />}
          {step === "instalacao" && <StepInstalacao state={state} patch={patch} minDate={minDate} />}
          {step === "wifi" && <StepWifi state={state} patch={patch} />}
          {step === "pronto" && <StepPronto state={state} whatsapp={ONB_WHATSAPP} />}

          {step !== "pronto" && (
            <div className="onb__nav">
              <button type="button" className="lp-btn lp-btn--cta lp-btn--lg" onClick={advance} disabled={!podeAvancar || busy}>
                {CTA_LABEL[step] ?? "Continuar"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Aside state={state} />
    </div>
  );
}
