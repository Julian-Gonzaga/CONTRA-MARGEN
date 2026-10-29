import { expect, test } from '@playwright/test'

// Requiere haber ejecutado "npm run seed"

test.describe('Sitio público', () => {
  test('la portada muestra artículos publicados y no los borradores', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CONTRA MARGEN/)
    await expect(page.getByRole('link', { name: 'CONTRA MARGEN, ir a la portada' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Ida Vitale/ })).toBeVisible()
    await expect(page.getByText(/Borrador: ¿quién merece/)).toHaveCount(0)
  })

  test('el borrador tampoco es accesible por URL ni por la API pública', async ({ page, request }) => {
    const response = await page.goto('/articulos/borrador-quien-merece-el-proximo-cervantes')
    expect(response?.status()).toBe(404)

    const api = await request.get('/api/articles?limit=100')
    const json = await api.json()
    const titles: string[] = json.docs.map((d: { title: string }) => d.title)
    expect(titles.some((t) => t.startsWith('Borrador'))).toBe(false)
  })

  test('se puede abrir un artículo y volver a la portada', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: /Rafael Cadenas/ }).getByRole('link').click()
    await expect(page).toHaveURL(/\/articulos\/rafael-cadenas/)
    await expect(page.getByRole('heading', { level: 1, name: /Rafael Cadenas/ })).toBeVisible()
    await expect(page.locator('.prose-cm p').first()).toBeVisible()

    // SEO: descripción y Open Graph
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Derrota/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Rafael Cadenas/)
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)

    await page.getByRole('link', { name: '← Volver a la portada' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('el menú de secciones navega y filtra', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Secciones' }).getByRole('link', { name: 'Poesía' }).click()
    await expect(page).toHaveURL(/\/secciones\/poesia$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Poesía' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Ida Vitale/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Luis Mateo Díez/ })).toHaveCount(0)
  })

  test('cada enlace de sección responde sin error', async ({ page, request }) => {
    await page.goto('/')
    const hrefs = await page
      .getByRole('navigation', { name: 'Secciones' })
      .getByRole('link')
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).getAttribute('href')))
    expect(hrefs.length).toBeGreaterThan(1)
    for (const href of hrefs) {
      const res = await request.get(href!)
      expect(res.status(), href!).toBe(200)
    }
  })

  test('las páginas inexistentes devuelven 404 con diseño propio', async ({ page }) => {
    for (const url of ['/no-existe', '/articulos/no-existe', '/secciones/no-existe']) {
      const res = await page.goto(url)
      expect(res?.status(), url).toBe(404)
      await expect(page.getByRole('heading', { name: /fuera del margen/ })).toBeVisible()
    }
  })

  test('la bandeja de redes sociales muestra cuentas sin enlazar', async ({ page }) => {
    await page.goto('/')
    const tray = page.getByTestId('social-tray')
    await expect(tray).toBeVisible()
    await expect(tray.locator('[data-social-pending]')).toHaveCount(6)
    await expect(tray.locator('a')).toHaveCount(0)
  })

  test('el acceso al panel exige iniciar sesión', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  for (const width of [375, 768, 1280]) {
    test(`sin desbordes horizontales a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const url of ['/', '/articulos/el-cervantes-la-historia-del-premio-mayor-de-la-lengua', '/secciones/premios']) {
        await page.goto(url)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${url} a ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('todas las imágenes tienen texto alternativo y hay un solo h1', async ({ page }) => {
    for (const url of ['/', '/articulos/ida-vitale-la-precision-como-forma-de-asombro', '/secciones/narrativa']) {
      await page.goto(url)
      const missingAlt = await page.locator('img:not([alt])').count()
      expect(missingAlt, url).toBe(0)
      await expect(page.locator('h1'), url).toHaveCount(1)
    }
  })
})
