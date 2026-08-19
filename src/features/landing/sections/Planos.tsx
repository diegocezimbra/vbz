import { Check, Tv, Wifi } from "lucide-react";

import { whatsappUrl } from "@/lib/contact";
import { PLANOS_HEAD, PLANS } from "../landing.content";

export function Planos() {
  return (
    <section className="section" id="planos">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">{PLANOS_HEAD.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>
            {PLANOS_HEAD.title} <span className="hl">{PLANOS_HEAD.highlight}</span>
          </h2>
          <p className="lead">{PLANOS_HEAD.lead}</p>
        </div>

        <div className="vbz-planos">
          {PLANS.map((p) => (
            <div className={`vbz-plano${p.badge ? " vbz-plano--destaque" : ""}`} key={p.name}>
              {p.badge && <span className="vbz-plano__badge">{p.badge}</span>}
              <span className="vbz-plano__nome">{p.name}</span>
              <div className="vbz-plano__mega">
                {p.mega}<small>Mega</small>
              </div>
              <div className="vbz-plano__pills">
                <span className="vbz-pill"><Wifi size={13} /> {p.wifi}</span>
                {p.watchTv && <span className="vbz-pill"><Tv size={13} /> Watch TV</span>}
              </div>
              <div className="vbz-plano__preco">
                <span className="vbz-plano__cifra">R$</span>
                <strong>{p.priceInt}</strong>
                <span className="vbz-plano__cents">,{p.priceCents}{p.asterisco ? "*" : ""}</span>
                <span className="vbz-plano__mes">/mês</span>
              </div>
              <p className="vbz-plano__nota">{p.nota}</p>
              <ul className="vbz-plano__feats">
                {p.features.map((f) => (
                  <li key={f}><Check size={15} strokeWidth={3} /> {f}</li>
                ))}
              </ul>
              <a className="btn btn-cta btn-block"
                href={whatsappUrl(`Olá! Quero assinar o ${p.name} (${p.mega} Mega) da VBZ.`)}
                target="_blank" rel="noopener noreferrer">Assine já</a>
              <a className="btn btn-ghost btn-block" style={{ marginTop: 10 }} href="#viabilidade">
                Contratar {p.mega} Mega
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
