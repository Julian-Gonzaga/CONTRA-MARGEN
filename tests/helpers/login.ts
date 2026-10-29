import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const adminUser = {
  email: process.env.ADMIN_EMAIL || '',
  password: process.env.ADMIN_PASSWORD || '',
}

/** Inicia sesión en el panel /admin con el administrador del .env. */
export async function login(page: Page, user = adminUser): Promise<void> {
  await page.goto('/admin/login')
  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin\/?$/)
  await expect(page.locator('.dashboard, [class*="dashboard"]').first()).toBeVisible()
}
