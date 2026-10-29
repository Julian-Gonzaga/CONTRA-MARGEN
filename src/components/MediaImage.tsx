import Image from 'next/image'

import type { Media } from '@/payload-types'

type Props = {
  media: Media | null
  sizes: string
  priority?: boolean
  className?: string
}

/** Payload devuelve URLs absolutas (http://host/api/media/...); next/image necesita la ruta. */
export function mediaPath(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname + parsed.search
  } catch {
    return url // ya es una ruta relativa
  }
}

/** Imagen de la biblioteca de Payload optimizada con next/image. */
export function MediaImage({ media, sizes, priority, className }: Props) {
  if (!media?.url || !media.width || !media.height) return null

  return (
    <Image
      src={mediaPath(media.url)}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}

/** Recuadro de reemplazo cuando un artículo no tiene imagen. */
export function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-ink ${className}`}
    >
      <div className="absolute inset-y-0 left-[18%] w-3 bg-rojo" />
      <div className="absolute inset-x-0 bottom-[22%] h-3 bg-naranja" />
      <span className="absolute bottom-3 right-4 font-display text-4xl italic text-paper/80">CM</span>
    </div>
  )
}
