import { ArticleCard } from '@/components/ArticleCard'
import { getPublishedArticles } from '@/lib/payload'

export default async function HomePage() {
  const articles = await getPublishedArticles()
  const [lead, ...rest] = articles

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <h1 className="sr-only">CONTRA MARGEN: portada</h1>

      {!lead ? (
        <section className="mx-auto max-w-2xl border-y-2 border-ink py-16 text-center">
          <p className="kicker text-rojo">Edición en preparación</p>
          <p className="mt-4 font-display text-3xl">Aún no hay artículos publicados.</p>
          <p className="mt-3 text-muted">Vuelve pronto: la redacción está escribiendo.</p>
        </section>
      ) : (
        <>
          <section aria-label="Artículo destacado">
            <ArticleCard article={lead} variant="lead" />
          </section>

          {rest.length > 0 && (
            <section aria-labelledby="recientes" className="mt-16">
              <div className="mb-8 flex items-center gap-4">
                <h2 id="recientes" className="kicker shrink-0 text-ink">
                  Lo más reciente
                </h2>
                <div className="h-px flex-1 bg-ink" />
                <div className="h-2 w-16 bg-naranja" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
