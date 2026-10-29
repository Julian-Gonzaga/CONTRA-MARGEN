import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { sanitizeLexicalLinks } from '@/lib/safeHref'
import { parseVideoUrl } from '@/lib/video'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Artículo', plural: 'Artículos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'author', '_status', 'publishedAt'],
  },
  // drafts: true añade el estado Borrador / Publicado
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  access: {
    // El público solo ve artículos publicados; los administradores ven todo
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Título', required: true, maxLength: 200 },
    { name: 'subtitle', type: 'textarea', label: 'Subtítulo', maxLength: 400 },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'relationship', relationTo: 'authors', label: 'Autor' },
        { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Sección' },
      ],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Imagen principal' },
    {
      name: 'body',
      type: 'richText',
      label: 'Cuerpo del artículo',
      required: true,
      // No se guardan enlaces peligrosos (javascript:, data:, etc.)
      hooks: { beforeChange: [({ value }) => sanitizeLexicalLinks(value)] },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video (opcional)',
      admin: { description: 'Enlace de YouTube o Vimeo. Se mostrará al final del artículo.' },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return parseVideoUrl(value) ? true : 'Usa un enlace válido de YouTube o Vimeo.'
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        // Si se publica sin fecha, se pone la fecha actual
        beforeChange: [
          ({ siblingData, value }) =>
            !value && siblingData._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
  ],
}
