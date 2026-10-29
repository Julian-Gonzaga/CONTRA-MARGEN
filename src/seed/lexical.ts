// Ayudantes para escribir texto enriquecido (formato Lexical) desde código.
// Uso: p('texto'), h2('título'), quote('cita'), y *cursiva* dentro del texto.

type TextNode = {
  type: 'text'
  text: string
  format: number
  detail: 0
  mode: 'normal'
  style: ''
  version: 1
}

const ITALIC = 2

/** Convierte "una *obra* clave" en nodos de texto con cursiva. */
function inline(text: string): TextNode[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => {
      const italic = part.startsWith('*') && part.endsWith('*')
      return {
        type: 'text',
        text: italic ? part.slice(1, -1) : part,
        format: italic ? ITALIC : 0,
        detail: 0,
        mode: 'normal',
        style: '',
        version: 1,
      }
    })
}

const block = (type: string, text: string, extra: Record<string, unknown> = {}) => ({
  type,
  children: inline(text),
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
  ...extra,
})

export const p = (text: string) => block('paragraph', text, { textFormat: 0, textStyle: '' })
export const h2 = (text: string) => block('heading', text, { tag: 'h2' })
export const quote = (text: string) => block('quote', text)

export function doc(...children: ReturnType<typeof block>[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
