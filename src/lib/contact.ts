/** Contato único da VBZ - telefone e WhatsApp compartilham o mesmo número. */
export const CONTACT_PHONE_LABEL = "0800 987 9009";
export const CONTACT_PHONE_TEL = "tel:08009879009";
/** E.164 do 0800 brasileiro: +55 800 987 9009 (o "0" é prefixo de tronco nacional). */
const CONTACT_WHATSAPP_E164 = "558009879009";

/** Link de conversa no WhatsApp, com mensagem opcional já preenchida. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT_WHATSAPP_E164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const CONTACT_WHATSAPP_URL = whatsappUrl();
