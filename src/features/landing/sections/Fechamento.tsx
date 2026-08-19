import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import vbzLogo from "@/assets/vbz-logo.png";
import { CONTACT_PHONE_LABEL, CONTACT_WHATSAPP_URL } from "@/lib/contact";
import { CHAT } from "../landing.config";
import { EXIT, FINAL, FOOTER_COLS, WHATSAPP_VENDAS } from "../landing.content";

export function Final() {
  return (
    <section className="section final">
      <div className="wrap">
        <h2>{FINAL.title}</h2>
        <p className="lead">{FINAL.lead}</p>
        <div className="cta-row" style={{ justifyContent: "center" }}>
          <a className="btn btn-cta btn-lg" href="#viabilidade">{FINAL.ctaPrimary}</a>
          <a className="btn btn-ghost btn-lg" href={WHATSAPP_VENDAS} target="_blank" rel="noopener noreferrer">
            {FINAL.ctaGhost}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-grid">
          <div>
            <div className="f-brand"><img src={vbzLogo} alt="VBZ" height={30} /></div>
            <p style={{ maxWidth: 300, lineHeight: 1.6 }}>
              Fibra óptica que entrega o que promete, com suporte de gente de verdade.
            </p>
            <a className="phone" style={{ marginTop: 18, display: "inline-flex" }}
              href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} /> {CONTACT_PHONE_LABEL}
            </a>
          </div>
          {FOOTER_COLS.map((col) => (
            <div className="f-col" key={col.title}>
              <h4 {...(col.title === "VBZ" ? { translate: "no" } : {})}>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="f-bottom">
          © {new Date().getFullYear()} <span translate="no">VBZ</span> Telecom · vbz.com.br
        </div>
      </div>
    </footer>
  );
}

const EXIT_DELAY_MS = 12_000;

/**
 * Saída de página e chat. O exit-intent só arma depois de alguns segundos e dispara
 * uma vez por sessão: modal que salta no primeiro movimento do mouse afasta mais
 * gente do que recupera.
 */
export function ChatEExit() {
  const [bubble, setBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setBubble(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let armed = false;
    const arm = window.setTimeout(() => { armed = true; }, EXIT_DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (!armed || e.clientY > 0) return;
      if (sessionStorage.getItem("vbz-exit") === "1") return;
      sessionStorage.setItem("vbz-exit", "1");
      setExit(true);
    };
    document.addEventListener("mouseout", onLeave);
    return () => { window.clearTimeout(arm); document.removeEventListener("mouseout", onLeave); };
  }, []);

  return (
    <>
      {exit && (
        <div className="exit" role="dialog" aria-modal="true" aria-labelledby="exit-titulo">
          <div className="exit-card">
            <button type="button" className="exit-close" aria-label="Fechar" onClick={() => setExit(false)}>
              <X size={18} />
            </button>
            <h2 id="exit-titulo">{EXIT.title}</h2>
            <p>{EXIT.body}</p>
            <div className="exit-ctas">
              <a className="btn btn-cta btn-lg" href="#viabilidade" onClick={() => setExit(false)}>{EXIT.ctaPrimary}</a>
              <a className="btn btn-ghost btn-lg" href={WHATSAPP_VENDAS} target="_blank" rel="noopener noreferrer">
                {EXIT.ctaGhost}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="chat" data-show={bubble && !dismissed}>
        {bubble && !dismissed && (
          <div className="chat-panel" style={{ position: "relative" }}>
            <a className="chat-link" href={CHAT.href} target="_blank" rel="noopener noreferrer">
              <strong style={{ display: "block", fontSize: 13.5 }}>{CHAT.title}</strong>
              <span style={{ display: "block", fontSize: 12.5 }}>{CHAT.body}</span>
            </a>
            <button type="button" className="chat-close" aria-label="Fechar" onClick={() => setDismissed(true)}>
              <X size={13} />
            </button>
          </div>
        )}
        <a className="chat-btn" href={CHAT.href} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
          <MessageCircle size={26} />
        </a>
      </div>
    </>
  );
}
