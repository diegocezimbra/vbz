/** Contato único da VBZ - telefone e WhatsApp compartilham o mesmo número. */
export const CONTACT_PHONE_LABEL = "11 5126 0852";
export const CONTACT_PHONE_TEL = "tel:1151260852";
/** E.164 brasileiro: +55 11 5126 0852. */
const CONTACT_WHATSAPP_E164 = "551151260852";

/** Link de conversa no WhatsApp, com mensagem opcional já preenchida. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT_WHATSAPP_E164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const CONTACT_WHATSAPP_URL = whatsappUrl();
