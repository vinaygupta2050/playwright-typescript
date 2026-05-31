import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Checkout Step 1 – Customer Information
 * URL: https://www.saucedemo.com/checkout-step-one.html
 */
export class CheckoutStep1Page {
  readonly page: Page;

  // ── Locators ──
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle        = page.locator('[data-test="title"]');
    this.firstNameInput   = page.locator('[data-test="firstName"]');
    this.lastNameInput    = page.locator('[data-test="lastName"]');
    this.postalCodeInput  = page.locator('[data-test="postalCode"]');
    this.continueButton   = page.locator('[data-test="continue"]');
    this.cancelButton     = page.locator('[data-test="cancel"]');
    this.errorMessage     = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  // ── Actions ──

  async goto() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillFirstName(value: string) {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string) {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(value);
  }

  async fillPostalCode(value: string) {
    await this.postalCodeInput.clear();
    await this.postalCodeInput.fill(value);
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async dismissError() {
    await this.errorCloseButton.click();
  }

  async fillAndContinue(firstName: string, lastName: string, postalCode: string) {
    await this.fillCustomerInfo(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  // ── Assertions ──

  async assertOnCheckoutStep1() {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async assertErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async assertNoError() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async assertInputHighlightedAsError(inputLocator: Locator) {
    await expect(inputLocator).toHaveClass(/error/);
  }
}
