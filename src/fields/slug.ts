import type { TextField } from 'payload'

import { slugify } from '@/lib/slugify'

/**
 * Campo "slug" (la parte de la URL). Si se deja vacío se genera a partir de
 * otro campo (por defecto el título). Siempre se normaliza con slugify().
 */
export const slugField = (from = 'title'): TextField => ({
  name: 'slug',
  type: 'text',
  label: 'Slug (URL)',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Si lo dejas vacío se genera solo a partir del nombre o título.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value) || undefined
        const source = data?.[from]
        if (typeof source === 'string') return slugify(source) || undefined
        return value
      },
    ],
  },
})
