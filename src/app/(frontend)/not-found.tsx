import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="kicker text-rojo">Error 404</p>
      <h1 className="mt-4 font-display text-5xl">Esta página quedó fuera del margen</h1>
      <p className="mt-4 text-lg text-muted">
        El artículo o la sección que buscas no existe o ya no está publicado.
      </p>
      <Link
        href="/"
        className="kicker mt-10 inline-block bg-ink px-6 py-3 text-paper hover:bg-rojo"
      >
        Volver a la portada
      </Link>
    </div>
  )
}
