import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Administrador', plural: 'Administradores' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutos de bloqueo tras 5 intentos fallidos
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    // El email y la contraseña los añade Payload automáticamente
    { name: 'name', type: 'text', label: 'Nombre' },
  ],
}
