import { useState } from "react";

import { whatsappUrl } from "@/lib/contact";
import { submitViability } from "../lead/lead.functions";
import { checkCoverage } from "./cobertura.functions";
import { checkCredit } from "./credito.functions";
import { StepCep, StepPlano } from "./StepsEndereco";
import { StepContrato, StepCredito, StepDados, StepPronto } from "./StepsFecho";
import {
  STEP_ORDER, canAdvance, emptyState, nextStep, prevStep, progress,
  type ContratacaoState, type Step,
} from "./steps";
import "./contratacao.css";

const TITLES: Record<Step, string> = {
  cep: "Tem VBZ no seu endereço?",
  plano: "Escolha seu plano",
  dados: "Seus dados",
  credito: "Análise de crédito",
  contrato: "Contrato",
  pronto: "Tudo certo",
};

function fullAddress(s: ContratacaoState): string {
  const rua = s.logradouro ? `${s.logradouro}, ${s.numero}` : `CEP ${s.cep}, nº ${s.numero}`;
  return [rua, s.complemento, s.bairro].filter(Boolean).join(" — ");
}

/**
 * Fluxo completo: disponibilidade → plano → dados → crédito → contrato.
 *
 * O lead vai pro CRM assim que existe nome + telefone (fim do passo "dados") e de novo
 * ao assinar. Esperar o fim do funil pra registrar significa perder todo mundo que
 * desistiu no meio — que é justamente quem o time de vendas precisa ligar de volta.
 */
export function Contratacao({ inicial }: { inicial?: Partial<ContratacaoState> } = {}) {
  const [step, setStep] = useState<Step>("cep");
  const [state, setState] = useState<ContratacaoState>({ ...emptyState(), ...inicial });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [notFound, setNotFound] = useState(false);

  const patch = (p: Partial<ContratacaoState>) => setState((s) => ({ ...s, ...p }));

  const mirrorLead = async (extraTags: string) => {
    try {
      await submitViability({
        data: {
          nome: state.nome,
          telefone: state.telefone,
          endereco: `${fullAddress(state)} [${extraTags}]`.slice(0, 200),
          cidade: state.cidade || "não informada",
          landing: typeof window === "undefined" ? undefined : window.location.href,
        },
      });
    } catch (error) {
      console.error("[contratacao] espelho no CRM falhou:", error);
    }
  };

  const onCheckCoverage = async () => {
    setBusy(true);
    try {
      const result = await checkCoverage({ data: { cep: state.cep } });
      patch({
        logradouro: result.logradouro, bairro: result.bairro, cidade: result.cidade,
        uf: result.uf,
        // `nao_encontrado` deixa em null: nem libera o avanço nem acusa falta de
        // cobertura — a pessoa corrige o CEP ou segue pela conferência manual.
        disponivel: result.status === "nao_encontrado" ? null : result.status !== "fora",
      });
      setMessage(result.message);
      setNotFound(result.status === "nao_encontrado");
    } catch (error) {
      console.error("[contratacao] consulta de CEP falhou:", error);
      patch({ disponivel: true });
      setMessage("Não consegui consultar agora. Seguimos e confirmamos com você.");
    } finally {
      setBusy(false);
    }
  };

  const onRunCredit = async () => {
    setBusy(true);
    try {
      const result = await checkCredit({ data: { cpf: state.cpf, nome: state.nome } });
      patch({ credito: result.decision });
      setMessage(result.message);
    } catch (error) {
      console.error("[contratacao] análise de crédito falhou:", error);
      patch({ credito: "analise_manual" });
      setMessage("Sua proposta vai passar por uma conferência rápida do nosso time.");
    } finally {
      setBusy(false);
    }
  };

  const onAvisar = async () => {
    await mirrorLead("fora de área — avisar quando chegar");
    setMessage("Anotado! A gente te avisa assim que a fibra chegar aí.");
  };

  const advance = async () => {
    if (!canAdvance(step, state)) return;
    if (step === "dados") void mirrorLead(`plano ${state.plano} — funil de contratação`);
    if (step === "contrato") {
      void mirrorLead(`CONTRATO ASSINADO — plano ${state.plano} — crédito ${state.credito}`);
    }
    setMessage("");
    setStep(nextStep(step));
  };

  const whatsapp = whatsappUrl(
    `Olá! Acabei de preencher a contratação no site da VBZ${state.plano ? ` (plano ${state.plano})` : ""}.`,
  );
  const showNav = step !== "cep" && step !== "pronto";

  return (
    <section className="lp-wiz" id="viabilidade-form" aria-label="Contratação">
      <div className="lp-wiz__head">
        <h3>{TITLES[step]}</h3>
        <span className="lp-wiz__count">
          passo {STEP_ORDER.indexOf(step) + 1} de {STEP_ORDER.length}
        </span>
      </div>
      <div className="lp-wiz__bar">
        <div className="lp-wiz__fill" style={{ width: `${Math.max(progress(step), 6)}%` }} />
      </div>

      {step === "cep" && (
        <StepCep
          state={state} patch={patch} checking={busy} message={message} notFound={notFound}
          onCheck={onCheckCoverage} onAvisar={onAvisar} whatsapp={whatsapp}
          onSkipCep={() => { patch({ disponivel: true }); setNotFound(false); setMessage("Beleza — a gente confirma o endereço com você antes da instalação."); }}
        />
      )}
      {step === "plano" && <StepPlano state={state} patch={patch} />}
      {step === "dados" && <StepDados state={state} patch={patch} />}
      {step === "credito" && <StepCredito state={state} running={busy} message={message} onRun={onRunCredit} />}
      {step === "contrato" && <StepContrato state={state} patch={patch} />}
      {step === "pronto" && <StepPronto state={state} whatsapp={whatsapp} />}

      {step === "cep" && state.disponivel === true && (
        <button type="button" className="lp-btn lp-btn--solid lp-btn--lg lp-btn--block"
          style={{ marginTop: "var(--s3)" }} onClick={advance}>
          Continuar
        </button>
      )}

      {showNav && (
        <div className="lp-wiz__nav">
          <button type="button" className="lp-btn lp-btn--outline" onClick={() => setStep(prevStep(step))}>
            Voltar
          </button>
          <button type="button" className="lp-btn lp-btn--cta" onClick={advance} disabled={!canAdvance(step, state) || busy}>
            {step === "contrato" ? "Assinar contrato" : "Continuar"}
          </button>
        </div>
      )}
    </section>
  );
}
