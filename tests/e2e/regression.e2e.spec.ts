import { expect, test, type APIRequestContext } from '@playwright/test'
import sharp from 'sharp'

import { adminUser, login } from '../helpers/login'

// Pruebas de regresión de los problemas que encontró la revisión adversa

async function adminToken(request: APIRequestContext): Promise<string> {
  const login = await request.post('/api/users/login', { data: adminUser })
  return (await login.json()).token
}

const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const paragraph = (children: object[]) => ({
  type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '', children,
})
const body = (children: object[]) => ({
  root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children: [paragraph(children)] },
})

test.describe('Regresiones de la revisión QA', () => {
  test('cabeceras de seguridad presentes (anti-clickjacking, nosniff)', async ({ request }) => {
    for (const url of ['/', '/admin/login']) {
      const res = await request.get(url)
      const h = res.headers()
      expect(h['x-frame-options'], url).toBe('DENY')
      expect(h['content-security-policy'], url).toContain("frame-ancestors 'none'")
      expect(h['x-content-type-options'], url).toBe('nosniff')
      expect(h['x-powered-by'] ?? '', url).not.toContain('Next.js')
    }
  })

  test('el título 404 es específico y hay favicon', async ({ page }) => {
    await page.goto('/articulos/no-existe')
    await expect(page).toHaveTitle(/no encontrad[oa]/i)
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', /icon/)
  })

  test('un borrador no puede guardar enlaces javascript: (los borradores no se validan)', async ({ request }) => {
    const token = await adminToken(request)
    const headers = { Authorization: `JWT ${token}` }
    const malicious = {
      type: 'link', version: 3, direction: 'ltr', format: '', indent: 0,
      fields: { url: 'javascript:alert(1)', linkType: 'custom', newTab: false },
      children: [text('enlace malicioso')],
    }
    const res = await request.post('/api/articles?draft=true', {
      headers,
      data: { title: 'Regresión borrador XSS', slug: `regresion-xss-${Date.now()}`, _status: 'draft', body: body([malicious]) },
    })
    expect(res.status()).toBe(201)
    const id = (await res.json()).doc.id
    try {
      const saved = await request.get(`/api/articles/${id}?draft=true`, { headers })
      expect(JSON.stringify(await saved.json())).not.toContain('javascript:')
    } finally {
      await request.delete(`/api/articles/${id}`, { headers })
    }
  })

  test.describe('con un artículo de título muy largo', () => {
    let id: number
    let token: string

    test.beforeAll(async ({ request }) => {
      token = await adminToken(request)
      const res = await request.post('/api/articles', {
        headers: { Authorization: `JWT ${token}` },
        data: {
          title: `Regresión ${'Supercalifragilisticoespialidoso'.repeat(5)}`,
          slug: `regresion-titulo-largo-${Date.now()}`,
          _status: 'published',
          body: body([text('Prueba de título largo.')]),
        },
      })
      expect(res.status()).toBe(201)
      id = (await res.json()).doc.id
    })

    test.afterAll(async ({ request }) => {
      await request.delete(`/api/articles/${id}`, { headers: { Authorization: `JWT ${token}` } })
    })

    for (const width of [320, 375]) {
      test(`la portada no se desborda a ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        for (const url of ['/', '/secciones/premios']) {
          await page.goto(url)
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          )
          expect(overflow, `${url} a ${width}px`).toBeLessThanOrEqual(0)
        }
      })
    }
  })

  test.describe('imágenes de más de 5 MB', () => {
    let buffer: Buffer

    test.beforeAll(async () => {
      // Imagen JPG real de ruido aleatorio: pesa más de 5 MB
      buffer = await sharp({
        create: { width: 2600, height: 2600, channels: 3, background: '#000', noise: { type: 'gaussian', mean: 128, sigma: 80 } },
      })
        .jpeg({ quality: 100 })
        .toBuffer()
      expect(buffer.length).toBeGreaterThan(5 * 1024 * 1024)
    })

    test('por la API se rechazan (en Vercel la plataforma corta antes: 413)', async ({ request }) => {
      const token = await adminToken(request)
      const res = await request.post('/api/media', {
        headers: { Authorization: `JWT ${token}` },
        multipart: {
          file: { name: 'grande.jpg', mimeType: 'image/jpeg', buffer },
          _payload: JSON.stringify({ alt: 'demasiado grande' }),
        },
      })
      if (process.env.BASE_URL) {
        expect([400, 413]).toContain(res.status())
      } else {
        expect(res.status()).toBe(400)
        expect(JSON.stringify(await res.json())).toContain('máximo permitido es 5 MB')
      }
    })

    test('desde el panel se muestra un mensaje claro en español y no se guarda', async ({ page, request }) => {
      await login(page)
      await page.goto('/admin/collections/media/create')
      await page.setInputFiles('input[type="file"]', { name: 'grande-panel.jpg', mimeType: 'image/jpeg', buffer })
      await page.fill('#field-alt', 'prueba demasiado grande')
      await page.getByRole('button', { name: /^Guardar$/ }).click()
      await expect(page.locator('.payload-toast-container')).toContainText('máximo permitido es 5 MB')

      const token = await adminToken(request)
      const res = await request.get('/api/media?where[alt][equals]=prueba%20demasiado%20grande', {
        headers: { Authorization: `JWT ${token}` },
      })
      expect((await res.json()).totalDocs).toBe(0)
    })
  })
})
