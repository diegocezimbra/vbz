import { AlertTriangle } from "lucide-react";

import { DOR } from "../landing.content";

/** Seção de dor: nomeia o problema que a pessoa já vive e o que ele custa a ela. */
export function Dor() {
  return (
    <section className="section dark-sec" id="dor">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">{DOR.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{DOR.title}</h2>
          <p className="lead">{DOR.lead}</p>
        </div>
        <div className="grid g4">
          {DOR.cards.map((c) => (
            <div className="card" key={c.t}>
              <div className="ico ico-pain"><AlertTriangle size={22} /></div>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
              <span className="cost">{c.cost}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
