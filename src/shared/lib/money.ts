/**
 * Formatação e parsing de valores monetários em BRL (centavos no backend como decimal).
 */

export function formatBRLInput(centsOrNumber: number): string {
  const n = Math.round(centsOrNumber * 100) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

/** Converte string mascarada "R$ 1.234,56" ou "1234,56" para número. */
export function parseBRLToNumber(raw: string): number {
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(/^R\$\s?/i, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/** Máscara progressiva enquanto o usuário digita (somente dígitos -> BRL). */
export function maskMoneyDigits(digits: string): string {
  const only = digits.replace(/\D/g, "");
  if (!only) return "";
  const value = Number(only) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
