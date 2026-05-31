import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Product Detail Page
 * URL: https://www.saucedemo.com/inventory-item.html?id=X
 */
export class ProductDetailPage {
  readonly page: Page;

  // ── Locators ──
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName          = page.locator('[data-test="inventory-item-name"]');
    this.productDescription   = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice         = page.locator('[data-test="inventory-item-price"]');
    this.productImage         = page.locator('[data-test="item-sauce-labs-backpack-img"], .inventory_details_img');
    this.addToCartButton      = page.locator('button[data-test*="add-to-cart"]');
    this.removeButton         = page.locator('button[data-test*="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.cartIcon             = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge            = page.locator('[data-test="shopping-cart-badge"]');
  }

  // ── Actions ──

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  // ── Assertions ──

  async assertProductDetailVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
  }

  async assertProductName(name: string) {
    await expect(this.productName).toHaveText(name);
  }

  async assertAddToCartVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async assertRemoveButtonVisible() {
    await expect(this.removeButton).toBeVisible();
  }

  async assertCartBadgeCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async getPriceText(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }
}
