import { CMP_OURS_TITLE, CMP_STALE_TITLE, COMPARISON } from "../landing.content";

export function Comparison() {
  return (
    <section className="lp-sec" id="comparativo">
      <div className="lp__wrap">
        <span className="lp-sec__eyebrow">Comparativo</span>
        <h2>A diferença aparece no dia a dia</h2>
        <p className="lp-sec__sub">
          Cada linha da esquerda é uma reclamação que a gente ouve de quem chega. À direita,
          o que a VBZ faz diferente — e por quê.
        </p>

        <div className="lp-cmp">
          <div className="lp-cmp__pair">
            <div className="lp-cmp__cell lp-cmp__cell--stale lp-cmp__cap">
              <span className="lp-cmp__kicker">Hoje</span>
              <span className="lp-cmp__title">{CMP_STALE_TITLE}</span>
            </div>
            <div className="lp-cmp__cell lp-cmp__cell--ours lp-cmp__cap">
              <span className="lp-cmp__kicker">Depois da troca</span>
              <span className="lp-cmp__title">{CMP_OURS_TITLE}</span>
            </div>
          </div>

          {COMPARISON.map((pair) => (
            <div className="lp-cmp__pair" key={pair.pain.title}>
              <div className="lp-cmp__cell lp-cmp__cell--stale">
                <span className="lp-cmp__ico" aria-hidden="true">✕</span>
                <span>
                  <b>{pair.pain.title}</b>
                  <span className="lp-cmp__desc">{pair.pain.desc}</span>
                </span>
              </div>
              <div className="lp-cmp__cell lp-cmp__cell--ours">
                <span className="lp-cmp__ico" aria-hidden="true">✓</span>
                <span>
                  <b>{pair.ours.title}</b>
                  <span className="lp-cmp__desc">{pair.ours.desc}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
