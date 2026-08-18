import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu as MenuIcon, MessageCircle, X } from "lucide-react";

import vbzLogo from "@/assets/vbz-logo.png";
import { CONTACT_WHATSAPP_URL } from "@/lib/contact";
import { BRAND, CLIENT_AREA_URL, MENUS, PHONE_LABEL, type Menu } from "../landing.config";

function MenuDropdown({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora e no Esc: dropdown que só fecha no segundo clique do próprio
  // gatilho é o defeito clássico desse componente.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="lp-nav__trigger"
        data-open={open}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {menu.label}
        <ChevronDown size={15} className="lp-nav__chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="lp-drop">
          {menu.items.map((item) => (
            <a
              key={item.label}
              className="lp-drop__item"
              href={item.href}
              onClick={() => setOpen(false)}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <b>{item.label}</b>
              <span>{item.desc}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="lp-sheet">
      <div className="lp__wrap">
        {MENUS.map((menu) => (
          <div key={menu.label} className="lp-sheet__group">
            <b>{menu.label}</b>
            {menu.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
        <div style={{ display: "grid", gap: "var(--s3)", paddingTop: "var(--s5)" }}>
          <a className="lp-btn lp-btn--outline lp-btn--block" href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> {PHONE_LABEL}
          </a>
          {CLIENT_AREA_URL && (
            <a className="lp-btn lp-btn--outline lp-btn--block" href={CLIENT_AREA_URL}>Entrar</a>
          )}
          <a className="lp-btn lp-btn--cta lp-btn--block" href="#viabilidade" onClick={onClose}>
            Consultar viabilidade
          </a>
        </div>
      </div>
    </div>
  );
}

export function LandingNav() {
  const [sheet, setSheet] = useState(false);

  return (
    <header className="lp-nav">
      <div className="lp__wrap lp-nav__inner">
        <a className="lp-nav__logo" href="#topo" aria-label={BRAND}>
          <img src={vbzLogo} alt={BRAND} width={140} height={40} />
        </a>

        <nav className="lp-nav__menu" aria-label="Principal">
          {MENUS.map((menu) => (
            <MenuDropdown key={menu.label} menu={menu} />
          ))}
        </nav>

        <div className="lp-nav__right">
          {/* O 0800 é o telefone da marca, mas o clique vai pro WhatsApp: é lá que tem gente. */}
          <a className="lp-nav__phone" href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            <span>
              <small>Fale agora</small>
              {PHONE_LABEL}
            </span>
          </a>
          {CLIENT_AREA_URL && (
            <a className="lp-btn lp-btn--outline" href={CLIENT_AREA_URL}>Entrar</a>
          )}
          <a className="lp-btn lp-btn--cta" href="#viabilidade">Consultar viabilidade</a>
          <button
            type="button"
            className="lp-burger"
            aria-label={sheet ? "Fechar menu" : "Abrir menu"}
            aria-expanded={sheet}
            onClick={() => setSheet((v) => !v)}
          >
            {sheet ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
      {sheet && <MobileSheet onClose={() => setSheet(false)} />}
    </header>
  );
}
