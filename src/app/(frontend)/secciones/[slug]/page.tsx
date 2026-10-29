import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { getPublishedArticles, getSectionBySlug } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const section = await getSectionBySlug(slug)
  if (!section) return { title: 'Sección no encontrada' }
  return {
    title: section.name,
    description: section.description || `Artículos de la sección ${section.name} en CONTRA MARGEN.`,
    alternates: { canonical: `/secciones/${section.slug}` },
  }
}

export default async function SectionPage({ params }: Props) {
  const { slug } = await params
  const section = await getSectionBySlug(slug)
  if (!section) notFound()

  const articles = await getPublishedArticles({ sectionId: section.id })

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <header className="border-b-2 border-ink pb-8">
        <div className="mb-4 h-2 w-20 bg-rojo" aria-hidden="true" />
        <h1 className="font-display text-5xl sm:text-6xl">{section.name}</h1>
        {section.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{section.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="py-16 text-center text-lg text-muted">Todavía no hay artículos en esta sección.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
