/** Máscaras e validação de CEP e CPF. Regra do projeto: campo de documento tem máscara. */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskCEP(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function isValidCEP(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export function maskCPF(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean);
  const head = parts.join(".");
  return d.length > 9 ? `${head}-${d.slice(9)}` : head;
}

/**
 * Validação real do CPF pelos dois dígitos verificadores (módulo 11). Checar só o
 * tamanho deixa passar "000.000.000-00" e joga o erro pra consulta de crédito, que
 * é cara - e devolve uma mensagem que ninguém entende.
 */
export function isValidCPF(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  const digit = (upTo: number): number => {
    let sum = 0;
    for (let i = 0; i < upTo; i += 1) sum += Number(d[i]) * (upTo + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}
