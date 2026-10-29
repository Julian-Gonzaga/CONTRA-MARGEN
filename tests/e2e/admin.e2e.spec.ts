import { expect, test } from '@playwright/test'

import { login } from '../helpers/login'

// Flujo completo de la redacción: crear, publicar, editar, despublicar y borrar
test.describe.serial('Panel de administración', () => {
  const stamp = Date.now()
  const title = `Prueba automática ${stamp} — Ñandú, tildes y emoji 📚`
  const slug = `prueba-automatica-${stamp}-nandu-tildes-y-emoji`

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('crear y publicar un artículo; aparece en la portada', async ({ page }) => {
    await page.goto('/admin/collections/articles/create')
    await page.fill('#field-title', title)
    const editor = page.locator('[data-lexical-editor="true"]').first()
    await editor.click()
    await editor.pressSequentially('Texto creado por la prueba automática.')

    await page.getByRole('button', { name: /^Publicar/ }).first().click()
    await expect(page.locator('.payload-toast-container')).toContainText(/(correctamente|con éxito)/i)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  })

  test('editar el artículo cambia la portada', async ({ page }) => {
    await page.goto(`/articulos/${slug}`)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()

    await page.goto('/admin/collections/articles')
    await page.getByRole('link', { name: title }).click()
    await page.fill('#field-subtitle', 'Subtítulo editado por la prueba')
    await page.getByRole('button', { name: /^Publicar/ }).first().click()
    await expect(page.locator('.payload-toast-container')).toContainText(/(correctamente|con éxito)/i)

    await page.goto(`/articulos/${slug}`)
    await expect(page.getByText('Subtítulo editado por la prueba')).toBeVisible()
  })

  test('despublicar lo saca de la portada', async ({ page }) => {
    await page.goto('/admin/collections/articles')
    await page.getByRole('link', { name: title }).click()
    // Menú de tres puntos -> Despublicar -> Confirmar
    await page.locator('.doc-controls__dots').click()
    await page.getByRole('button', { name: 'Despublicar' }).click()
    await page.getByRole('button', { name: 'Confirmar' }).click()
    await expect(page.locator('.payload-toast-container')).toContainText(/exitosamente|con éxito|correctamente/i)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: title })).toHaveCount(0)
  })

  test('borrar el artículo', async ({ page }) => {
    await page.goto('/admin/collections/articles')
    await page.getByRole('link', { name: title }).click()
    await page.locator('.doc-controls__dots').click()
    await page.getByRole('button', { name: 'Eliminar', exact: true }).click()
    await page.getByRole('button', { name: 'Confirmar' }).click()
    await expect(page).toHaveURL(/\/admin\/collections\/articles\/?(\?.*)?$/)

    const res = await page.goto(`/articulos/${slug}`)
    expect(res?.status()).toBe(404)
  })

  test('las imágenes rechazan archivos que no son imagen', async ({ page }) => {
    await page.goto('/admin/collections/media/create')
    await page.setInputFiles('input[type="file"]', {
      name: 'malicioso.html',
      mimeType: 'text/html',
      buffer: Buffer.from('<script>alert(1)</script>'),
    })
    await page.fill('#field-alt', 'archivo no válido')
    await page.getByRole('button', { name: /^Guardar$/ }).click()
    await expect(page.locator('.payload-toast-container')).toContainText(/(no es válido|tipo|invalid|not allowed)/i)
  })
})
