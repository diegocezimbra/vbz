import { useState } from "react";
import { Check } from "lucide-react";

import { whatsappUrl } from "@/lib/contact";
import { GARANTIA, PLANS, type PlanKind } from "../landing.content";

const TABS: { key: PlanKind; label: string }[] = [
  { key: "casa", label: "Planos residenciais" },
  { key: "empresa", label: "Planos empresariais" },
];

export function Planos() {
  const [kind, setKind] = useState<PlanKind>("casa");
  const planos = PLANS.filter((p) => p.kind === kind);

  return (
    <>
      <section className="section" id="planos">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Nossos planos</span>
            <h2 style={{ marginTop: 18 }}>Escolha a velocidade, a gente cuida do resto</h2>
            <p className="lead">Equipamento, instalação e suporte inclusos em todos eles.</p>
          </div>

          <div className="cta-row" style={{ justifyContent: "center", marginBottom: 32 }}>
            {TABS.map((t) => (
              <button key={t.key} type="button" onClick={() => setKind(t.key)}
                className={`btn btn-sm ${kind === t.key ? "btn-cta" : "btn-ghost"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid g3">
            {planos.map((p) => (
              <div className={`card price-card${p.featured ? " new" : ""}`} key={p.name}>
                <span className="eyebrow">{p.name}</span>
                <p className="price-big" style={{ marginTop: 12 }}>
                  {p.speed}
                  <small style={{ display: "block", marginTop: 8 }}>{p.price} <span className="m">{p.priceNote}</span></small>
                </p>
                <ul className="price-list">
                  {p.features.map((f) => (
                    <li key={f}><Check className="yes" size={18} strokeWidth={3} /> {f}</li>
                  ))}
                </ul>
                <a className={`btn btn-block ${p.featured ? "btn-cta" : "btn-ghost"}`}
                  href={whatsappUrl(`Olá! Tenho interesse no plano ${p.name} (${p.speed}) da VBZ.`)}
                  target="_blank" rel="noopener noreferrer">{p.cta}</a>
                <p className="cta-note" style={{ marginTop: 12, fontSize: 12 }}>Mediante viabilidade técnica no endereço</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="garantia" style={{ background: "hsl(var(--muted) / .55)" }}>
        <div className="wrap section-head center">
          <span className="eyebrow">{GARANTIA.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{GARANTIA.title}</h2>
          <p className="lead">{GARANTIA.lead}</p>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: 24 }}>
            <a className="btn btn-cta btn-lg" href="#viabilidade">{GARANTIA.cta}</a>
          </div>
        </div>
      </section>
    </>
  );
}
