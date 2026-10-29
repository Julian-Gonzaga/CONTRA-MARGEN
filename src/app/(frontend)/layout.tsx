import type { Metadata } from 'next'
import { Libre_Franklin, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getSections, getSocialLinks } from '@/lib/payload'

import './styles.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', display: 'swap' })
const franklin = Libre_Franklin({ subsets: ['latin'], variable: '--font-franklin', display: 'swap' })

// El contenido cambia desde el panel, así que la página se genera en cada visita
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'CONTRA MARGEN · Revista cultural',
    template: '%s · CONTRA MARGEN',
  },
  description: 'Revista cultural digital: literatura, arte y pensamiento escritos desde el borde de la página.',
  alternates: { canonical: '/' },
  openGraph: { siteName: 'CONTRA MARGEN', locale: 'es_ES', type: 'website', url: '/' },
}

// Si la base de datos no responde, el encabezado y el pie se muestran igual (vacíos)
async function safe<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load()
  } catch (error) {
    console.error('[CONTRA MARGEN] No se pudo cargar datos del layout:', error)
    return fallback
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [sections, accounts] = await Promise.all([
    safe(getSections, []),
    safe(getSocialLinks, []),
  ])

  return (
    <html lang="es" className={`${playfair.variable} ${sourceSerif.variable} ${franklin.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Saltar al contenido
        </a>
        <SiteHeader sections={sections} />
        <main id="contenido">{children}</main>
        <SiteFooter accounts={accounts} />
      </body>
    </html>
  )
}
