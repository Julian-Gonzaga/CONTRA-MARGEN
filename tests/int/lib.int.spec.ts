import { describe, expect, it } from 'vitest'

import { formatDate } from '@/lib/format'
import { safeHref, sanitizeLexicalLinks } from '@/lib/safeHref'
import { slugify } from '@/lib/slugify'
import { parseVideoUrl } from '@/lib/video'

describe('slugify', () => {
  it('quita tildes y convierte ñ', () => {
    expect(slugify('Año de la Señora Ñúñez')).toBe('ano-de-la-senora-nunez')
  })

  it('elimina signos y emojis', () => {
    expect(slugify('¿Quién merece el Cervantes? 📚✨')).toBe('quien-merece-el-cervantes')
  })

  it('devuelve vacío si no queda texto útil', () => {
    expect(slugify('🎉🎉🎉')).toBe('')
    expect(slugify('   ')).toBe('')
  })

  it('recorta títulos muy largos sin dejar guion al final', () => {
    const slug = slugify('palabra '.repeat(40))
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith('-')).toBe(false)
  })
})

describe('parseVideoUrl', () => {
  it('acepta YouTube en sus distintos formatos', () => {
    const id = 'dQw4w9WgXcQ'
    for (const url of [
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtu.be/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://m.youtube.com/watch?v=${id}&t=10`,
      `https://www.youtube.com/shorts/${id}`,
    ]) {
      expect(parseVideoUrl(url)?.embedUrl).toBe(`https://www.youtube-nocookie.com/embed/${id}`)
    }
  })

  it('acepta Vimeo', () => {
    expect(parseVideoUrl('https://vimeo.com/76979871')?.embedUrl).toBe(
      'https://player.vimeo.com/video/76979871',
    )
  })

  it('rechaza otros dominios y URLs maliciosas', () => {
    expect(parseVideoUrl('https://evil.com/watch?v=dQw4w9WgXcQ')).toBeNull()
    expect(parseVideoUrl('javascript:alert(1)')).toBeNull()
    expect(parseVideoUrl('https://www.youtube.com/watch?v="><script>')).toBeNull()
    expect(parseVideoUrl('no es una url')).toBeNull()
    expect(parseVideoUrl('')).toBeNull()
    expect(parseVideoUrl(null)).toBeNull()
  })
})

describe('safeHref', () => {
  it('permite http, https, mailto y rutas internas', () => {
    expect(safeHref('https://example.com/a')).toBe('https://example.com/a')
    expect(safeHref('mailto:hola@example.com')).toBe('mailto:hola@example.com')
    expect(safeHref('/articulos/x')).toBe('/articulos/x')
    expect(safeHref('#nota')).toBe('#nota')
  })

  it('bloquea javascript:, data: y URLs relativas a protocolo', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull()
    expect(safeHref('  JavaScript:alert(1)')).toBeNull()
    expect(safeHref('data:text/html,<script>alert(1)</script>')).toBeNull()
    expect(safeHref('//evil.com')).toBeNull()
    expect(safeHref('')).toBeNull()
  })

  it('bloquea rutas "internas" que el navegador resuelve a otro dominio', () => {
    expect(safeHref('/\\evil.example.com')).toBeNull()
    expect(safeHref('/\t/evil.example.com')).toBeNull()
    expect(safeHref('/articulos/ida-vitale?x=1#nota')).toBe('/articulos/ida-vitale?x=1#nota')
  })
})

describe('sanitizeLexicalLinks', () => {
  it('vacía las URLs peligrosas y respeta las seguras e internas', () => {
    const link = (url: string, linkType = 'custom') => ({ type: 'link', fields: { url, linkType }, children: [] })
    const state = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              link('javascript:alert(1)'),
              { type: 'autolink', fields: { url: 'data:text/html,x' }, children: [] },
              link('https://example.com'),
              link('', 'internal'),
            ],
          },
        ],
      },
    }
    const urls = sanitizeLexicalLinks(state).root.children[0].children.map((n) => n.fields.url)
    expect(urls).toEqual(['', '', 'https://example.com/', ''])
  })

  it('tolera valores vacíos', () => {
    expect(sanitizeLexicalLinks(null)).toBeNull()
  })
})

describe('formatDate', () => {
  it('formatea en español', () => {
    expect(formatDate('2025-04-23T10:00:00.000Z')).toBe('23 de abril de 2025')
  })

  it('tolera valores vacíos o inválidos', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('no-fecha')).toBe('')
  })
})
