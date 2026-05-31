import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login Page
 * URL: https://www.saucedemo.com/
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ──
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly loginLogo: Locator;
  readonly acceptedUsernamesList: Locator;
  readonly passwordForAllUsers: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput       = page.locator('[data-test="username"]');
    this.passwordInput       = page.locator('[data-test="password"]');
    this.loginButton         = page.locator('[data-test="login-button"]');
    this.errorMessage        = page.locator('[data-test="error"]');
    this.errorCloseButton    = page.locator('[data-test="error"] button');
    this.loginLogo           = page.locator('.login_logo');
    this.acceptedUsernamesList = page.locator('#login_credentials');
    this.passwordForAllUsers = page.locator('.login_password');
  }

  // ── Actions ──

  async goto() {
    await this.page.goto('/');
  }

  async fillUsername(username: string) {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async dismissError() {
    await this.errorCloseButton.click();
  }

  // ── Assertions ──

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.loginLogo).toBeVisible();
  }

  async assertErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async assertNoError() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async assertLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }
}
