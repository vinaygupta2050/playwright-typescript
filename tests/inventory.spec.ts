import { test, expect } from '../fixtures';
import { PRODUCTS, SORT_OPTIONS } from '../utils/test-data';

/**
 * Test Suite: Inventory / Products Page
 * Covers: product listing, sorting, add/remove cart, navigation
 */
test.describe('Inventory Page', () => {
  // All tests in this suite start logged in
  test.use({});

  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    // Use loginPage fixture to navigate and log in
    const { page } = loginPage;
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.assertOnInventoryPage();
  });

  // ── Product Listing ─────────────────────────────────────────────────────
  test.describe('Product Listing', () => {
    test('should display 6 products', async ({ inventoryPage }) => {
      await inventoryPage.assertProductCount(6);
    });

    test('should display all known products', async ({ inventoryPage }) => {
      for (const name of Object.values(PRODUCTS)) {
        await inventoryPage.assertProductVisible(name);
      }
    });

    test('should show product prices', async ({ inventoryPage }) => {
      const price = await inventoryPage.getProductPriceText(PRODUCTS.backpack);
      expect(price).toMatch(/\$\d+\.\d{2}/);
    });
  });

  // ── Sort ────────────────────────────────────────────────────────────────
  test.describe('Sorting', () => {
    test('should sort products A to Z by default', async ({ inventoryPage }) => {
      const firstItem = await inventoryPage.productItems.first()
        .locator('[data-test="inventory-item-name"]').textContent();
      expect(firstItem).toBe(PRODUCTS.backpack); // Sauce Labs Backpack
    });

    test('should sort products Z to A', async ({ inventoryPage }) => {
      await inventoryPage.sortProducts(SORT_OPTIONS.nameZA);
      const firstItem = await inventoryPage.productItems.first()
        .locator('[data-test="inventory-item-name"]').textContent();
      expect(firstItem).toBe(PRODUCTS.redTShirt);
    });

    test('should sort by price low to high', async ({ inventoryPage }) => {
      await inventoryPage.sortProducts(SORT_OPTIONS.priceLowHigh);
      const prices = await inventoryPage.productItems
        .locator('[data-test="inventory-item-price"]')
        .allTextContents();
      const numeric = prices.map(p => parseFloat(p.replace('$', '')));
      const sorted = [...numeric].sort((a, b) => a - b);
      expect(numeric).toEqual(sorted);
    });

    test('should sort by price high to low', async ({ inventoryPage }) => {
      await inventoryPage.sortProducts(SORT_OPTIONS.priceHighLow);
      const prices = await inventoryPage.productItems
        .locator('[data-test="inventory-item-price"]')
        .allTextContents();
      const numeric = prices.map(p => parseFloat(p.replace('$', '')));
      const sorted = [...numeric].sort((a, b) => b - a);
      expect(numeric).toEqual(sorted);
    });
  });

  // ── Cart Interactions ───────────────────────────────────────────────────
  test.describe('Cart Interactions', () => {
    test('should add a product to cart and update badge', async ({ inventoryPage }) => {
      await inventoryPage.assertCartBadgeCount(0);
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.assertCartBadgeCount(1);
    });

    test('should show remove button after adding to cart', async ({ inventoryPage }) => {
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.assertRemoveButtonVisible(PRODUCTS.backpack);
    });

    test('should remove a product from cart', async ({ inventoryPage }) => {
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.assertCartBadgeCount(1);
      await inventoryPage.removeProductFromCart(PRODUCTS.backpack);
      await inventoryPage.assertCartBadgeCount(0);
      await inventoryPage.assertAddToCartButtonVisible(PRODUCTS.backpack);
    });

    test('should add multiple products and update badge count', async ({ inventoryPage }) => {
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
      await inventoryPage.addProductToCart(PRODUCTS.boltTShirt);
      await inventoryPage.assertCartBadgeCount(3);
    });
  });
});
