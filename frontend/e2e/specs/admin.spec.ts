import { expect, test } from '@playwright/test'

import { PATHS } from '../helpers/paths'

const ADMIN_PAGES = [
  { path: PATHS.ADMIN, label: 'Dashboard' },
  { path: PATHS.ADMIN_ANALYTICS, label: 'Analytics' },
  { path: PATHS.ADMIN_PRODUCTS, label: 'Products' },
  { path: PATHS.ADMIN_ORDERS, label: 'Orders' },
  { path: PATHS.ADMIN_CUSTOMERS, label: 'Customers' },
  { path: PATHS.ADMIN_CATEGORIES, label: 'Categories' },
  { path: PATHS.ADMIN_INVENTORY, label: 'Inventory' },
  { path: PATHS.ADMIN_COUPONS, label: 'Coupons' },
  { path: PATHS.ADMIN_SETTINGS, label: 'Settings' },
] as const

test.describe('Admin — toàn bộ module', () => {
  for (const adminPage of ADMIN_PAGES) {
    test(`${adminPage.label} (${adminPage.path}) tải được`, async ({ page }) => {
      await page.goto(adminPage.path)
      await expect(page).toHaveURL(new RegExp(adminPage.path.replace('/', '\\/') + '(\\?.*)?$'))
      await expect(page.locator('body')).not.toContainText(/404|Not Found|Unauthorized|403/i)
      await expect(page.locator('aside nav, nav')).toBeVisible()
    })
  }

  test('sidebar điều hướng giữa products và orders', async ({ page }) => {
    await page.goto(PATHS.ADMIN)
    const sidebar = page.locator('aside nav')
    await sidebar.getByRole('link', { name: /Sản phẩm|Products/i }).click()
    await expect(page).toHaveURL(new RegExp(PATHS.ADMIN_PRODUCTS))

    await sidebar.getByRole('link', { name: /Đơn hàng|Orders/i }).click()
    await expect(page).toHaveURL(new RegExp(PATHS.ADMIN_ORDERS))
  })

  test('link xem cửa hàng quay về trang chủ và giữ trạng thái đăng nhập', async ({ page }) => {
    await page.goto(PATHS.ADMIN)
    await page.getByRole('link', { name: /Xem cửa hàng|View store/i }).first().click()
    await expect(page).toHaveURL(PATHS.HOME)

    await expect(
      page.locator('header').getByRole('link', { name: /Hồ sơ|Profile/i }).first(),
    ).toBeVisible({ timeout: 15_000 })
  })
})
