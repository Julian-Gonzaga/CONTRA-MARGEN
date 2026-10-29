import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access/authenticated'

export const SOCIAL_NETWORKS = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'X (Twitter)', value: 'x' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Threads', value: 'threads' },
  { label: 'Spotify', value: 'spotify' },
] as const

/** Bandeja de redes sociales: se edita en /admin > Redes sociales. */
export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  label: 'Redes sociales',
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'accounts',
      type: 'array',
      label: 'Cuentas',
      labels: { singular: 'Cuenta', plural: 'Cuentas' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'network',
              type: 'select',
              label: 'Red social',
              required: true,
              options: SOCIAL_NETWORKS.map((n) => ({ label: n.label, value: n.value })),
            },
            { name: 'handle', type: 'text', label: 'Usuario (ej. @contramargen)', maxLength: 60 },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Enlace (opcional)',
          admin: { description: 'Déjalo vacío hasta tener la cuenta: el ícono se mostrará sin enlace.' },
          validate: (value: string | null | undefined) => {
            if (!value) return true
            try {
              return new URL(value).protocol === 'https:' ? true : 'El enlace debe empezar con https://'
            } catch {
              return 'Escribe un enlace completo, por ejemplo https://instagram.com/contramargen'
            }
          },
        },
      ],
    },
  ],
}
