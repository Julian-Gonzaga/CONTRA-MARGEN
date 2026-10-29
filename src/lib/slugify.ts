/**
 * Convierte un texto en un "slug" apto para URL.
 * "Ida Vitale: la precisión" -> "ida-vitale-la-precision"
 * Quita tildes, convierte ñ en n, elimina emojis y símbolos.
 */
export function slugify(input: string, maxLength = 80): string {
  const slug = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tildes y diéresis
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // todo lo demás (espacios, emojis, signos) -> guion
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')

  return slug
}
