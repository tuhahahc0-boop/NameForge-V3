/**
 * Shared search normalization for the generator catalogue.
 * Ignores accents, casing, and common separators so queries such as
 * "baby name", "baby_name", and accented variants behave consistently.
 */
export function normalizeSearchText(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
