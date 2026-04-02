/**
 * Geração e validação de slug para URL do brechó (ex.: brecho-da-ana).
 */

const RESERVED = new Set([
  "api",
  "login",
  "register",
  "_next",
  "favicon.ico",
  "robots.txt",
]);

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 255) return false;
  if (!SLUG_REGEX.test(slug)) return false;
  if (RESERVED.has(slug)) return false;
  return true;
}
