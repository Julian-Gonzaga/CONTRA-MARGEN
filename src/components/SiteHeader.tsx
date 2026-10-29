import Link from 'next/link'

import type { Section } from '@/payload-types'

export function SiteHeader({ sections }: { sections: Section[] }) {
  const today = new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(new Date())

  return (
    <header className="border-b border-ink">
      {/* Franja de color: rojo, naranja y negro */}
      <div className="flex h-2" aria-hidden="true">
        <div className="flex-[3] bg-rojo" />
        <div className="flex-[2] bg-naranja" />
        <div className="flex-[5] bg-ink" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="kicker border-b border-rule py-2 text-center text-muted first-letter:uppercase">
          {today}
        </p>

        <div className="py-6 text-center sm:py-8">
          <Link href="/" className="inline-block" aria-label="CONTRA MARGEN, ir a la portada">
            <span className="block font-display text-[2.15rem] leading-none font-bold tracking-tight min-[400px]:text-5xl sm:text-7xl lg:text-8xl">
              CONTRA<span className="text-rojo">·</span>MARGEN
            </span>
          </Link>
          <p className="mt-3 font-serif text-base italic text-muted sm:text-lg">
            Revista de cultura, letras y pensamiento
          </p>
        </div>
      </div>

      {sections.length > 0 && (
        <nav aria-label="Secciones" className="border-t border-ink">
          <ul className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-1 px-4 py-3 sm:gap-x-10">
            <li>
              <Link href="/" className="kicker inline-block py-1 text-ink hover:text-rojo">
                Portada
              </Link>
            </li>
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/secciones/${section.slug}`}
                  className="kicker inline-block py-1 text-ink hover:text-rojo"
                >
                  {section.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
