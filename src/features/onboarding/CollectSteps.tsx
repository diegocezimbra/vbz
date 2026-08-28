import { Field } from "../landing/contratacao/Field";
import { COMPROMISSOS, contractClauses } from "../landing/contratacao/contrato";
import { maskCEP, maskCPF } from "../landing/lead/documents";
import { maskPhoneBR } from "../landing/lead/phone";
import { PAGAMENTOS, TURNOS, VENCIMENTOS } from "./onboarding.config";
import type { FormaPagamento, OnboardingState, Turno } from "./steps";

type Patch = (p: Partial<OnboardingState>) => void;

export function StepCep({
  state,
  patch,
  busy,
  message,
  onCheck,
}: {
  state: OnboardingState;
  patch: Patch;
  busy: boolean;
  message: string;
  onCheck: () => void;
}) {
  return (
    <>
      <h1>Tem VBZ no seu endereço?</h1>
      <p className="onb__lead">Começa pelo CEP - a disponibilidade é consultada na hora.</p>
      <div className="onb__grid2">
        <Field
          id="onb-cep"
          label="CEP"
          value={state.cep}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          onChange={(v) => patch({ cep: maskCEP(v), disponivel: null })}
        />
        <Field
          id="onb-num"
          label="Número"
          value={state.numero}
          inputMode="numeric"
          placeholder="123"
          onChange={(v) => patch({ numero: v })}
        />
      </div>
      <Field
        id="onb-compl"
        label="Complemento (opcional)"
        value={state.complemento}
        placeholder="Apto, bloco, casa"
        onChange={(v) => patch({ complemento: v })}
      />
      {message && (
        <div
          className={`lp-wiz__msg ${state.disponivel === false ? "lp-wiz__msg--warn" : "lp-wiz__msg--ok"}`}
        >
          {message}
          {state.logradouro && (
            <div style={{ marginTop: 6 }}>
              <strong>
                {state.logradouro}, {state.numero} - {state.bairro}, {state.cidade}/{state.uf}
              </strong>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className="lp-btn lp-btn--outline lp-btn--lg"
        onClick={onCheck}
        disabled={busy || state.cep.length < 9 || !state.numero.trim()}
      >
        {busy ? "Consultando…" : "Consultar disponibilidade"}
      </button>
    </>
  );
}

export function StepConta({ state, patch }: { state: OnboardingState; patch: Patch }) {
  return (
    <>
      <h1>Vamos criar sua conta</h1>
      <p className="onb__lead">
        É com esses dados que a gente abre seu cadastro e te manda o acesso. Três campos, sem senha.
      </p>
      <Field
        id="onb-nome"
        label="Nome completo"
        value={state.nome}
        autoComplete="name"
        onChange={(v) => patch({ nome: v })}
      />
      <div className="onb__grid2">
        <Field
          id="onb-email"
          label="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={state.email}
          onChange={(v) => patch({ email: v })}
        />
        <Field
          id="onb-tel"
          label="Celular"
          inputMode="tel"
          autoComplete="tel"
          value={state.telefone}
          onChange={(v) => patch({ telefone: maskPhoneBR(v) })}
        />
      </div>
      <p className="onb__micro">
        A gente não pede senha aqui. Depois da instalação você recebe um link de primeiro acesso no
        WhatsApp e cria a sua - senha digitada em formulário de site é senha que vaza.
      </p>
    </>
  );
}

export function StepTitular({ state, patch }: { state: OnboardingState; patch: Patch }) {
  return (
    <>
      <h1>Dados do titular</h1>
      <p className="onb__lead">
        É com eles que o contrato é emitido e a análise de crédito é feita.
      </p>
      <div className="onb__grid2">
        <Field
          id="onb-cpf"
          label="CPF"
          value={state.cpf}
          inputMode="numeric"
          placeholder="000.000.000-00"
          onChange={(v) => patch({ cpf: maskCPF(v) })}
        />
        <Field
          id="onb-nasc"
          label="Data de nascimento"
          type="date"
          value={state.nascimento}
          onChange={(v) => patch({ nascimento: v })}
        />
      </div>
      <p className="onb__micro">O CPF é usado só para a análise de crédito da contratação.</p>
    </>
  );
}

export function StepCredito({
  state,
  busy,
  message,
  onRun,
}: {
  state: OnboardingState;
  busy: boolean;
  message: string;
  onRun: () => void;
}) {
  const tone = state.credito === "aprovado" ? "ok" : state.credito === "recusado" ? "bad" : "warn";
  return (
    <>
      <h1>Análise de crédito</h1>
      <p className="onb__lead">Consulta simples da contratação. Não tem custo pra você.</p>
      {state.credito ? (
        <div className={`lp-wiz__msg lp-wiz__msg--${tone}`}>{message}</div>
      ) : (
        <button
          type="button"
          className="lp-btn lp-btn--cta lp-btn--lg"
          onClick={onRun}
          disabled={busy}
        >
          {busy ? "Analisando…" : "Fazer análise"}
        </button>
      )}
    </>
  );
}

export function StepContrato({ state, patch }: { state: OnboardingState; patch: Patch }) {
  const endereco = `${state.logradouro}, ${state.numero}${state.complemento ? ` - ${state.complemento}` : ""}, ${state.bairro}, ${state.cidade}/${state.uf}, CEP ${state.cep}`;
  return (
    <>
      <h1>Contrato</h1>
      <p className="onb__lead">Lê as condições e assina digitando seu nome completo.</p>
      <ul className="lp-wiz__promises">
        {COMPROMISSOS.map((c) => (
          <li key={c.titulo}>
            <span>
              <b>{c.titulo}.</b> {c.desc}
            </span>
          </li>
        ))}
      </ul>
      <div className="lp-wiz__doc">
        <ol>
          {contractClauses({
            titular: state.nome,
            cpf: state.cpf,
            endereco,
            plano: state.plano,
          }).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </div>
      <label className="lp-wiz__check" htmlFor="onb-aceite">
        <input
          id="onb-aceite"
          type="checkbox"
          checked={state.aceite}
          onChange={(e) => patch({ aceite: e.target.checked })}
        />
        <span>Li e aceito as condições acima e o Termo de Consentimento.</span>
      </label>
      <Field
        id="onb-assin"
        label="Assinatura - digite seu nome completo"
        value={state.assinatura}
        autoComplete="off"
        placeholder={state.nome}
        onChange={(v) => patch({ assinatura: v })}
        error={
          state.assinatura &&
          state.assinatura.trim().toLowerCase() !== state.nome.trim().toLowerCase()
            ? "A assinatura precisa ser igual ao nome do titular."
            : undefined
        }
      />
    </>
  );
}

export function StepPagamento({ state, patch }: { state: OnboardingState; patch: Patch }) {
  return (
    <>
      <h1>Como você prefere pagar?</h1>
      <p className="onb__lead">
        Nada é cobrado agora. A primeira fatura sai depois da instalação, proporcional aos dias
        usados.
      </p>
      <div className="onb__opts">
        {PAGAMENTOS.map((p) => (
          <button
            key={p.key}
            type="button"
            className="onb__opt"
            aria-pressed={state.pagamento === p.key}
            onClick={() => patch({ pagamento: p.key as FormaPagamento })}
          >
            <span>
              <b>{p.label}</b>
              <span>{p.desc}</span>
            </span>
          </button>
        ))}
      </div>
      <h2 style={{ marginTop: "var(--s8)", fontSize: 18 }}>Melhor dia de vencimento</h2>
      <div className="onb__chips">
        {VENCIMENTOS.map((d) => (
          <button
            key={d}
            type="button"
            className="onb__chip"
            aria-pressed={state.vencimento === d}
            onClick={() => patch({ vencimento: d })}
          >
            dia {d}
          </button>
        ))}
      </div>
    </>
  );
}

export function StepInstalacao({
  state,
  patch,
  minDate,
}: {
  state: OnboardingState;
  patch: Patch;
  minDate: string;
}) {
  return (
    <>
      <h1>Quando podemos instalar?</h1>
      <p className="onb__lead">Você escolhe o dia e o turno. Nada de “aguarde das 8h às 18h”.</p>
      <div className="onb__grid2">
        <Field
          id="onb-data"
          label="Dia"
          type="date"
          value={state.instalacaoData}
          onChange={(v) => patch({ instalacaoData: v })}
        />
        <div className="lp-field">
          <span style={{ display: "block", fontSize: "12.5px", fontWeight: 700, marginBottom: 6 }}>
            Turno
          </span>
          <div className="onb__chips">
            {TURNOS.map((t) => (
              <button
                key={t.key}
                type="button"
                className="onb__chip"
                aria-pressed={state.instalacaoTurno === t.key}
                onClick={() => patch({ instalacaoTurno: t.key as Turno })}
              >
                {t.label} <span style={{ fontWeight: 500, opacity: 0.8 }}>({t.desc})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Field
        id="onb-recebe"
        label="Quem recebe o técnico"
        value={state.recebePor}
        placeholder="Nome de quem estará no local"
        onChange={(v) => patch({ recebePor: v })}
      />
      <p className="onb__micro">
        Precisa ser maior de idade. A data é uma preferência - confirmamos por WhatsApp antes, e
        você pode remarcar. Agenda a partir de {minDate.split("-").reverse().join("/")}.
      </p>
    </>
  );
}

export function StepWifi({ state, patch }: { state: OnboardingState; patch: Patch }) {
  return (
    <>
      <h1>Como vai se chamar seu Wi-Fi?</h1>
      <p className="onb__lead">
        O técnico já chega com a rede configurada assim. Dá pra trocar depois quando quiser.
      </p>
      <Field
        id="onb-wifi-nome"
        label="Nome da rede"
        value={state.wifiNome}
        autoComplete="off"
        placeholder="Ex.: Casa da Ana"
        onChange={(v) => patch({ wifiNome: v })}
      />
      <Field
        id="onb-wifi-senha"
        label="Senha do Wi-Fi"
        value={state.wifiSenha}
        autoComplete="off"
        placeholder="Mínimo de 8 caracteres"
        onChange={(v) => patch({ wifiSenha: v })}
        error={
          state.wifiSenha && state.wifiSenha.length < 8
            ? "A senha precisa ter pelo menos 8 caracteres."
            : undefined
        }
      />
      <p className="onb__micro">
        Evite dados pessoais no nome da rede - o nome fica visível pra quem estiver por perto.
      </p>
    </>
  );
}
