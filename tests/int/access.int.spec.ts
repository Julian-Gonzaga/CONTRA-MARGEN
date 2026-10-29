import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

// Estas pruebas necesitan la base de datos encendida (docker compose up -d)
let payload: Payload
const createdIds: number[] = []

describe('Reglas de acceso', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of createdIds) {
      await payload.delete({ collection: 'articles', id })
    }
  })

  it('el público no ve borradores', async () => {
    const draft = await payload.create({
      collection: 'articles',
      draft: true,
      data: {
        title: 'Prueba borrador vitest',
        body: { root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 } },
        _status: 'draft',
      },
    })
    createdIds.push(draft.id)

    const publicResult = await payload.find({
      collection: 'articles',
      overrideAccess: false,
      where: { id: { equals: draft.id } },
    })
    expect(publicResult.docs).toHaveLength(0)
  })

  it('el público no puede listar usuarios', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('el público no puede crear artículos', async () => {
    await expect(
      payload.create({
        collection: 'articles',
        overrideAccess: false,
        draft: true,
        data: {
          title: 'Intruso',
          body: { root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 } },
        },
      }),
    ).rejects.toThrow()
  })

  it('genera el slug a partir del título con tildes y emojis', async () => {
    const doc = await payload.create({
      collection: 'articles',
      draft: true,
      data: {
        title: 'Año de poesía 🌙 en Montevideo',
        body: { root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 } },
        _status: 'draft',
      },
    })
    createdIds.push(doc.id)
    expect(doc.slug).toBe('ano-de-poesia-en-montevideo')
  })
})
