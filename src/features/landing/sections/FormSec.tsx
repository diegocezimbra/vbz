import { useState } from "react";
import { Check } from "lucide-react";

import { Contratacao } from "../contratacao/Contratacao";
import type { ViabilityForm } from "../lead/payload";
import { FORMULARIO } from "../landing.content";
import { ViabilidadeCurta } from "./ViabilidadeCurta";

/**
 * Dor + captura lado a lado. O formulário curto registra o lead com o que a pessoa
 * sabe de cabeça; o fluxo completo (CEP, crédito, contrato) só aparece depois, já
 * preenchido — quem desistir no meio já virou contato pro time retomar.
 */
export function FormSec() {
  const [dados, setDados] = useState<ViabilityForm | null>(null);

  return (
    <section className="section form-sec" id="viabilidade">
      <div className="wrap form-grid">
        <div>
          <span className="eyebrow">{FORMULARIO.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{FORMULARIO.title} <span className="hl">{FORMULARIO.highlight}</span></h2>
          <p className="lead" style={{ marginTop: 16 }}>{FORMULARIO.lead}</p>
          <ul className="check-list">
            {FORMULARIO.checks.map((c) => (
              <li key={c}><Check size={20} strokeWidth={3} /> {c}</li>
            ))}
          </ul>
        </div>
        {dados ? (
          <Contratacao inicial={{ nome: dados.nome, telefone: dados.telefone, cidade: dados.cidade }} />
        ) : (
          <ViabilidadeCurta onContinuar={setDados} />
        )}
      </div>
    </section>
  );
}
