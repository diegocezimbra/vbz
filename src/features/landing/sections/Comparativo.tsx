import { COMPARATIVO } from "../landing.content";

export function Comparativo() {
  return (
    <section className="section" id="comparativo">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">{COMPARATIVO.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{COMPARATIVO.title}</h2>
          <p className="lead">{COMPARATIVO.lead}</p>
        </div>
        <div className="cmp">
          <div className="cmp-pair">
            <div className="cmp-cell cmp-cap bad">
              <span className="cmp-kicker">Hoje</span>
              <span className="cmp-title">{COMPARATIVO.staleTitle}</span>
            </div>
            <div className="cmp-cell cmp-cap good">
              <span className="cmp-kicker">Depois da troca</span>
              <span className="cmp-title">{COMPARATIVO.oursTitle}</span>
            </div>
          </div>
          {COMPARATIVO.pairs.map((p) => (
            <div className="cmp-pair" key={p.pain.t}>
              <div className="cmp-cell bad">
                <span className="cmp-ico" aria-hidden="true">✕</span>
                <span><b>{p.pain.t}</b><span className="cmp-desc">{p.pain.d}</span></span>
              </div>
              <div className="cmp-cell good">
                <span className="cmp-ico" aria-hidden="true">✓</span>
                <span><b>{p.ours.t}</b><span className="cmp-desc">{p.ours.d}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
