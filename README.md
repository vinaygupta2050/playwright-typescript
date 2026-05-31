# 🧪 SauceDemo Playwright Test Suite

End-to-end **UI** and **API** test automation using **Playwright** + **TypeScript**.

- **UI tests** — [saucedemo.com](https://www.saucedemo.com) using the Page Object Model pattern
- **API tests** — [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com/apidoc/index.html) covering full CRUD operations

---

## 📁 Project Structure

```
saucedemo-playwright/
│
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions CI pipeline
│
├── api/                                # API test suite (restful-booker)
│   ├── clients/
│   │   ├── base.client.ts             # Shared HTTP helpers (GET/POST/PUT/PATCH/DELETE)
│   │   └── booking.client.ts          # All restful-booker endpoint methods
│   ├── fixtures/
│   │   └── api.fixtures.ts            # API fixtures: bookingClient, authToken, createdBookingId
│   ├── models/
│   │   └── booking.model.ts           # TypeScript interfaces for request/response shapes
│   └── tests/
│       ├── health.api.spec.ts          # GET /ping
│       ├── auth.api.spec.ts            # POST /auth
│       ├── get-booking.api.spec.ts     # GET /booking, GET /booking/:id
│       ├── create-booking.api.spec.ts  # POST /booking
│       ├── update-booking.api.spec.ts  # PUT + PATCH /booking/:id
│       ├── delete-booking.api.spec.ts  # DELETE /booking/:id
│       └── booking-lifecycle.api.spec.ts  # Full CRUD E2E in one test
│
├── config/
│   └── env.config.ts                  # Loads .env.* and exports typed CONFIG object
│
├── fixtures/
│   └── index.ts                       # UI test fixtures (DI for page objects)
│
├── pages/                             # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStep1Page.ts
│   ├── CheckoutStep2Page.ts
│   ├── CheckoutCompletePage.ts
│   └── ProductDetailPage.ts
│
├── tests/                             # UI test specs
│   ├── login.spec.ts                  # Login / auth tests
│   ├── inventory.spec.ts              # Product listing, sorting & cart tests
│   ├── checkout.spec.ts               # Full checkout E2E flow
│   └── debug-dom.spec.ts              # DOM inspector utility (local debugging only)
│
├── utils/
│   └── test-data.ts                   # Constants: products, routes, error messages
│
├── .env.example                       # ✅ Committed — safe template with all variable names
├── .env.dev                           # ❌ Not committed — local dev credentials
├── .env.staging                       # ❌ Not committed — staging credentials
├── .env.prod                          # ❌ Not committed — production credentials
├── .gitignore
├── Jenkinsfile                        # Jenkins declarative pipeline
├── package.json
├── playwright.config.ts               # Playwright configuration (browsers, baseURL, reporters)
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

> ⚠️ **Windows note:** The `ENV=value` prefix syntax does **not** work in CMD or PowerShell.
> `cross-env` is included in `devDependencies` and handles this automatically via `npm run` scripts.

---

## ▶️ Running Tests

### UI Tests (SauceDemo)

Use the `npm run` scripts — they work identically on Mac, Linux, and Windows.

**By environment**

| Command | Environment | Description |
|---------|-------------|-------------|
| `npm run test:dev` | dev | Run all UI tests against dev |
| `npm run test:staging` | staging | Run all UI tests against staging |
| `npm run test:prod` | prod | Run all UI tests against prod |

**By feature**

| Command | Description |
|---------|-------------|
| `npm run test:checkout` | Checkout flow tests only |
| `npm run test:login` | Login tests only |
| `npm run test:headed` | Run with a visible browser window |
| `npm run test:ui` | Open Playwright interactive UI mode |
| `npm run test:report` | Open the last HTML test report |

**By browser**

Mac / Linux:
```bash
ENV=dev npx playwright test --project=chromium
ENV=dev npx playwright test --project=firefox
ENV=dev npx playwright test --project=webkit
ENV=dev npx playwright test --project=mobile-chrome
```

Windows (PowerShell):
```powershell
npx cross-env ENV=dev npx playwright test --project=chromium
npx cross-env ENV=dev npx playwright test --project=firefox
npx cross-env ENV=dev npx playwright test --project=webkit
npx cross-env ENV=dev npx playwright test --project=mobile-chrome
```

---

### API Tests (Restful-Booker)

API tests run without a browser using Playwright's `APIRequestContext`.
No `.env` file needed — the restful-booker API is public with default credentials.

**Run all API tests**

```bash
npm run test:api
```

**Run by spec**

| Command | Covers |
|---------|--------|
| `npm run test:api:auth` | POST /auth |
| `npm run test:api:booking` | GET /booking, GET /booking/:id |
| `npm run test:api:create` | POST /booking |
| `npm run test:api:update` | PUT + PATCH /booking/:id |
| `npm run test:api:delete` | DELETE /booking/:id |
| `npm run test:api:e2e` | Full CRUD lifecycle test |

**Run directly with Playwright**

```bash
npx playwright test --project=api
npx playwright test --project=api --grep "lifecycle"
```

---

## 🌐 API Under Test — Restful-Booker

Base URL: `https://restful-booker.herokuapp.com`

| Method | Endpoint | Auth required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/ping` | No | Health check — returns 201 |
| `POST` | `/auth` | No | Create token — returns `{ token }` |
| `GET` | `/booking` | No | List all booking IDs (supports filters) |
| `GET` | `/booking/:id` | No | Get single booking by ID |
| `POST` | `/booking` | No | Create a new booking |
| `PUT` | `/booking/:id` | ✅ Yes | Full update of a booking |
| `PATCH` | `/booking/:id` | ✅ Yes | Partial update of a booking |
| `DELETE` | `/booking/:id` | ✅ Yes | Delete a booking |

**Auth credentials** (default, public):

```
username: admin
password: password123
```

Token is passed as a cookie header: `Cookie: token=<value>`

---

## 🏗️ API Architecture

```
api/fixtures/api.fixtures.ts
  └── bookingClient    → BookingApiClient (one per test)
  └── authToken        → fetched once before the test body runs
  └── createdBookingId → creates a booking before test, deletes it after (teardown)
          │
          ▼
api/clients/booking.client.ts   (extends BaseApiClient)
  └── createToken()
  └── getToken()             convenience method — returns token string directly
  └── ping()
  └── getAllBookings(filters?)
  └── getBookingById(id)
  └── createBooking(payload)
  └── updateBooking(id, payload, token)
  └── partialUpdateBooking(id, payload, token)
  └── deleteBooking(id, token)
          │
          ▼
api/clients/base.client.ts
  └── get() / post() / put() / patch() / delete()
  └── defaultHeaders()   adds Content-Type, Accept, Cookie: token=...
```

### The `createdBookingId` fixture

Tests that need an existing booking use the `createdBookingId` fixture — it handles setup and teardown automatically:

```typescript
test('should update a booking', async ({ bookingClient, authToken, createdBookingId }) => {
  // booking already exists — createdBookingId is its ID
  const response = await bookingClient.updateBooking(createdBookingId, payload, authToken);
  expect(response.status()).toBe(200);
  // booking is deleted automatically after this test
});
```

---

## 🌍 Environment Configuration

Credentials and base URLs for UI tests are loaded from `.env.*` files — never hardcoded.

```
ENV=dev / staging / prod
        │
        ▼
config/env.config.ts  →  loads .env.{ENV}  →  exports CONFIG
        │
        ├── playwright.config.ts  (baseURL for UI tests)
        └── utils/test-data.ts    (USERS credentials)
```

| File | Purpose | Committed? |
|------|---------|-----------|
| `.env.example` | Template — all variable names with safe placeholders | ✅ Yes |
| `.env.dev` | Local dev credentials | ❌ No |
| `.env.staging` | Staging credentials | ❌ No |
| `.env.prod` | Production credentials | ❌ No |

> API tests (restful-booker) use hardcoded public credentials and do not need `.env` files.

---

## 🏗️ UI Architecture

### Page Object Model

Each page has a dedicated class encapsulating:
- **Locators** — all element selectors as readonly properties using `data-test` attributes
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

---

## 🔑 UI Test Credentials

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

## 🧭 Explored UI Checkout Flow

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

### UI Tests

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

### API Tests

| Endpoint | Scenario | Tests |
|----------|----------|-------|
| `GET /ping` | Health check — 201 response | ✅ |
| `POST /auth` | Valid credentials — returns token | ✅ |
| `POST /auth` | Wrong password — bad credentials | ✅ |
| `POST /auth` | Unknown user — bad credentials | ✅ |
| `GET /booking` | Returns array of booking IDs | ✅ |
| `GET /booking` | Filter by firstname | ✅ |
| `GET /booking` | Filter by lastname | ✅ |
| `GET /booking` | Filter by firstname + lastname | ✅ |
| `GET /booking` | No results for unknown name | ✅ |
| `GET /booking/:id` | Returns full booking details | ✅ |
| `GET /booking/:id` | Data matches what was created | ✅ |
| `GET /booking/:id` | 404 for non-existent ID | ✅ |
| `POST /booking` | Creates booking with all fields | ✅ |
| `POST /booking` | Persists all fields correctly | ✅ |
| `POST /booking` | Works without additionalneeds | ✅ |
| `POST /booking` | Generates unique IDs | ✅ |
| `POST /booking` | 500 for missing required fields | ✅ |
| `PUT /booking/:id` | Full update returns 200 | ✅ |
| `PUT /booking/:id` | Updated data persists on GET | ✅ |
| `PUT /booking/:id` | 403 with invalid token | ✅ |
| `PUT /booking/:id` | 405 for non-existent ID | ✅ |
| `PATCH /booking/:id` | Updates single field only | ✅ |
| `PATCH /booking/:id` | Other fields remain unchanged | ✅ |
| `PATCH /booking/:id` | Updates bookingdates | ✅ |
| `PATCH /booking/:id` | 403 with invalid token | ✅ |
| `DELETE /booking/:id` | Returns 201 on success | ✅ |
| `DELETE /booking/:id` | 404 when fetching deleted booking | ✅ |
| `DELETE /booking/:id` | Not in list after deletion | ✅ |
| `DELETE /booking/:id` | 403 without token | ✅ |
| `DELETE /booking/:id` | 405 for non-existent ID | ✅ |
| Lifecycle E2E | Create → Read → PUT → PATCH → Delete → Verify | ✅ |

---

## 🔁 CI / CD

### GitHub Actions

Pipeline defined in `.github/workflows/playwright.yml`.

- Triggers on push to `main` / `develop` and on pull requests
- UI tests run in parallel across Chromium, Firefox, and WebKit
- API tests run as a separate `api` project
- Branch → environment mapping: `main` → prod, `develop` → staging, feature → dev
- Manual trigger via `workflow_dispatch` with environment dropdown
- Uploads HTML report and failure artifacts automatically

### Jenkins

Pipeline defined in `Jenkinsfile`.

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
- **Compound selectors** on unstable elements — covers underscore/hyphen naming inconsistencies in saucedemo
- **`BaseApiClient`** centralises HTTP logic — all auth headers and Content-Type set in one place
- **`createdBookingId` fixture** handles setup and teardown automatically — tests never leave stale data
- **API project in `playwright.config.ts`** — UI and API tests run independently or together with a single `npx playwright test` command
