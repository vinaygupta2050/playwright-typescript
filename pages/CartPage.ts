import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Cart Page
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage {
  readonly page: Page;

  // ── Locators ──
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartQuantityLabel: Locator;
  readonly cartDescriptionLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle               = page.locator('[data-test="title"]');
    this.cartItems               = page.locator('.cart_item');
    this.continueShoppingButton  = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton          = page.locator('[data-test="checkout"]');
    this.cartQuantityLabel       = page.locator('[data-test="cart-quantity-label"]');
    this.cartDescriptionLabel    = page.locator('[data-test="cart-desc-label"]');
  }

  // ── Helpers ──

  getCartItemByName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  getRemoveButtonForItem(name: string): Locator {
    return this.getCartItemByName(name).locator('button[data-test*="remove"]');
  }

  getItemQuantity(name: string): Locator {
    return this.getCartItemByName(name).locator('[data-test="item-quantity"]');
  }

  getItemPrice(name: string): Locator {
    return this.getCartItemByName(name).locator('[data-test="inventory-item-price"]');
  }

  // ── Actions ──

  async goto() {
    await this.page.goto('/cart.html');
  }

  async removeItem(name: string) {
    await this.getRemoveButtonForItem(name).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // ── Assertions ──

  async assertOnCartPage() {
    await expect(this.page).toHaveURL('/cart.html');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async assertItemInCart(productName: string) {
    await expect(this.getCartItemByName(productName)).toBeVisible();
  }

  async assertItemNotInCart(productName: string) {
    await expect(this.getCartItemByName(productName)).not.toBeVisible();
  }

  async assertCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async assertItemQuantity(productName: string, qty: number) {
    await expect(this.getItemQuantity(productName)).toHaveText(String(qty));
  }

  async getItemPriceText(name: string): Promise<string> {
    return (await this.getItemPrice(name).textContent()) ?? '';
  }
}
