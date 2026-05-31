import { CONFIG } from '../config/env.config';

// ─────────────────────────────────────────────────────────────────────────────
//  Test Data & Constants
//
//  Credentials come from CONFIG (loaded from the active .env.* file).
//  Static data (product names, routes, error messages) stays hardcoded
//  since it's not environment-specific.
// ─────────────────────────────────────────────────────────────────────────────

// ── Users — sourced from environment config ───────────────────────────────────
export const USERS = CONFIG.users;

// ── Checkout customer info ────────────────────────────────────────────────────
export const CUSTOMER = {
  firstName:  'John',
  lastName:   'Doe',
  postalCode: '10001',
} as const;

// ── Products ──────────────────────────────────────────────────────────────────
export const PRODUCTS = {
  backpack:     'Sauce Labs Backpack',
  bikeLight:    'Sauce Labs Bike Light',
  boltTShirt:   'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie:       'Sauce Labs Onesie',
  redTShirt:    'Test.allTheThings() T-Shirt (Red)',
} as const;

// ── Sort options ──────────────────────────────────────────────────────────────
export const SORT_OPTIONS = {
  nameAZ:        'az',
  nameZA:        'za',
  priceLowHigh:  'lohi',
  priceHighLow:  'hilo',
} as const;

// ── Error messages ────────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  lockedOut:           'Epic sadface: Sorry, this user has been locked out.',
  missingUsername:     'Epic sadface: Username is required',
  missingPassword:     'Epic sadface: Password is required',
  wrongCredentials:    'Epic sadface: Username and password do not match any user in this service',
  firstNameRequired:   'Error: First Name is required',
  lastNameRequired:    'Error: Last Name is required',
  postalCodeRequired:  'Error: Postal Code is required',
} as const;

// ── Page routes ───────────────────────────────────────────────────────────────
export const ROUTES = {
  login:            '/',
  inventory:        '/inventory.html',
  cart:             '/cart.html',
  checkoutStep1:    '/checkout-step-one.html',
  checkoutStep2:    '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;
