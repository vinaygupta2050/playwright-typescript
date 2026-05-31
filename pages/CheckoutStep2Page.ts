import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Checkout Step 2 – Order Overview
 * URL: https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutStep2Page {
  readonly page: Page;

  // ── Locators ──
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summaryInfoLabels: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle          = page.locator('[data-test="title"]');
    this.cartItems          = page.locator('.cart_item');
    this.subtotalLabel      = page.locator('[data-test="subtotal-label"]');
    this.taxLabel           = page.locator('[data-test="tax-label"]');
    this.totalLabel         = page.locator('[data-test="total-label"]');
    this.finishButton       = page.locator('[data-test="finish"]');
    this.cancelButton       = page.locator('[data-test="cancel"]');
    this.summaryInfoLabels  = page.locator('.summary_info_label');
    this.paymentInfoValue   = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoValue  = page.locator('[data-test="shipping-info-value"]');
  }

  // ── Helpers ──

  getOrderedItemByName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  // ── Actions ──

  async goto() {
    await this.page.goto('/checkout-step-two.html');
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  // ── Assertions ──

  async assertOnCheckoutStep2() {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async assertItemInSummary(productName: string) {
    await expect(this.getOrderedItemByName(productName)).toBeVisible();
  }

  async assertSubtotalContains(amount: string) {
    await expect(this.subtotalLabel).toContainText(amount);
  }

  async assertTaxVisible() {
    await expect(this.taxLabel).toBeVisible();
  }

  async assertTotalVisible() {
    await expect(this.totalLabel).toBeVisible();
  }

  async getSubtotalText(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  async getTotalText(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async assertPaymentInfoVisible() {
    await expect(this.paymentInfoValue).toBeVisible();
  }

  async assertShippingInfoVisible() {
    await expect(this.shippingInfoValue).toBeVisible();
  }

  async assertOrderedItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }
}
