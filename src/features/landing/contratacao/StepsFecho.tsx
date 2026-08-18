import { MessageCircle, ShieldCheck } from "lucide-react";

import { maskCPF } from "../lead/documents";
import { maskPhoneBR } from "../lead/phone";
import { COMPROMISSOS, contractClauses } from "./contrato";
import { Field } from "./Field";
import type { ContratacaoState } from "./steps";

type Patch = (patch: Partial<ContratacaoState>) => void;

export function StepDados({ state, patch }: { state: ContratacaoState; patch: Patch }) {
  return (
    <>
      <p className="lp-wiz__hint">Dados do titular — é com eles que a gente emite o contrato.</p>
      <Field id="wz-nome" label="Nome completo" value={state.nome} autoComplete="name" onChange={(v) => patch({ nome: v })} />
      <div className="lp-wiz__row lp-wiz__row--2">
        <Field id="wz-cpf" label="CPF" value={state.cpf} inputMode="numeric" placeholder="000.000.000-00" onChange={(v) => patch({ cpf: maskCPF(v) })} />
        <Field id="wz-nasc" label="Data de nascimento" type="date" value={state.nascimento} onChange={(v) => patch({ nascimento: v })} />
      </div>
      <div className="lp-wiz__row lp-wiz__row--2">
        <Field id="wz-email" label="E-mail" type="email" inputMode="email" autoComplete="email" value={state.email} onChange={(v) => patch({ email: v })} />
        <Field id="wz-tel" label="Telefone" inputMode="tel" autoComplete="tel" value={state.telefone} onChange={(v) => patch({ telefone: maskPhoneBR(v) })} />
      </div>
      <p className="lp-form__legal">
        O CPF é usado só para a análise de crédito da contratação. Não vendemos nem repassamos
        seus dados — veja o <a href="/termo-consentimento" style={{ textDecoration: "underline" }}>Termo de Consentimento</a>.
      </p>
    </>
  );
}

export function StepCredito({
  state, running, message, onRun,
}: { state: ContratacaoState; running: boolean; message: string; onRun: () => void }) {
  const tone = state.credito === "aprovado" ? "ok" : state.credito === "recusado" ? "bad" : "warn";
  return (
    <>
      <p className="lp-wiz__hint">
        Análise de crédito da contratação. É uma consulta simples e não gera custo pra você.
      </p>
      {state.credito ? (
        <div className={`lp-wiz__msg lp-wiz__msg--${tone}`}>{message}</div>
      ) : (
        <button type="button" className="lp-btn lp-btn--cta lp-btn--lg lp-btn--block" onClick={onRun} disabled={running}>
          {running ? "Analisando…" : "Fazer análise de crédito"}
        </button>
      )}
    </>
  );
}

export function StepContrato({ state, patch }: { state: ContratacaoState; patch: Patch }) {
  const endereco = `${state.logradouro}, ${state.numero}${state.complemento ? ` — ${state.complemento}` : ""}, ${state.bairro}, ${state.cidade}/${state.uf}, CEP ${state.cep}`;
  const clauses = contractClauses({ titular: state.nome, cpf: state.cpf, endereco, plano: state.plano });

  return (
    <>
      <p className="lp-wiz__hint">Confere o resumo, lê as condições e assina digitando seu nome completo.</p>

      <ul className="lp-wiz__promises">
        {COMPROMISSOS.map((c) => (
          <li key={c.titulo}><span><b>{c.titulo}.</b> {c.desc}</span></li>
        ))}
      </ul>

      <div className="lp-wiz__doc">
        <ol>
          {clauses.map((clause) => (
            <li key={clause}>{clause}</li>
          ))}
        </ol>
      </div>

      <label className="lp-wiz__check" htmlFor="wz-aceite">
        <input
          id="wz-aceite"
          type="checkbox"
          checked={state.aceite}
          onChange={(e) => patch({ aceite: e.target.checked })}
        />
        <span>Li e aceito as condições acima e o Termo de Consentimento.</span>
      </label>

      <Field
        id="wz-assinatura"
        label="Assinatura — digite seu nome completo"
        value={state.assinatura}
        autoComplete="off"
        placeholder={state.nome || "Seu nome completo"}
        onChange={(v) => patch({ assinatura: v })}
        error={
          state.assinatura && state.assinatura.trim().toLowerCase() !== state.nome.trim().toLowerCase()
            ? "A assinatura precisa ser igual ao nome do titular."
            : undefined
        }
      />
    </>
  );
}

export function StepPronto({ state, whatsapp }: { state: ContratacaoState; whatsapp: string }) {
  const emAnalise = state.credito === "analise_manual";
  return (
    <div className="lp-wiz__done">
      <span className="lp-feat__icon" style={{ margin: "0 auto var(--s4)" }}><ShieldCheck size={24} /></span>
      <h3>{emAnalise ? "Contrato assinado, conferência em andamento" : "Pronto! Contrato assinado"}</h3>
      <p>
        {emAnalise
          ? "Recebemos sua assinatura. Nosso time faz uma conferência rápida e já entra em contato pra agendar a instalação."
          : `Vamos entrar em contato para agendar a instalação em ${state.cidade || "seu endereço"}, no horário que você escolher.`}
      </p>
      <a className="lp-btn lp-btn--cta lp-btn--lg lp-btn--block" href={whatsapp} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={18} /> Agendar pelo WhatsApp
      </a>
    </div>
  );
}
