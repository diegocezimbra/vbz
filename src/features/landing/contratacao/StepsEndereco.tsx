import { MessageCircle } from "lucide-react";

import { maskCEP } from "../lead/documents";
import { PLANS } from "../landing.content";
import { COMPROMISSOS } from "./contrato";
import { Field } from "./Field";
import type { ContratacaoState } from "./steps";

type Patch = (patch: Partial<ContratacaoState>) => void;

export function StepCep({
  state, patch, checking, message, notFound, onCheck, onAvisar, onSkipCep, whatsapp,
}: {
  state: ContratacaoState; patch: Patch; checking: boolean; message: string; notFound: boolean;
  onCheck: () => void; onAvisar: () => void; onSkipCep: () => void; whatsapp: string;
}) {
  const fora = state.disponivel === false;

  return (
    <>
      <p className="lp-wiz__hint">Começa pelo CEP. A gente confere a disponibilidade na hora.</p>
      <div className="lp-wiz__row lp-wiz__row--2">
        <Field
          id="wz-cep" label="CEP" value={state.cep} inputMode="numeric" autoComplete="postal-code"
          placeholder="00000-000" onChange={(v) => patch({ cep: maskCEP(v), disponivel: null })}
        />
        <Field
          id="wz-numero" label="Número" value={state.numero} inputMode="numeric"
          placeholder="123" onChange={(v) => patch({ numero: v })}
        />
      </div>
      <Field
        id="wz-compl" label="Complemento (opcional)" value={state.complemento}
        placeholder="Apto, bloco, casa" onChange={(v) => patch({ complemento: v })}
      />

      {message && (
        <div className={`lp-wiz__msg ${fora || notFound ? "lp-wiz__msg--warn" : "lp-wiz__msg--ok"}`}>
          {message}
          {state.logradouro && <div style={{ marginTop: 6 }}><strong>{state.logradouro}, {state.numero} — {state.bairro}, {state.cidade}/{state.uf}</strong></div>}
        </div>
      )}

      <ul className="lp-wiz__promises">
        {COMPROMISSOS.map((c) => (
          <li key={c.titulo}><span><b>{c.titulo}.</b> {c.desc}</span></li>
        ))}
      </ul>

      {fora ? (
        <>
          <p className="lp-wiz__hint">Deixa seu contato que a gente avisa assim que a fibra chegar aí.</p>
          <div className="lp-wiz__row lp-wiz__row--2">
            <Field id="wz-nome-fora" label="Nome" value={state.nome} autoComplete="name" onChange={(v) => patch({ nome: v })} />
            <Field id="wz-tel-fora" label="Telefone" value={state.telefone} inputMode="tel" autoComplete="tel" onChange={(v) => patch({ telefone: v })} />
          </div>
          <button type="button" className="lp-btn lp-btn--cta lp-btn--lg lp-btn--block" onClick={onAvisar}>
            Quero ser avisado
          </button>
          <a className="lp-btn lp-btn--outline lp-btn--block" style={{ marginTop: "var(--s3)" }} href={whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Falar com um consultor
          </a>
        </>
      ) : (
        <>
          <button
            type="button"
            className="lp-btn lp-btn--cta lp-btn--lg lp-btn--block"
            onClick={onCheck}
            disabled={checking || state.cep.length < 9 || !state.numero.trim()}
          >
            {checking ? "Consultando…" : "Consultar disponibilidade"}
          </button>
          {notFound && (
            <button type="button" className="lp-btn lp-btn--outline lp-btn--block" style={{ marginTop: "var(--s3)" }} onClick={onSkipCep}>
              Seguir mesmo assim
            </button>
          )}
        </>
      )}
    </>
  );
}

export function StepPlano({ state, patch }: { state: ContratacaoState; patch: Patch }) {
  const planos = PLANS;
  return (
    <>
      <p className="lp-wiz__hint">Escolha a velocidade. Equipamento e instalação já estão inclusos.</p>
      <div className="lp-wiz__pick">
        {planos.map((plan) => (
          <button
            key={plan.name}
            type="button"
            className="lp-wiz__opt"
            aria-pressed={state.plano === plan.name}
            onClick={() => patch({ plano: plan.name })}
          >
            <span>
              <b>{plan.name} · {plan.mega} Mega</b>
              <span>{plan.wifi}{plan.watchTv ? " · Watch TV" : ""}</span>
            </span>
            <em>R$ {plan.priceInt},{plan.priceCents}</em>
          </button>
        ))}
      </div>
    </>
  );
}
