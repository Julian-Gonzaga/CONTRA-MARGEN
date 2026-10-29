// Carga inicial de datos: ejecutar con "npm run seed".
// Se puede correr varias veces: solo crea lo que falta.
import { getPayload } from 'payload'

import { slugify } from '@/lib/slugify'
import config from '@/payload.config'

import { articles, authors, sections, socialAccounts } from './content'
import { makeIllustration } from './images'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

// 1. Administrador (datos tomados de .env)
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password) throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env')

const existingAdmin = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (existingAdmin.docs[0]) {
  await payload.update({ collection: 'users', id: existingAdmin.docs[0].id, data: { password } })
  log(`Administrador ${email} ya existía: contraseña actualizada desde .env`)
} else {
  await payload.create({ collection: 'users', data: { email, password, name: 'Administración' } })
  log(`Administrador ${email} creado`)
}

// 2. Secciones
const sectionIds: Record<string, number> = {}
for (const section of sections) {
  const found = await payload.find({ collection: 'sections', where: { slug: { equals: section.slug } }, limit: 1 })
  sectionIds[section.slug] = found.docs[0]?.id ?? (await payload.create({ collection: 'sections', data: section })).id
}
log(`Secciones listas: ${Object.keys(sectionIds).join(', ')}`)

// 3. Autores
const authorIds: Record<string, number> = {}
for (const author of authors) {
  const found = await payload.find({ collection: 'authors', where: { slug: { equals: author.slug } }, limit: 1 })
  authorIds[author.slug] = found.docs[0]?.id ?? (await payload.create({ collection: 'authors', data: author })).id
}
log(`Autores listos: ${Object.keys(authorIds).join(', ')}`)

// 4. Artículos (con su imagen generada)
for (const article of articles) {
  const slug = slugify(article.title)
  const found = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  })
  if (found.docs[0]) {
    log(`Ya existe: ${article.title}`)
    continue
  }

  const data = await makeIllustration(article.image.initials, article.image.variant)
  const media = await payload.create({
    collection: 'media',
    data: { alt: article.image.alt, credit: 'Ilustración: CONTRA MARGEN' },
    file: { data, mimetype: 'image/jpeg', name: `${slug}.jpg`, size: data.length },
  })

  await payload.create({
    collection: 'articles',
    draft: article.status === 'draft',
    data: {
      title: article.title,
      subtitle: article.subtitle,
      slug,
      section: sectionIds[article.section],
      author: authorIds[article.author],
      heroImage: media.id,
      body: article.body,
      publishedAt: article.publishedAt,
      _status: article.status,
    },
  })
  log(`${article.status === 'draft' ? 'Borrador' : 'Publicado'}: ${article.title}`)
}

// 5. Bandeja de redes sociales (sin enlaces todavía)
const social = await payload.findGlobal({ slug: 'social-links' })
if (!social.accounts?.length) {
  await payload.updateGlobal({
    slug: 'social-links',
    data: { accounts: socialAccounts.map((a) => ({ ...a })) },
  })
  log('Bandeja de redes sociales creada (sin enlaces)')
}

log('Listo ✔')
process.exit(0)
