import { useState } from "react";

import { whatsappUrl } from "@/lib/contact";
import { PLANS, type PlanKind } from "../landing.content";

const TABS: { key: PlanKind; label: string }[] = [
  { key: "casa", label: "Pra sua casa" },
  { key: "empresa", label: "Pra sua empresa" },
];

export function Plans() {
  const [kind, setKind] = useState<PlanKind>("casa");
  const plans = PLANS.filter((p) => p.kind === kind);

  return (
    <section className="lp-sec" id="planos">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">Planos</span>
        <h2>Escolha a velocidade, o resto a gente resolve</h2>
        <p className="lp-sec__sub">
          Equipamento incluso, instalação com hora marcada e suporte no WhatsApp em todos os planos.
        </p>

        <div className="lp-switch" role="group" aria-label="Tipo de plano">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={kind === tab.key}
              onClick={() => setKind(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lp-plans">
          {plans.map((plan) => (
            <div className={`lp-plan${plan.featured ? " lp-plan--featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="lp-plan__badge">Mais escolhido</span>}
              <span className="lp-plan__name">{plan.name}</span>
              <div className="lp-plan__speed">{plan.speed}</div>
              <div className="lp-plan__price">
                <span className="lp-plan__value">{plan.price}</span>
                <span className="lp-plan__period">{plan.priceNote}</span>
              </div>
              <ul className="lp-plan__features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                className={`lp-btn lp-btn--block ${plan.featured ? "lp-btn--cta" : "lp-btn--outline"}`}
                href={whatsappUrl(`Olá! Tenho interesse no plano ${plan.name} (${plan.speed}) da VBZ.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
