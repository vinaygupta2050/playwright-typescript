# 🧪 SauceDemo Playwright Test Suite

End-to-end test automation for [saucedemo.com](https://www.saucedemo.com) using **Playwright** + **TypeScript** following the **Page Object Model** pattern.

---

## 📁 Project Structure

```
saucedemo-playwright/
│
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI pipeline
│
├── config/
│   └── env.config.ts              # Loads .env.* and exports typed CONFIG object
│
├── fixtures/
│   └── index.ts                   # Custom Playwright fixtures (DI for page objects)
│
├── pages/                         # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStep1Page.ts
│   ├── CheckoutStep2Page.ts
│   ├── CheckoutCompletePage.ts
│   └── ProductDetailPage.ts
│
├── tests/                         # Test specs
│   ├── login.spec.ts              # Login / auth tests
│   ├── inventory.spec.ts          # Product listing, sorting & cart tests
│   ├── checkout.spec.ts           # Full checkout E2E flow
│   └── debug-dom.spec.ts          # DOM inspector utility (run locally to debug selectors)
│
├── utils/
│   └── test-data.ts               # Constants: products, routes, error messages
│
├── .env.example                   # ✅ Committed — safe template with all variable names
├── .env.dev                       # ❌ Not committed — local dev credentials
├── .env.staging                   # ❌ Not committed — staging credentials
├── .env.prod                      # ❌ Not committed — production credentials
├── .gitignore
├── Jenkinsfile                    # Jenkins declarative pipeline
├── package.json
├── playwright.config.ts           # Playwright configuration (browsers, baseURL, reporters)
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Mac | Windows |
|------|---------|-----|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) or `brew install node` | [nodejs.org](https://nodejs.org) or `winget install OpenJS.NodeJS` |
| npm | comes with Node | — | — |
| cross-env | auto-installed | — | Required for `ENV=` syntax |

---

### Installation

**Mac / Linux**

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/saucedemo-playwright.git
cd saucedemo-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Create your local env file
cp .env.example .env.dev
# Open .env.dev and fill in credentials (already pre-filled for saucedemo)
```

**Windows (PowerShell)**

```powershell
# 1. Clone the repo
git clone https://github.com/<your-username>/saucedemo-playwright.git
cd saucedemo-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Create your local env file
copy .env.example .env.dev
# Open .env.dev and fill in credentials (already pre-filled for saucedemo)
```

> ⚠️ **Windows note:** The `ENV=value` prefix syntax used in npm scripts does **not** work in
> CMD or PowerShell. `cross-env` is included in `devDependencies` and handles this automatically
> via the `npm run` scripts — you never need to type `ENV=` manually on Windows.

---

## ▶️ Running Tests

Use the `npm run` scripts — they work identically on Mac, Linux, and Windows.

### By environment

| Command | Environment | Description |
|---------|-------------|-------------|
| `npm run test:dev` | dev | Run all tests against dev |
| `npm run test:staging` | staging | Run all tests against staging |
| `npm run test:prod` | prod | Run all tests against prod |

### By feature

| Command | Description |
|---------|-------------|
| `npm run test:checkout` | Checkout flow tests only |
| `npm run test:login` | Login tests only |
| `npm run test:headed` | Run with a visible browser window |
| `npm run test:ui` | Open Playwright interactive UI mode |
| `npm run test:report` | Open the last HTML test report |

### By browser

**Mac / Linux**

```bash
ENV=dev npx playwright test --project=chromium
ENV=dev npx playwright test --project=firefox
ENV=dev npx playwright test --project=webkit
ENV=dev npx playwright test --project=mobile-chrome
```

**Windows (PowerShell)**

```powershell
npx cross-env ENV=dev npx playwright test --project=chromium
npx cross-env ENV=dev npx playwright test --project=firefox
npx cross-env ENV=dev npx playwright test --project=webkit
npx cross-env ENV=dev npx playwright test --project=mobile-chrome
```

### Run a specific spec file

**Mac / Linux**

```bash
ENV=staging npx playwright test tests/checkout.spec.ts
ENV=staging npx playwright test tests/checkout.spec.ts --project=chromium
```

**Windows (PowerShell)**

```powershell
npx cross-env ENV=staging npx playwright test tests/checkout.spec.ts
npx cross-env ENV=staging npx playwright test tests/checkout.spec.ts --project=chromium
```

### Run a specific test by name

**Mac / Linux**

```bash
ENV=dev npx playwright test --grep "should complete checkout"
```

**Windows (PowerShell)**

```powershell
npx cross-env ENV=dev npx playwright test --grep "should complete checkout"
```

---

## 🌍 Environment Configuration

Credentials and base URLs are loaded from `.env.*` files — never hardcoded.

```
ENV=dev / staging / prod
        │
        ▼
config/env.config.ts  →  loads .env.{ENV}  →  exports CONFIG
        │
        ├── playwright.config.ts  (baseURL)
        └── utils/test-data.ts    (USERS credentials)
```

| File | Purpose | Committed? |
|------|---------|-----------|
| `.env.example` | Template — all variable names with safe placeholders | ✅ Yes |
| `.env.dev` | Local dev credentials | ❌ No |
| `.env.staging` | Staging credentials | ❌ No |
| `.env.prod` | Production credentials | ❌ No |

---

## 🏗️ Architecture

### Page Object Model

Each page has a dedicated class that encapsulates:
- **Locators** — all element selectors defined as readonly properties using `data-test` attributes
- **Actions** — user interactions (click, fill, navigate)
- **Assertions** — reusable `expect()` wrappers scoped to that page

```
                        ┌─────────────────┐
                        │  Test Fixture   │  ← fixtures/index.ts
                        │  (DI container) │     pre-wires all page objects
                        └────────┬────────┘
                                 │ injects
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
        ┌──────────┐      ┌──────────────┐    ┌──────────┐
        │LoginPage │      │InventoryPage │    │ CartPage │  ...
        └──────────┘      └──────────────┘    └──────────┘
              │                  │                   │
              └──────────────────┴───────────────────┘
                                 │ used by
                        ┌────────▼────────┐
                        │   Test Specs    │
                        │  *.spec.ts      │
                        └─────────────────┘
```

### Custom Fixtures

`fixtures/index.ts` extends Playwright's `test` to inject page objects, eliminating boilerplate:

```typescript
// ✅ With fixtures — clean
test('checkout', async ({ loginPage, inventoryPage, cartPage }) => { ... });

// ❌ Without fixtures — repetitive
test('checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  ...
});
```

The `authenticatedPage` fixture automatically logs in before the test body runs — ideal for tests that skip the login flow.

---

## 🔑 Test Credentials

All credentials are publicly listed on the saucedemo login page and pre-filled in `.env.example`:

| Username | Password | Behavior |
|----------|----------|---------|
| `standard_user` | `secret_sauce` | Normal user — full app access |
| `locked_out_user` | `secret_sauce` | Blocked at login |
| `problem_user` | `secret_sauce` | Broken images / wrong product names |
| `performance_glitch_user` | `secret_sauce` | Intentionally slow (800ms+ delays) |
| `error_user` | `secret_sauce` | Random JS errors |
| `visual_user` | `secret_sauce` | Visual layout bugs |

---

## 🧭 Explored Checkout Flow

```
1. Login           → https://www.saucedemo.com/
2. View Products   → /inventory.html
3. Add to Cart     → cart badge updates (1 item)
4. Open Cart       → /cart.html — review items
5. Begin Checkout  → /checkout-step-one.html — enter name + postal
6. Review Order    → /checkout-step-two.html — subtotal, tax, total
7. Finish          → /checkout-complete.html — "Thank you for your order!"
8. Back to Home    → /inventory.html — cart badge cleared
```

---

## 📊 Test Coverage

| Area | Tests |
|------|-------|
| Login — happy path | ✅ |
| Login — locked/wrong creds | ✅ |
| Login — empty fields | ✅ |
| Logout | ✅ |
| Product listing & count | ✅ |
| Sorting (A-Z, Z-A, price) | ✅ |
| Add / remove cart items | ✅ |
| Cart badge count | ✅ |
| Cart item removal | ✅ |
| Checkout info validation | ✅ |
| Single product E2E checkout | ✅ |
| Multi-product checkout | ✅ |
| Subtotal price verification | ✅ |
| Order completion + redirect | ✅ |
| Cancel at each checkout step | ✅ |

---

## 🔁 CI / CD

### GitHub Actions

Pipeline is defined in `.github/workflows/playwright.yml`.

- Triggers on push to `main` / `develop` and on pull requests
- Runs tests in parallel across Chromium, Firefox, and WebKit
- Branch → environment mapping:
  - `main` → prod
  - `develop` → staging
  - feature branches → dev
- Manual trigger available via `workflow_dispatch` with environment dropdown
- Uploads HTML report and failure artifacts automatically

### Jenkins

Pipeline is defined in `Jenkinsfile`.

- Uses the official Playwright Docker image (browsers pre-installed)
- Credentials injected via `withCredentials` from Jenkins Credentials Manager
- Publishes HTML report via the HTML Publisher plugin
- Parameterised build — choose environment and browser at runtime

---

## 💡 Design Decisions

- **`data-test` attributes** used over CSS classes — more resilient to styling changes
- **Locators as readonly** class properties — IDE autocomplete, single place to update
- **No hard-coded waits** — Playwright's auto-waiting handles timing
- **Fixtures for DI** — tests declare what they need, framework provides it
- **Assertion helpers on POM** — keeps spec files readable and intent-focused
- **`cross-env`** for Windows compatibility — `ENV=` prefix works on all platforms via npm scripts
- **Compound selectors** on unstable elements — covers underscore/hyphen naming inconsistencies in saucedemo's `data-test` attributes
