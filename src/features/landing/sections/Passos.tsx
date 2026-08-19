import { PASSOS } from "../landing.content";

export function Passos() {
  return (
    <section className="section" id="passos">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">{PASSOS.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{PASSOS.title}</h2>
          <p className="lead">{PASSOS.lead}</p>
        </div>
        <div className="steps">
          {PASSOS.steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-n">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="time">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
