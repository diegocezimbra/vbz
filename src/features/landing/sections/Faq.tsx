import { FAQS } from "../landing.content";

export function Faq() {
  return (
    <section className="lp-sec lp-sec--alt" id="faq">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">FAQ</span>
        <h2>Dúvidas frequentes</h2>
        <p className="lp-sec__sub">As perguntas que mais chegam pra gente, reunidas num lugar só.</p>
        <div className="lp-faq">
          {FAQS.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
