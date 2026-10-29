import Link from 'next/link'

import { formatDate } from '@/lib/format'
import { asDoc, type Article } from '@/lib/payload'
import type { Author, Media, Section } from '@/payload-types'

import { ImagePlaceholder, MediaImage } from './MediaImage'

type Props = {
  article: Article
  variant?: 'lead' | 'standard'
}

export function ArticleCard({ article, variant = 'standard' }: Props) {
  const section = asDoc<Section>(article.section)
  const author = asDoc<Author>(article.author)
  const image = asDoc<Media>(article.heroImage)
  const href = `/articulos/${article.slug}`

  if (variant === 'lead') {
    return (
      <article className="grid grid-cols-1 gap-8 bg-ink text-paper md:grid-cols-[1.15fr_1fr]">
        <Link href={href} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
          {image ? (
            <MediaImage
              media={image}
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder className="aspect-[4/3] h-full w-full" />
          )}
        </Link>
        <div className="flex flex-col justify-center px-6 pb-10 md:px-0 md:py-10 md:pr-10">
          {section && <p className="kicker text-naranja">{section.name}</p>}
          <h2 className="mt-3 font-display text-3xl leading-tight [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
            <Link href={href} className="hover:text-naranja focus-visible:text-naranja">
              {article.title}
            </Link>
          </h2>
          {article.subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-paper/85">{article.subtitle}</p>
          )}
          <p className="kicker mt-6 text-paper/70">
            {author && <>Por {author.name}</>}
            {author && article.publishedAt && ' · '}
            {formatDate(article.publishedAt)}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex min-w-0 flex-col">
      <Link href={href} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        {image ? (
          <MediaImage
            media={image}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder className="aspect-[3/2] w-full" />
        )}
      </Link>
      <div className="mt-4 border-t-2 border-ink pt-3">
        {section && <p className="kicker text-rojo">{section.name}</p>}
        <h3 className="mt-2 font-display text-2xl leading-snug [overflow-wrap:anywhere]">
          <Link href={href} className="hover:text-rojo focus-visible:text-rojo">
            {article.title}
          </Link>
        </h3>
        {article.subtitle && (
          <p className="mt-2 line-clamp-3 leading-relaxed text-muted">{article.subtitle}</p>
        )}
        {author && <p className="kicker mt-3 text-ink-soft">Por {author.name}</p>}
      </div>
    </article>
  )
}
