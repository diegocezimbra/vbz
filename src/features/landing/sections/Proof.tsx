import { QUOTES } from "../landing.content";

export function Proof() {
  return (
    <section className="lp-sec" id="depoimentos">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">Quem já trocou</span>
        <h2>Trocou uma vez e parou de procurar</h2>
        <p className="lp-sec__sub">
          O que a gente mais ouve depois da instalação é sobre duas coisas: a velocidade que
          bate com o contrato e o suporte que responde.
        </p>
        <div className="lp-grid">
          {QUOTES.map((quote) => (
            <blockquote className="lp-quote" key={quote.who + quote.meta}>
              <p>“{quote.text}”</p>
              <footer>
                <span className="lp-quote__av" aria-hidden="true">{quote.initials}</span>
                <span className="lp-quote__who">
                  <b>{quote.who}</b>
                  <span>{quote.meta}</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
