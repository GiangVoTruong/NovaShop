import { expect, test as setup } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const email = process.env.TEST_EMAIL ?? process.env.E2E_EMAIL
const password = process.env.TEST_PASSWORD ?? process.env.E2E_PASSWORD

setup('authenticate', async ({ page }) => {
  if (!email || !password) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD (or E2E_EMAIL / E2E_PASSWORD) for e2e auth setup.')
  }

  const authDir = path.join(process.cwd(), 'e2e', '.auth')
  await mkdir(authDir, { recursive: true })
  const authFile = path.join(authDir, 'user.json')

  await page.goto('/auth/login')
  await page.locator('[name="email"]').fill(email)
  await page.locator('[name="password"]').fill(password)
  await page.getByRole('button', { name: /đăng nhập|sign in|login/i }).click()

  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 20_000 })
  await page.context().storageState({ path: authFile })
})
