import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu as MenuIcon, MessageCircle, X } from "lucide-react";

import vbzLogo from "@/assets/vbz-logo.png";
import { CONTACT_WHATSAPP_URL, CONTACT_PHONE_LABEL } from "@/lib/contact";
import { MENUS, CLIENT_AREA_URL, type Menu } from "../landing.config";

function Dropdown({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="vbz-dd-wrap" style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="vbz-menu-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {menu.label} <ChevronDown size={14} />
      </button>
      {open && (
        <div className="vbz-dd">
          {menu.items.map((i) => (
            <a key={i.label} className="vbz-dd-item" href={i.href} onClick={() => setOpen(false)}
              {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="vbz-dd-tt">{i.label}</span>
              <span className="vbz-dd-ds">{i.desc}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const [sheet, setSheet] = useState(false);
  return (
    <header>
      <div className="wrap vbz-nav">
        <a className="vbz-brand" href="#topo" aria-label="VBZ"><img src={vbzLogo} alt="VBZ" height={32} /></a>
        <nav className="vbz-menu" aria-label="Principal">
          {MENUS.map((m) => <Dropdown key={m.label} menu={m} />)}
        </nav>
        <div className="vbz-nav-right">
          <a className="vbz-phone" href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> {CONTACT_PHONE_LABEL}
          </a>
          {CLIENT_AREA_URL && <a className="btn btn-ghost btn-sm" href={CLIENT_AREA_URL}>Entrar</a>}
          <a className="btn btn-cta btn-sm" href="#viabilidade">Consultar viabilidade</a>
          <button type="button" className="vbz-burger" aria-label="Menu" aria-expanded={sheet}
            onClick={() => setSheet((v) => !v)}>{sheet ? <X size={20} /> : <MenuIcon size={20} />}</button>
        </div>
      </div>
      {sheet && (
        <div className="sheet"><div className="sheet-panel">
          {MENUS.map((m) => (
            <div key={m.label} style={{ padding: "10px 0", borderBottom: "1px solid hsl(var(--border))" }}>
              <strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</strong>
              {m.items.map((i) => (
                <a key={i.label} href={i.href} onClick={() => setSheet(false)}
                  style={{ display: "block", padding: "8px 0", fontWeight: 600 }}
                  {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{i.label}</a>
              ))}
            </div>
          ))}
          <a className="btn btn-cta btn-block" style={{ marginTop: 16 }} href="#viabilidade"
            onClick={() => setSheet(false)}>Consultar viabilidade</a>
        </div></div>
      )}
    </header>
  );
}
