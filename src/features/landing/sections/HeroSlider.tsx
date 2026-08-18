import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MessageCircle } from "lucide-react";

import { SLIDES, STATS, WHATSAPP_HERO } from "../landing.config";
import { SlideArt } from "./SlideArt";

const AUTOPLAY_MS = 7000;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroSlider() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  // Autoplay que respeita `prefers-reduced-motion` e para quando o ponteiro está em
  // cima ou o foco está dentro: carrossel que troca de slide enquanto a pessoa lê é
  // o motivo pelo qual carrossel tem má fama.
  useEffect(() => {
    if (!embla || paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [embla, paused]);

  const goTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <>
      <section className="lp-hero" id="topo">
        <div className="lp__wrap lp-hero__top">
          <span className="lp-eyebrow">
            <span className="lp-eyebrow__dot" aria-hidden="true" />
            Fibra óptica no sul de Minas
          </span>
          <h1>
            Esta vai ser a <em>última vez</em> que você vai procurar por um serviço de Internet.
          </h1>
          <p className="lp-hero__lead">
            Fibra que entrega a velocidade contratada, Wi-Fi que cobre a casa inteira e suporte
            com gente de verdade no WhatsApp. Você troca uma vez — e para de trocar.
          </p>
          <div className="lp-hero__ctas">
            <a className="lp-btn lp-btn--cta lp-btn--lg" href="#viabilidade">
              Consultar viabilidade grátis
            </a>
            <a className="lp-btn lp-btn--onground lp-btn--lg" href={WHATSAPP_HERO} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} /> Falar no WhatsApp
            </a>
          </div>
          <p className="lp-hero__micro">
            Leva menos de 1 minuto · Sem compromisso · Não pedimos documento nem cartão
          </p>
        </div>

        <div
          className="lp__wrap lp-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div ref={emblaRef} style={{ overflow: "hidden" }}>
            <div style={{ display: "flex" }}>
              {SLIDES.map((slide) => (
                <div key={slide.tag} style={{ flex: "0 0 100%", minWidth: 0, paddingRight: 16 }}>
                  <article className="lp-slide">
                    <div>
                      <span className="lp-slide__tag">{slide.tag}</span>
                      <h3>{slide.title}</h3>
                      <p>{slide.desc}</p>
                      <ul className="lp-slide__list">
                        {slide.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="lp-slide__art">
                      <SlideArt art={slide.art} />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-dots" role="tablist" aria-label="Funcionalidades">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.tag}
                type="button"
                role="tab"
                className="lp-dot"
                aria-current={selected === i}
                aria-label={slide.tag}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Números">
        <div className="lp__wrap">
          <div className="lp-stats__grid">
            {STATS.map((s) => (
              <div key={s.label} className="lp-stat">
                <div className="lp-stat__num">{s.num}</div>
                <div className="lp-stat__label">{s.label}</div>
                {s.note && <div className="lp-stat__note">{s.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
