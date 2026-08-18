/** Telefone brasileiro: máscara de digitação, normalização E.164 e validação. */

const MAX_DIGITS = 11;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Máscara progressiva `(DD) 9NNNN-NNNN`. Formata o que já foi digitado sem
 * exigir o número completo — campo com máscara só no blur trava a digitação.
 */
export function maskPhoneBR(value: string): string {
  const d = onlyDigits(value).slice(0, MAX_DIGITS);
  if (d.length <= 2) return d ? `(${d}` : "";
  const ddd = `(${d.slice(0, 2)}) `;
  const rest = d.slice(2);
  // Celular tem 5 dígitos antes do traço, fixo tem 4. Enquanto a pessoa digita
  // ainda não dá pra contar o total, então decide pelo PRIMEIRO dígito: no Brasil
  // celular começa com 9 e fixo começa entre 2 e 5. Decidir pelo comprimento
  // total escreveria "(35) 9984-2" no meio da digitação de um celular.
  const split = rest.startsWith("9") ? 5 : 4;
  if (rest.length <= split) return ddd + rest;
  return `${ddd}${rest.slice(0, split)}-${rest.slice(split)}`;
}

/** `+55` + dígitos. Idempotente: número que já veio com o 55 não ganha outro. */
export function phoneToE164(value: string): string {
  const d = onlyDigits(value);
  const national = d.length > MAX_DIGITS && d.startsWith("55") ? d.slice(2) : d;
  return `+55${national}`;
}

/** Fixo (10) ou celular (11) com DDD válido — DDD brasileiro começa em 11. */
export function isValidPhoneBR(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 10 && d.length !== 11) return false;
  return Number(d.slice(0, 2)) >= 11;
}
