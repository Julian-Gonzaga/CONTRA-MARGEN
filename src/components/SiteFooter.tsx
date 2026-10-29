import Link from 'next/link'

import type { SocialLink } from '@/payload-types'

import { SocialTray } from './SocialTray'

type Props = { accounts: NonNullable<SocialLink['accounts']> }

export function SiteFooter({ accounts }: Props) {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="h-2 bg-naranja" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold">
            CONTRA<span className="text-naranja">·</span>MARGEN
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-paper/80">
            Una revista para leer despacio: literatura, arte y pensamiento escritos desde el borde de
            la página.
          </p>
        </div>
        <SocialTray accounts={accounts} />
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 font-sans text-xs text-paper/65 sm:px-6">
          <p>© {new Date().getFullYear()} CONTRA MARGEN</p>
          <Link href="/admin" className="hover:text-naranja" prefetch={false}>
            Acceso de redacción
          </Link>
        </div>
      </div>
    </footer>
  )
}
