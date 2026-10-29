import { postgresAdapter } from '@payloadcms/db-postgres'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Authors } from './collections/Authors'
import { Media } from './collections/Media'
import { Sections } from './collections/Sections'
import { Users } from './collections/Users'
import { SocialLinks } from './globals/SocialLinks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('Falta PAYLOAD_SECRET en el archivo .env')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · CONTRA MARGEN' },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  collections: [Articles, Authors, Sections, Media, Users],
  globals: [SocialLinks],
  // El h1 es el título del artículo: en el cuerpo solo se permiten h2-h4
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'heading'),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  // Tope técnico del servidor: 25 MB. El límite real de imágenes (5 MB) lo aplica
  // la colección Media con un mensaje en español; si el servidor cortara la
  // conexión a los 5 MB, el panel solo mostraría "Failed to fetch".
  upload: {
    limits: { fileSize: 25 * 1024 * 1024 },
  },
  sharp,
  plugins: [],
})
