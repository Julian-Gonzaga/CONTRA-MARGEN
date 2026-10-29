import { APIError, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access/authenticated'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { description: 'Formatos: JPG, PNG, WebP o AVIF. Tamaño máximo: 5 MB.' },
  hooks: {
    // Mensaje claro en español si la imagen es demasiado pesada
    beforeOperation: [
      ({ args, operation }) => {
        const file = args.req?.file
        const size = file?.size ?? file?.data?.length ?? 0
        if ((operation === 'create' || operation === 'update') && size > MAX_IMAGE_BYTES) {
          const mb = (size / 1024 / 1024).toFixed(1)
          throw new APIError(`La imagen pesa ${mb} MB. El máximo permitido es 5 MB.`, 400, null, true)
        }
        return args
      },
    ],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
      admin: { description: 'Describe la imagen para personas que usan lector de pantalla.' },
    },
    { name: 'credit', type: 'text', label: 'Crédito / pie de foto' },
  ],
  upload: {
    // Solo imágenes; el tamaño máximo se define en payload.config.ts
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
  },
}
