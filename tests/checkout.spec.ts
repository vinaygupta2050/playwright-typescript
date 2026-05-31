import { test, expect } from '../fixtures';
import { PRODUCTS, CUSTOMER, ERROR_MESSAGES } from '../utils/test-data';

/**
 * Test Suite: Complete Checkout Flow
 *
 * Covers the full E2E journey:
 *   Login → Add to Cart → Cart Review → Checkout Info → Order Overview → Complete
 */
test.describe('Checkout Flow', () => {

  // ─────────────────────────────────────────────────────────────────────────
  // HAPPY PATH: Single Product Checkout
  // ─────────────────────────────────────────────────────────────────────────
  test.describe('Single Product Checkout', () => {
    test('should complete checkout with one product successfully', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
      checkoutCompletePage,
    }) => {
      // Step 1: Login
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.assertOnInventoryPage();

      // Step 2: Add product to cart
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.assertCartBadgeCount(1);

      // Step 3: Go to cart — wait for cart page to be ready before asserting
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();           // waits for /cart.html navigation
      await cartPage.assertItemInCart(PRODUCTS.backpack);
      await cartPage.assertCartItemCount(1);
      await cartPage.assertItemQuantity(PRODUCTS.backpack, 1);

      // Step 4: Proceed to checkout
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();

      // Step 5: Fill customer information
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();

      // Step 6: Verify order overview
      await checkoutStep2Page.assertItemInSummary(PRODUCTS.backpack);
      await checkoutStep2Page.assertOrderedItemCount(1);
      await checkoutStep2Page.assertTaxVisible();
      await checkoutStep2Page.assertTotalVisible();
      await checkoutStep2Page.assertPaymentInfoVisible();
      await checkoutStep2Page.assertShippingInfoVisible();

      // Step 7: Finish order
      await checkoutStep2Page.clickFinish();
      await checkoutCompletePage.assertOnCompletePage();
      await checkoutCompletePage.assertOrderSuccessful();
      await checkoutCompletePage.assertBackHomeButtonVisible();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // HAPPY PATH: Multiple Products Checkout
  // ─────────────────────────────────────────────────────────────────────────
  test.describe('Multiple Products Checkout', () => {
    test('should complete checkout with multiple products', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
      checkoutCompletePage,
    }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');

      // Add 3 products
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
      await inventoryPage.addProductToCart(PRODUCTS.boltTShirt);
      await inventoryPage.assertCartBadgeCount(3);

      // Navigate to cart and wait for page to settle before asserting
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();          // gate: wait for cart URL
      await cartPage.assertCartItemCount(3);
      await cartPage.assertItemInCart(PRODUCTS.backpack);
      await cartPage.assertItemInCart(PRODUCTS.bikeLight);
      await cartPage.assertItemInCart(PRODUCTS.boltTShirt);

      // Checkout
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

      // Overview — all items should appear
      await checkoutStep2Page.assertOnCheckoutStep2();
      await checkoutStep2Page.assertItemInSummary(PRODUCTS.backpack);
      await checkoutStep2Page.assertItemInSummary(PRODUCTS.bikeLight);
      await checkoutStep2Page.assertItemInSummary(PRODUCTS.boltTShirt);
      await checkoutStep2Page.assertOrderedItemCount(3);

      await checkoutStep2Page.clickFinish();
      await checkoutCompletePage.assertOnCompletePage();
      await checkoutCompletePage.assertOrderSuccessful();
    });

    test('should reflect correct subtotal for multiple items', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
    }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');

      // FIX: Capture prices BEFORE navigating away from inventory page
      const backpackPrice  = parseFloat((await inventoryPage.getProductPriceText(PRODUCTS.backpack)).replace('$',''));
      const bikeLightPrice = parseFloat((await inventoryPage.getProductPriceText(PRODUCTS.bikeLight)).replace('$',''));

      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.addProductToCart(PRODUCTS.bikeLight);

      // Navigate and wait for cart to settle
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();

      const expectedSubtotal = (backpackPrice + bikeLightPrice).toFixed(2);
      await checkoutStep2Page.assertSubtotalContains(expectedSubtotal);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CART PAGE TESTS
  // ─────────────────────────────────────────────────────────────────────────
  test.describe('Cart Page', () => {
    test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.assertOnInventoryPage();
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
      // FIX: navigate and explicitly wait for cart page URL before handing off to tests
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
    });

    test('should remove an item from cart', async ({ cartPage }) => {
      await cartPage.assertCartItemCount(2);
      await cartPage.removeItem(PRODUCTS.backpack);
      await cartPage.assertCartItemCount(1);
      await cartPage.assertItemNotInCart(PRODUCTS.backpack);
      await cartPage.assertItemInCart(PRODUCTS.bikeLight);
    });

    test('should navigate back to inventory via continue shopping', async ({
      cartPage,
      inventoryPage,
    }) => {
      await cartPage.continueShopping();
      await inventoryPage.assertOnInventoryPage();
    });

    test('should show correct item price in cart', async ({
      cartPage,
      inventoryPage,
    }) => {
      // FIX: price must be read from cart page (we are already on cart page after beforeEach)
      // The inventory locator won't resolve on cart.html — read price directly from cart
      const priceInCart = await cartPage.getItemPriceText(PRODUCTS.bikeLight);
      expect(priceInCart).toMatch(/^\$\d+\.\d{2}$/);

      // Navigate back to inventory to cross-check price consistency
      await cartPage.continueShopping();
      await inventoryPage.assertOnInventoryPage();
      const priceInInventory = await inventoryPage.getProductPriceText(PRODUCTS.bikeLight);
      expect(priceInCart).toBe(priceInInventory);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKOUT STEP 1 VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  test.describe('Checkout Information Validation', () => {
    test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.assertOnInventoryPage();
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.proceedToCheckout();
    });

    test('should show error when first name is missing', async ({ checkoutStep1Page }) => {
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue('', CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkoutStep1Page.assertErrorMessage(ERROR_MESSAGES.firstNameRequired);
    });

    test('should show error when last name is missing', async ({ checkoutStep1Page }) => {
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(CUSTOMER.firstName, '', CUSTOMER.postalCode);
      await checkoutStep1Page.assertErrorMessage(ERROR_MESSAGES.lastNameRequired);
    });

    test('should show error when postal code is missing', async ({ checkoutStep1Page }) => {
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(CUSTOMER.firstName, CUSTOMER.lastName, '');
      await checkoutStep1Page.assertErrorMessage(ERROR_MESSAGES.postalCodeRequired);
    });

    test('should navigate to overview with valid information', async ({
      checkoutStep1Page,
      checkoutStep2Page,
    }) => {
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();
    });

    test('should cancel and go back to cart', async ({
      checkoutStep1Page,
      cartPage,
    }) => {
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.clickCancel();
      await cartPage.assertOnCartPage();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKOUT COMPLETE
  // ─────────────────────────────────────────────────────────────────────────
  test.describe('Order Completion', () => {
    test('should navigate back to products after completing order', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
      checkoutCompletePage,
    }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();
      await checkoutStep2Page.clickFinish();
      await checkoutCompletePage.assertOnCompletePage();

      await checkoutCompletePage.clickBackHome();
      await inventoryPage.assertOnInventoryPage();
    });

    test('cart badge should be empty after completing order', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
      checkoutCompletePage,
    }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();
      await checkoutStep2Page.clickFinish();
      await checkoutCompletePage.assertOnCompletePage();
      await checkoutCompletePage.clickBackHome();
      await inventoryPage.assertOnInventoryPage();

      await inventoryPage.assertCartBadgeCount(0);
    });

    test('should cancel from overview and return to inventory', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutStep1Page,
      checkoutStep2Page,
    }) => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.addProductToCart(PRODUCTS.backpack);
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.proceedToCheckout();
      await checkoutStep1Page.assertOnCheckoutStep1();
      await checkoutStep1Page.fillAndContinue(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutStep2Page.assertOnCheckoutStep2();
      await checkoutStep2Page.clickCancel();
      await inventoryPage.assertOnInventoryPage();
    });
  });
});