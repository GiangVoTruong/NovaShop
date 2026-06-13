import { expect, test } from '@playwright/test'

import { PATHS } from '../helpers/paths'

const PUBLIC_CUSTOMER_PAGES = [
  { path: PATHS.HOME, label: 'Home' },
  { path: PATHS.PRODUCTS, label: 'Products' },
  { path: `${PATHS.PRODUCTS}?mode=explore`, label: 'Explore products' },
  { path: `${PATHS.PRODUCTS}?mode=collections`, label: 'Collections' },
  { path: `${PATHS.PRODUCTS}?mode=flash-sale`, label: 'Flash sale' },
  { path: PATHS.LOGIN, label: 'Login' },
  { path: PATHS.REGISTER, label: 'Register' },
  { path: PATHS.FORGOT_PASSWORD, label: 'Forgot password' },
  { path: PATHS.VERIFY_EMAIL, label: 'Verify email' },
  { path: PATHS.SUPPORT_HELP, label: 'Help center' },
  { path: PATHS.SUPPORT_SHIPPING, label: 'Shipping' },
  { path: PATHS.SUPPORT_RETURNS, label: 'Returns' },
  { path: PATHS.SUPPORT_WARRANTY, label: 'Warranty' },
  { path: PATHS.ABOUT, label: 'About' },
  { path: PATHS.CAREERS, label: 'Careers' },
  { path: PATHS.CONTACT, label: 'Contact' },
  { path: PATHS.POLICIES, label: 'Policies' },
  { path: PATHS.LEGAL_TERMS, label: 'Terms' },
  { path: PATHS.LEGAL_PRIVACY, label: 'Privacy' },
  { path: PATHS.LEGAL_COOKIES, label: 'Cookies' },
] as const

const AUTH_CUSTOMER_PAGES = [
  { path: PATHS.CART, label: 'Cart' },
  { path: PATHS.CHECKOUT, label: 'Checkout' },
  { path: PATHS.WISHLIST, label: 'Wishlist' },
  { path: PATHS.ORDERS, label: 'Orders' },
  { path: PATHS.PROFILE, label: 'Profile' },
] as const

test.describe('Customer — trang public', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  for (const customerPage of PUBLIC_CUSTOMER_PAGES) {
    test(`${customerPage.label} (${customerPage.path}) tải được`, async ({ page }) => {
      await page.goto(customerPage.path)
      await expect(page.locator('body')).not.toContainText(/404|Not Found/i)
    })
  }

  test('redirect /explore → /products?mode=explore', async ({ page }) => {
    await page.goto(PATHS.EXPLORE)
    await expect(page).toHaveURL(/\/products\?mode=explore/)
  })

  test('chi tiết sản phẩm tải được', async ({ page }) => {
    await page.goto(PATHS.PRODUCTS)
    const productLink = page.locator('a[href^="/products/"]').first()
    await expect(productLink).toBeVisible({ timeout: 15_000 })
    const href = await productLink.getAttribute('href')
    expect(href).toBeTruthy()
    await page.goto(href!)
    await expect(page.locator('body')).not.toContainText(/404|Not Found|Product not found/i)
  })
})

test.describe('Customer — đã đăng nhập', () => {
  for (const customerPage of AUTH_CUSTOMER_PAGES) {
    test(`${customerPage.label} (${customerPage.path}) tải được`, async ({ page }) => {
      await page.goto(customerPage.path)
      await expect(page).not.toHaveURL(/\/auth\/login/)
      await expect(page.locator('body')).not.toContainText(/404|Not Found|Unauthorized|403/i)
    })
  }

  test('bottom nav điều hướng shop → cart → profile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(PATHS.HOME)

    await page.getByRole('link', { name: /cửa hàng|shop/i }).last().click()
    await expect(page).toHaveURL(/\/products/)

    await page.getByRole('link', { name: /giỏ|cart/i }).last().click()
    await expect(page).toHaveURL(PATHS.CART)

    await page.getByRole('link', { name: /hồ sơ|profile/i }).last().click()
    await expect(page).toHaveURL(PATHS.PROFILE)
  })

  test('profile tabs: orders, address, notifications', async ({ page }) => {
    await page.goto(PATHS.PROFILE)
    await page.getByRole('button', { name: /đơn hàng|orders/i }).click()
    await expect(page.getByText(/đơn hàng|orders/i).first()).toBeVisible()

    await page.getByRole('button', { name: /địa chỉ|address/i }).click()
    await expect(page.getByText(/địa chỉ|address/i).first()).toBeVisible()

    await page.getByRole('button', { name: /thông báo|notifications/i }).last().click()
    await expect(page.getByText(/thông báo|notifications/i).first()).toBeVisible()
  })

  test('thêm sản phẩm vào giỏ từ trang shop', async ({ page }) => {
    await page.goto(PATHS.PRODUCTS)
    const addButton = page.getByRole('button', { name: /thêm vào giỏ|add to cart/i }).first()
    await expect(addButton).toBeVisible({ timeout: 15_000 })
    await addButton.click()
    await page.goto(PATHS.CART)
    await expect(page.locator('body')).not.toContainText(/giỏ trống|empty cart/i)
  })
})
