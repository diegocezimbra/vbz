import { Activity, Gauge, Headphones, ShieldCheck, Wifi, Wrench } from "lucide-react";

import { PARA_QUEM, RECURSOS } from "../landing.content";

const ICONS = [Gauge, Wifi, Headphones, Activity, ShieldCheck, Wrench];

export function Recursos() {
  return (
    <>
      <section className="section" id="funcionalidades" style={{ background: "hsl(var(--muted) / .55)" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">{RECURSOS.eyebrow}</span>
            <h2 style={{ marginTop: 18 }}>{RECURSOS.title}</h2>
          </div>
          <div className="grid g3">
            {RECURSOS.cards.map((c, i) => {
              const Icon = ICONS[i] ?? Gauge;
              return (
                <div className="card" key={c.t}>
                  <div className="ico ico-ok"><Icon size={22} /></div>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="para-quem">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">{PARA_QUEM.eyebrow}</span>
            <h2 style={{ marginTop: 18 }}>{PARA_QUEM.title}</h2>
          </div>
          <div className="grid g3">
            {PARA_QUEM.cards.map((c) => (
              <div className="card" key={c.t}>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
