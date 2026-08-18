import { MessageCircle } from "lucide-react";

import { PHONE_LABEL, WHATSAPP_SALES } from "../landing.config";

export function FinalCta() {
  return (
    <section className="lp-sec">
      <div className="lp__wrap">
        <div className="lp-ctabox">
          <h3>Esta é a hora de trocar pela última vez</h3>
          <p>
            Manda o endereço, a gente confere a viabilidade e te responde. Se não der pra
            atender aí ainda, a gente fala — e avisa quando chegar.
          </p>
          <div className="lp-ctabox__ctas">
            <a className="lp-btn lp-btn--cta lp-btn--lg" href="#viabilidade">Consultar viabilidade</a>
            <a className="lp-btn lp-btn--onground lp-btn--lg" href={WHATSAPP_SALES} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} /> {PHONE_LABEL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
