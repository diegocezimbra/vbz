import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { CHAT } from "../landing.config";

const APPEAR_AFTER_MS = 4000;

/**
 * Balão de atendimento. Aparece depois de alguns segundos (não na hora — bloquear a
 * primeira leitura afasta mais do que converte) e leva pro WhatsApp, que é onde tem
 * gente atendendo. Dispensável no X, e o botão redondo continua na tela.
 */
export function ChatBubble() {
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowBubble(true), APPEAR_AFTER_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="lp-chat">
      {showBubble && !dismissed && (
        <div style={{ position: "relative" }}>
          <a className="lp-chat__bubble" href={CHAT.href} target="_blank" rel="noopener noreferrer">
            <b>{CHAT.title}</b>
            <span>{CHAT.body}</span>
          </a>
          <button
            type="button"
            className="lp-chat__close"
            aria-label="Fechar mensagem"
            onClick={() => setDismissed(true)}
          >
            <X size={13} />
          </button>
        </div>
      )}
      <a
        className="lp-chat__fab"
        href={CHAT.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        onClick={() => setDismissed(true)}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
