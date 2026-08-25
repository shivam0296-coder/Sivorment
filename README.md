# Sivorment

**CREATE A NATURE WORLD.**

Sivorment is a multi-city plant marketplace designed as a digital ecosystem: cinematic discovery on the surface, structured city inventory and secure commerce underneath. The initial implementation combines a Sites-compatible Vinext/React storefront, a modular Express API, and a normalized PostgreSQL model.

## What exists

- Original responsive homepage journey: dark sky → forest → mist/water → sunlight → living garden
- 40 normalized plant records with care, SEO, four variants, media metadata and ten-city inventory
- Backend-powered natural search, compound filters and debounced catalogue states
- Transparent, rule-based eight-question plant finder
- Product pages with gallery, variants, city availability, pricing, delivery and structured data
- Guest cart with server-authoritative pricing, stock checks, coupons, delivery, tax and totals
- Checkout address validation plus credential-free Razorpay/UPI/card abstraction
- Registration/login with bcrypt hashing, signed sessions, logout and reset-token foundation
- Role-protected customer, seller and admin APIs
- Seller applications, inventory/pricing, image-upload adapter boundary, orders and sales overview
- PostgreSQL schema for users, roles, cities, addresses, plants, categories, variants, images, prices, inventory, sellers, carts, orders, payments, reviews, wishlists, coupons and delivery zones
- SEO metadata, product JSON-LD, canonicals, Open Graph/X cards, sitemap, robots and manifest
- Accessibility focus states, semantic landmarks, keyboard controls and reduced-motion support
- Automated domain, security and HTTP API tests

External payment capture, email delivery and seller media upload are intentionally configuration-gated. They are not represented as active without credentials and provider adapters.

## Architecture

```text
app/                 Vinext/React storefront, pages and hosted route handlers
app/components/      Environment, navigation, catalogue, finder, checkout and account UI
data/                40-plant seed catalogue and supported cities
lib/                 Shared domain types, querying, recommendations and pricing
server/              Express modular monolith and role-protected APIs
database/            PostgreSQL schema and idempotent seed program
docs/                Architecture, API, database and pricing notes
public/              Original generated brand and catalogue artwork
tests/               Domain tests; server/tests contains HTTP/security tests
```

The storefront can deploy independently to OpenAI Sites. The Express API is a separate HTTP service because hosted Sites do not open raw PostgreSQL sockets; production connects the storefront to it using `NEXT_PUBLIC_API_URL`.

## Technology

- React 19, TypeScript, Vinext, Vite and Tailwind CSS processing
- Node.js 24 and Express 5
- PostgreSQL 17 with `pgcrypto` and `citext`
- Zod validation, bcrypt password hashing, JWT session tokens, Helmet and CORS
- Node test runner with compiled TypeScript fixtures

## Local setup

Requirements: Node.js 24+, pnpm 11+ and Docker (recommended for PostgreSQL).

```bash
cp .env.example .env
pnpm install --ignore-scripts
docker compose up -d postgres
psql "$DATABASE_URL" -f database/schema.sql
pnpm tsx database/seed.ts
pnpm api:dev
pnpm dev
```

The web app runs at `http://localhost:3000`; the API defaults to `http://localhost:4000`.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the storefront |
| `pnpm api:dev` | Run the Express API |
| `pnpm test` | Compile and run domain/security/API tests |
| `pnpm typecheck` | Check storefront and API TypeScript |
| `pnpm lint` | Run ESLint |
| `pnpm build` | Build the deployable storefront |
| `pnpm api:build` | Compile the Express service |

## Environment variables

See `.env.example`. Real credentials belong only in local/hosted secret storage. No secret is committed. `DATABASE_URL` and `JWT_SECRET` activate durable accounts and order flows; payment and storage variables activate their adapter boundaries.

## Database

Apply `database/schema.sql`, then run `database/seed.ts`. The seed is idempotent for roles, cities, categories, plants, variants, media, sellers, inventory and prices. Seed seller identities use disabled password hashes and cannot be used as login credentials.

## API overview

Public endpoints cover health, plants, search/filtering, recommendations and authoritative cart pricing. Authenticated customer endpoints cover account, orders and wishlist. Seller/admin namespaces require their corresponding role on every request. See `docs/API.md`.

## Production build

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm api:build
```

Deploy the Sites build for the storefront and the server container for the API. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `CORS_ORIGIN`, database and secret values in the target environments.

## GitHub workflow

Work on focused branches, keep commits logically grouped, and open a pull request into `main`. GitHub Actions repeats type checking, tests, lint and the production build. Secrets remain in GitHub/host environment settings.

## Roadmap

- Connect transactional email for verification and password reset delivery
- Implement the selected object-storage signed-upload adapter and image derivatives
- Activate Razorpay provider-order creation, capture and webhook reconciliation
- Add delivery-partner tracking and returns workflows
- Expand seller reconciliation, promotions and recommendation signals from real purchase data
