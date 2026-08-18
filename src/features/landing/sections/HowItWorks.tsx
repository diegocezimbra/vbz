import { STEPS } from "../landing.content";

export function HowItWorks() {
  return (
    <section className="lp-sec lp-sec--alt" id="como">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">Como funciona</span>
        <h2>Do endereço ao Wi-Fi ligado, em três passos</h2>
        <p className="lp-sec__sub">Sem burocracia e sem “aguarde o período de 8 às 18”.</p>
        <div className="lp-grid lp-grid--3">
          {STEPS.map((step) => (
            <div className="lp-feat" key={step.num}>
              <span className="lp-step__num">{step.num}</span>
              <h3 style={{ marginTop: "var(--s2)" }}>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
