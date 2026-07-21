import { test, expect } from '@playwright/test'

test('home page loads and shows the brand', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Didifairy/i)
  await expect(page.getByRole('link', { name: /didifairy/i }).first()).toBeVisible()
})

test('cart opens from the navbar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /open cart/i }).click()
  await expect(page.getByText(/your bag/i)).toBeVisible()
})
