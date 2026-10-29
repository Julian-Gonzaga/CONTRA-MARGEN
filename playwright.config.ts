import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

/** Pruebas en navegador. Requieren la base de datos encendida y el seed cargado. */
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // Usa Microsoft Edge, que ya viene instalado en Windows (no hay que descargar nada)
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
    timeout: 180_000,
  },
})
