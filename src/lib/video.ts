export type VideoEmbed = {
  provider: 'youtube' | 'vimeo'
  id: string
  embedUrl: string
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/
const VIMEO_ID = /^\d{6,12}$/

/**
 * Recibe un enlace de YouTube o Vimeo y devuelve la URL segura para incrustarlo.
 * Devuelve null si el enlace no es de un proveedor permitido.
 */
export function parseVideoUrl(raw: string | null | undefined): VideoEmbed | null {
  if (!raw) return null

  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

  const host = url.hostname.replace(/^www\.|^m\./, '')

  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let id: string | null = null
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)
      if (match) id = match[1]
    }
    if (id && YOUTUBE_ID.test(id)) {
      return { provider: 'youtube', id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}` }
    }
    return null
  }

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    if (YOUTUBE_ID.test(id)) {
      return { provider: 'youtube', id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}` }
    }
    return null
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean).find((part) => VIMEO_ID.test(part))
    if (id) return { provider: 'vimeo', id, embedUrl: `https://player.vimeo.com/video/${id}` }
    return null
  }

  return null
}
