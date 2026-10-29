import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Sections: CollectionConfig = {
  slug: 'sections',
  labels: { singular: 'Sección', plural: 'Secciones' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, maxLength: 60 },
    slugField('name'),
    { name: 'description', type: 'textarea', label: 'Descripción', maxLength: 500 },
  ],
}
