import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Checkout Complete Page
 * URL: https://www.saucedemo.com/checkout-complete.html
 */
export class CheckoutCompletePage {
  readonly page: Page;

  // ── Locators ──
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle         = page.locator('[data-test="title"]');
    this.completeHeader    = page.locator('[data-test="complete-header"]');
    this.completeText      = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage  = page.locator('[data-test="pony-express"]');
    this.backHomeButton    = page.locator('[data-test="back-to-products"]');
  }

  // ── Actions ──

  async clickBackHome() {
    await this.backHomeButton.click();
  }

  // ── Assertions ──

  async assertOnCompletePage() {
    await expect(this.page).toHaveURL('/checkout-complete.html');
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
  }

  async assertOrderSuccessful() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toContainText('Your order has been dispatched');
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async assertBackHomeButtonVisible() {
    await expect(this.backHomeButton).toBeVisible();
  }
}
