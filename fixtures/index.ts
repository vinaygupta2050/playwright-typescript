import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStep1Page } from '../pages/CheckoutStep1Page';
import { CheckoutStep2Page } from '../pages/CheckoutStep2Page';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { USERS } from '../utils/test-data';

// ── Fixture type declaration ──
type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStep1Page: CheckoutStep1Page;
  checkoutStep2Page: CheckoutStep2Page;
  checkoutCompletePage: CheckoutCompletePage;
  productDetailPage: ProductDetailPage;
  authenticatedPage: InventoryPage; // already logged-in inventory page
};

/**
 * Extended test with all Page Object fixtures pre-wired.
 * Import `test` and `expect` from this file in all spec files.
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutStep1Page: async ({ page }, use) => {
    await use(new CheckoutStep1Page(page));
  },

  checkoutStep2Page: async ({ page }, use) => {
    await use(new CheckoutStep2Page(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  /**
   * authenticatedPage — logs in as standard_user before the test body runs.
   * Use this in any test that starts on the inventory page.
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertOnInventoryPage();
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
