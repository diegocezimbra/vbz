import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Check, MessageCircle } from "lucide-react";

import { SLIDES } from "../landing.config";
import { HERO, TRUSTBAR, WHATSAPP_VENDAS } from "../landing.content";
import { SlideArt } from "./SlideArt";

const AUTOPLAY_MS = 7000;

export function Hero() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect(); embla.on("select", onSelect);
    return () => { embla.off("select", onSelect); };
  }, [embla]);

  // Autoplay para quando o ponteiro ou o foco entra: carrossel que troca de slide
  // enquanto a pessoa lê é o motivo pelo qual carrossel tem má fama.
  useEffect(() => {
    if (!embla || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [embla, paused]);

  const goTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <>
      <section className="hero" id="topo">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">{HERO.eyebrow}</span>
            <h1 style={{ marginTop: 20 }}>{HERO.title} <span className="hl">{HERO.highlight}</span>.</h1>
            <p className="lead">{HERO.lead}</p>
            <div className="cta-row">
              <a className="btn btn-cta btn-lg" href="#viabilidade">{HERO.ctaPrimary}</a>
              <a className="btn btn-ghost btn-lg" href="#passos">{HERO.ctaGhost}</a>
            </div>
            <div className="cta-note">
              {HERO.ticks.map((t) => (
                <span key={t}><Check size={16} strokeWidth={3} /> {t}</span>
              ))}
            </div>
          </div>

          <div className="slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
            <div className="slide-view" ref={emblaRef} style={{ overflow: "hidden" }}>
              <div style={{ display: "flex" }}>
                {SLIDES.map((s) => (
                  <div key={s.tag} style={{ flex: "0 0 100%", minWidth: 0 }}>
                    <article className="slide">
                      <div className="slide-art"><SlideArt art={s.art} /></div>
                      <div className="slide-body">
                        <span className="slide-tag">{s.tag}</span>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
            <div className="dots">
              {SLIDES.map((s, i) => (
                <button key={s.tag} type="button" aria-label={s.tag} aria-current={selected === i}
                  onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trustbar" aria-label="O que a VBZ garante">
        <div className="wrap">
          <ul>
            {TRUSTBAR.map((t) => <li key={t}><Check size={17} strokeWidth={2.4} /> {t}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}

export { WHATSAPP_VENDAS, MessageCircle };
