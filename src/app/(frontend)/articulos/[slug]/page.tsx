import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleBody } from '@/components/ArticleBody'
import { MediaImage } from '@/components/MediaImage'
import { VideoEmbed } from '@/components/VideoEmbed'
import { formatDate } from '@/lib/format'
import { asDoc, getArticleBySlug } from '@/lib/payload'
import type { Author, Media, Section } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Artículo no encontrado' }

  const image = asDoc<Media>(article.heroImage)
  const description = article.subtitle || `Un artículo de CONTRA MARGEN: ${article.title}`
  const ogImage = image?.sizes?.hero?.url || image?.url

  return {
    title: article.title,
    description,
    alternates: { canonical: `/articulos/${article.slug}` },
    openGraph: {
      type: 'article',
      siteName: 'CONTRA MARGEN',
      locale: 'es_ES',
      url: `/articulos/${article.slug}`,
      title: article.title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      images: ogImage ? [{ url: ogImage, alt: image?.alt }] : undefined,
    },
    twitter: { card: ogImage ? 'summary_large_image' : 'summary', title: article.title, description },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const section = asDoc<Section>(article.section)
  const author = asDoc<Author>(article.author)
  const image = asDoc<Media>(article.heroImage)

  return (
    <article className="pt-12">
      <header className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {section && (
          <Link href={`/secciones/${section.slug}`} className="kicker text-rojo hover:underline">
            {section.name}
          </Link>
        )}
        <h1 className="mt-4 font-display text-4xl leading-[1.1] break-words sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="mt-5 text-xl leading-relaxed text-muted italic">{article.subtitle}</p>
        )}
        <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-ink" />
          <span className="h-2 w-2 rotate-45 bg-naranja" />
          <span className="h-px w-10 bg-ink" />
        </div>
        <p className="kicker mt-6 text-ink-soft">
          {author && <>Por {author.name}</>}
          {author && article.publishedAt && ' · '}
          {article.publishedAt && <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>}
        </p>
      </header>

      {image && (
        <figure className="mx-auto mt-10 max-w-5xl px-0 sm:px-6">
          <MediaImage
            media={image}
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-auto w-full"
          />
          {image.credit && (
            <figcaption className="mt-2 px-4 font-sans text-xs text-muted sm:px-0">{image.credit}</figcaption>
          )}
        </figure>
      )}

      <div className="mx-auto mt-12 max-w-[68ch] px-4 sm:px-6">
        <ArticleBody data={article.body} />
        <VideoEmbed url={article.videoUrl} title={article.title} />

        {author?.bio && (
          <aside className="mt-14 border-t-2 border-ink pt-6" aria-label="Sobre el autor">
            <p className="kicker text-rojo">Sobre {author.name}</p>
            <p className="mt-2 font-serif italic leading-relaxed text-muted">{author.bio}</p>
          </aside>
        )}

        <p className="mt-12">
          <Link href="/" className="kicker text-ink hover:text-rojo">
            ← Volver a la portada
          </Link>
        </p>
      </div>
    </article>
  )
}
