import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Autor', plural: 'Autores' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, maxLength: 120 },
    slugField('name'),
    { name: 'bio', type: 'textarea', label: 'Biografía', maxLength: 1500 },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
  ],
}
