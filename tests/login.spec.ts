import { test, expect } from '../fixtures';
import { USERS, ERROR_MESSAGES, ROUTES } from '../utils/test-data';

/**
 * Test Suite: Login Functionality
 * Covers: valid login, invalid login, edge cases
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────
  test.describe('Successful Login', () => {
    test('should login with standard_user credentials', async ({ loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.assertOnInventoryPage();
    });

    test('should display products page after login', async ({ loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.assertOnInventoryPage();
      await inventoryPage.assertProductCount(6);
    });

    test('should login with performance_glitch_user', async ({ loginPage, inventoryPage }) => {
      test.slow(); // performance glitch user is intentionally slow
      await loginPage.login(USERS.performance_glitch.username, USERS.performance_glitch.password);
      await inventoryPage.assertOnInventoryPage();
    });
  });

  // ── Negative Cases ──────────────────────────────────────────────────────
  test.describe('Failed Login', () => {
    test('should show error for locked_out_user', async ({ loginPage }) => {
      await loginPage.login(USERS.locked.username, USERS.locked.password);
      await loginPage.assertErrorMessage(ERROR_MESSAGES.lockedOut);
    });

    test('should show error when username is empty', async ({ loginPage }) => {
      await loginPage.login('', USERS.standard.password);
      await loginPage.assertErrorMessage(ERROR_MESSAGES.missingUsername);
    });

    test('should show error when password is empty', async ({ loginPage }) => {
      await loginPage.login(USERS.standard.username, '');
      await loginPage.assertErrorMessage(ERROR_MESSAGES.missingPassword);
    });

    test('should show error for wrong credentials', async ({ loginPage }) => {
      await loginPage.login('wrong_user', 'wrong_password');
      await loginPage.assertErrorMessage(ERROR_MESSAGES.wrongCredentials);
    });

    test('should show error for wrong password', async ({ loginPage }) => {
      await loginPage.login(USERS.standard.username, 'wrong_password');
      await loginPage.assertErrorMessage(ERROR_MESSAGES.wrongCredentials);
    });

    test('should dismiss error when X button is clicked', async ({ loginPage }) => {
      await loginPage.login('', '');
      await loginPage.assertErrorMessage(ERROR_MESSAGES.missingUsername);
      await loginPage.dismissError();
      await loginPage.assertNoError();
    });
  });

  // ── UI Checks ───────────────────────────────────────────────────────────
  test.describe('Login Page UI', () => {
    test('should display login form elements', async ({ loginPage }) => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.loginLogo).toBeVisible();
    });

    test('should show accepted usernames on the page', async ({ loginPage }) => {
      await expect(loginPage.acceptedUsernamesList).toBeVisible();
      await expect(loginPage.acceptedUsernamesList).toContainText('standard_user');
    });

    test('should have login button enabled by default', async ({ loginPage }) => {
      await loginPage.assertLoginButtonEnabled();
    });

    test('should mask the password field', async ({ loginPage }) => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  // ── Logout ──────────────────────────────────────────────────────────────
  test.describe('Logout', () => {
    test('should logout and redirect to login page', async ({ loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.assertOnInventoryPage();
      await inventoryPage.logout();
      await loginPage.assertOnLoginPage();
    });

    test('should not access inventory after logout', async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      await inventoryPage.logout();
      await page.goto(ROUTES.inventory);
      // Should redirect back to login
      await expect(page).toHaveURL('/');
    });
  });
});
