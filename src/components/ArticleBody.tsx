import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { safeHref } from '@/lib/safeHref'

type LinkFields = {
  url?: string
  newTab?: boolean
  linkType?: 'custom' | 'internal'
  doc?: { relationTo?: string; value?: { slug?: string } | number }
}

function hrefFor(fields: LinkFields): string | null {
  if (fields.linkType === 'internal') {
    const value = fields.doc?.value
    if (value && typeof value === 'object' && value.slug && fields.doc?.relationTo === 'articles') {
      return `/articulos/${value.slug}`
    }
    return null
  }
  return safeHref(fields.url)
}

function SafeLink({ fields, children }: { fields: LinkFields; children: React.ReactNode }) {
  const href = hrefFor(fields)
  if (!href) return <span>{children}</span>
  return (
    <a
      href={href}
      target={fields.newTab ? '_blank' : undefined}
      rel={fields.newTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

// Reemplazamos los conversores de enlaces para filtrar URLs peligrosas (XSS)
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => (
    <SafeLink fields={node.fields as LinkFields}>{nodesToJSX({ nodes: node.children })}</SafeLink>
  ),
  autolink: ({ node, nodesToJSX }) => (
    <SafeLink fields={node.fields as LinkFields}>{nodesToJSX({ nodes: node.children })}</SafeLink>
  ),
})

export function ArticleBody({ data }: { data: SerializedEditorState }) {
  return <RichText data={data} converters={converters} className="prose-cm" />
}
