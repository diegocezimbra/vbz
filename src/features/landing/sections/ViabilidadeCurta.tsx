import { useState } from "react";

import { Field } from "../contratacao/Field";
import { submitViability } from "../lead/lead.functions";
import { isValidPhoneBR, maskPhoneBR } from "../lead/phone";
import type { ViabilityForm } from "../lead/payload";

const EMPTY: ViabilityForm = { nome: "", telefone: "", endereco: "", cidade: "" };
type Errors = Partial<Record<keyof ViabilityForm, string>>;

function validate(f: ViabilityForm): Errors {
  const e: Errors = {};
  if (f.nome.trim().length < 3) e.nome = "Informe seu nome completo.";
  if (!isValidPhoneBR(f.telefone)) e.telefone = "Informe um telefone com DDD.";
  if (f.endereco.trim().length < 5) e.endereco = "Informe rua e número.";
  if (f.cidade.trim().length < 2) e.cidade = "Informe a cidade.";
  return e;
}

/**
 * Porta de entrada curta — os quatro campos clássicos de viabilidade.
 *
 * Existe porque pedir CEP de cara custa caro: muita gente não sabe o próprio CEP de
 * cabeça e sai da página pra procurar. Aqui o lead é registrado com o que a pessoa
 * tem na ponta da língua, e só DEPOIS ela entra no fluxo completo de contratação —
 * já convertida em lead, mesmo que desista no meio do caminho.
 */
export function ViabilidadeCurta({ onContinuar }: { onContinuar: (form: ViabilityForm) => void }) {
  const [form, setForm] = useState<ViabilityForm>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const update = (k: keyof ViabilityForm, v: string) => {
    setForm((f) => ({ ...f, [k]: k === "telefone" ? maskPhoneBR(v) : v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    try {
      await submitViability({
        data: { ...form, landing: typeof window === "undefined" ? undefined : window.location.href },
      });
    } catch (error) {
      // Falha do CRM não pode custar a venda — segue pro fluxo e o erro fica no log.
      console.error("[viabilidade] envio falhou:", error);
    } finally {
      setSending(false);
      onContinuar(form);
    }
  };

  return (
    <form className="lp-form" onSubmit={onSubmit} noValidate>
      <h3>Cadastre-se e receba a melhor oferta da sua região</h3>
      <p className="lp-form__hint">Sem compromisso. Não pedimos documento nem cartão.</p>
      <Field id="vc-nome" label="Nome" value={form.nome} autoComplete="name"
        placeholder="Seu nome completo" onChange={(v) => update("nome", v)} error={errors.nome} />
      <Field id="vc-tel" label="Telefone" value={form.telefone} inputMode="tel" autoComplete="tel"
        placeholder="(35) 99999-9999" onChange={(v) => update("telefone", v)} error={errors.telefone} />
      <Field id="vc-end" label="Endereço" value={form.endereco} autoComplete="street-address"
        placeholder="Rua, número, complemento" onChange={(v) => update("endereco", v)} error={errors.endereco} />
      <Field id="vc-cid" label="Cidade" value={form.cidade} autoComplete="address-level2"
        placeholder="Sua cidade" onChange={(v) => update("cidade", v)} error={errors.cidade} />
      <button type="submit" className="lp-btn lp-btn--cta lp-btn--lg lp-btn--block" disabled={sending}>
        {sending ? "Enviando…" : "Solicitar viabilidade"}
      </button>
      <p className="lp-form__legal">
        Ao enviar, você autoriza a VBZ a entrar em contato sobre a disponibilidade no seu endereço.
        Veja o <a href="/termo-consentimento" style={{ textDecoration: "underline" }}>Termo de Consentimento</a>.
      </p>
    </form>
  );
}
