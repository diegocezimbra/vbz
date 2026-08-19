import { DEPOIMENTOS, FAQS } from "../landing.content";

export function Confianca() {
  return (
    <>
      <section className="section" id="confianca" style={{ background: "hsl(var(--muted) / .55)" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Depoimentos</span>
            <h2 style={{ marginTop: 18 }}>O que quem já trocou fala da gente</h2>
          </div>
          <div className="grid g3">
            {DEPOIMENTOS.map((d) => (
              <div className="card" key={d.quem + d.meta}>
                <p className="q">“{d.texto}”</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <span className="ico ico-ok" style={{ width: 38, height: 38, fontWeight: 900 }}>{d.iniciais}</span>
                  <span>
                    <b style={{ display: "block", fontSize: 14 }}>{d.quem}</b>
                    <span className="m" style={{ fontSize: 12.5 }}>{d.meta}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq" style={{ background: "hsl(var(--muted) / .3)" }}>
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2 style={{ marginTop: 18 }}>As perguntas que mais chegam pra gente</h2>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
