import { parseVideoUrl } from '@/lib/video'

/** Incrusta un video de YouTube o Vimeo con carga diferida. */
export function VideoEmbed({ url, title }: { url: string | null | undefined; title: string }) {
  const video = parseVideoUrl(url)
  if (!video) return null

  return (
    <figure className="my-12">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        <iframe
          src={video.embedUrl}
          title={`Video: ${title}`}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="kicker mt-3 text-muted">
        Video · {video.provider === 'youtube' ? 'YouTube' : 'Vimeo'}
      </figcaption>
    </figure>
  )
}
