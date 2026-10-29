import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Article, Media, Section, SocialLink } from '@/payload-types'

export const getPayloadClient = async () => getPayload({ config: await config })

// Consultas del sitio público. overrideAccess: false hace que se apliquen las
// reglas de acceso de las colecciones (el público solo ve lo publicado).

export async function getPublishedArticles({
  sectionId,
  limit = 24,
}: { sectionId?: number; limit?: number } = {}): Promise<Article[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    limit,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      ...(sectionId ? { section: { equals: sectionId } } : {}),
    },
  })
  return result.docs
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return result.docs[0] ?? null
}

export async function getSections(): Promise<Section[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sections',
    limit: 0, // sin límite: todas las secciones aparecen en el menú
    overrideAccess: false,
    sort: 'name',
  })
  return result.docs
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sections',
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ?? null
}

export async function getSocialLinks(): Promise<NonNullable<SocialLink['accounts']>> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({ slug: 'social-links', overrideAccess: false })
  return global.accounts ?? []
}

/** Las relaciones pueden venir como objeto o como id según la profundidad. */
export function asDoc<T extends object>(value: T | number | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null
}

export type { Article, Media, Section }
