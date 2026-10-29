const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])
const PROBE_ORIGIN = 'http://contramargen.invalid'

/**
 * Devuelve el enlace solo si es seguro (http, https, mailto, rutas internas o anclas).
 * Bloquea "javascript:", "data:" y similares para evitar ataques XSS, y también
 * rutas "internas" que el navegador resolvería hacia otro dominio ("/\evil.com").
 */
export function safeHref(raw: string | null | undefined): string | null {
  if (!raw) return null
  const value = raw.trim()
  if (!value) return null

  // Un ancla (#nota) nunca sale de la página actual
  if (value.startsWith('#')) return value

  // Rutas internas: deben resolverse dentro de nuestro propio dominio
  if (value.startsWith('/')) {
    try {
      const resolved = new URL(value, PROBE_ORIGIN)
      if (resolved.origin !== PROBE_ORIGIN) return null
      return resolved.pathname + resolved.search + resolved.hash
    } catch {
      return null
    }
  }

  try {
    const url = new URL(value)
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
}

type LexicalNode = { type?: string; fields?: { url?: string; linkType?: string }; children?: LexicalNode[] }

/** Recorre el texto enriquecido y vacía las URLs de enlaces que no sean seguras. */
export function sanitizeLexicalLinks<T>(state: T): T {
  const walk = (node: LexicalNode) => {
    if ((node.type === 'link' || node.type === 'autolink') && node.fields && node.fields.linkType !== 'internal') {
      node.fields.url = safeHref(node.fields.url) ?? ''
    }
    node.children?.forEach(walk)
  }
  const root = (state as { root?: LexicalNode } | null)?.root
  if (root) walk(root)
  return state
}
