import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Inventory / Products Page
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage {
  readonly page: Page;

  // ── Locators ──
  readonly pageTitle: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly burgerMenuButton: Locator;
  readonly sidebarMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetAppLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle       = page.locator('[data-test="title"]');
    this.productList     = page.locator('[data-test="inventory-list"]');
    this.productItems    = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator(
      '[data-test="product_sort_container"],' +
      '[data-test="product-sort-container"],' +
      'select.product_sort_container,'        +
      'select.product-sort-container'
    );
    this.cartIcon        = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge       = page.locator('[data-test="shopping-cart-badge"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.sidebarMenu     = page.locator('.bm-menu-wrap');
    this.logoutLink      = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppLink    = page.locator('[data-test="reset-sidebar-link"]');
  }

  // ── Helpers ──

  /** Returns locator for a specific product card by its visible name */
  getProductByName(name: string): Locator {
    return this.page.locator('[data-test="inventory-item"]').filter({ hasText: name });
  }

  /** Add-to-cart button inside a specific product card */
  getAddToCartButton(productName: string): Locator {
    return this.getProductByName(productName).locator('button[data-test*="add-to-cart"]');
  }

  /** Remove button inside a specific product card */
  getRemoveButton(productName: string): Locator {
    return this.getProductByName(productName).locator('button[data-test*="remove"]');
  }

  /** Product price locator for a given product */
  getProductPrice(productName: string): Locator {
    return this.getProductByName(productName).locator('[data-test="inventory-item-price"]');
  }

  // ── Actions ──

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  async removeProductFromCart(productName: string) {
    await this.getRemoveButton(productName).click();
  }

  async sortProducts(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async openMenu() {
    await this.burgerMenuButton.click();
    await expect(this.sidebarMenu).toBeVisible();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetApp() {
    await this.openMenu();
    await this.resetAppLink.click();
  }

  async clickProductName(productName: string) {
    await this.getProductByName(productName)
      .locator('[data-test="inventory-item-name"]')
      .click();
  }

  // ── Assertions ──

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async assertCartBadgeCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async assertProductVisible(productName: string) {
    await expect(this.getProductByName(productName)).toBeVisible();
  }

  async assertAddToCartButtonVisible(productName: string) {
    await expect(this.getAddToCartButton(productName)).toBeVisible();
  }

  async assertRemoveButtonVisible(productName: string) {
    await expect(this.getRemoveButton(productName)).toBeVisible();
  }

  async assertProductCount(count: number) {
    await expect(this.productItems).toHaveCount(count);
  }

  async getProductPriceText(productName: string): Promise<string> {
    return (await this.getProductPrice(productName).textContent()) ?? '';
  }
}
