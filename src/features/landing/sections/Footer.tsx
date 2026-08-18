import { MessageCircle } from "lucide-react";

import vbzLogo from "@/assets/vbz-logo.png";
import { CONTACT_PHONE_TEL, CONTACT_WHATSAPP_URL } from "@/lib/contact";
import { BRAND, NO_TRANSLATE, PHONE_LABEL } from "../landing.config";
import { FOOTER_COLS } from "../landing.content";

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp__wrap">
        <div className="lp-footer__grid">
          <div className="lp-footer__brand">
            <img src={vbzLogo} alt={BRAND} width={140} height={40} />
            <p>
              Fibra óptica que entrega o que promete, com suporte de gente de verdade.
            </p>
            <a
              className="lp-btn lp-btn--onground"
              style={{ marginTop: "var(--s4)" }}
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} /> {PHONE_LABEL}
            </a>
          </div>

          {FOOTER_COLS.map((col) => (
            <div className="lp-footer__col" key={col.title}>
              <h4 {...(col.title === BRAND ? NO_TRANSLATE : {})}>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-footer__bottom">
          <span>
            © {new Date().getFullYear()} <span {...NO_TRANSLATE}>{BRAND}</span> Telecom · vbz.com.br
          </span>
          <a href={CONTACT_PHONE_TEL}>{PHONE_LABEL}</a>
        </div>
      </div>
    </footer>
  );
}
