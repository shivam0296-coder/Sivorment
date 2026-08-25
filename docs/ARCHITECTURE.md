# Architecture

## Shape

Sivorment begins as a modular monolith with two deployment processes sharing one domain model:

1. The Vinext storefront renders discovery, catalogue, finder, cart and checkout pages. Hosted read endpoints make the public catalogue independently previewable.
2. The Express service owns durable authentication, authorization, seller/admin operations, orders, wishlists, payments and PostgreSQL access.

The browser reaches Express through `NEXT_PUBLIC_API_URL`; Express restricts origins with `CORS_ORIGIN`. The Sites worker does not connect to PostgreSQL directly.

## Domain boundaries

- `data/` supplies deterministic development/seed records.
- `lib/catalogue-service.ts` owns search semantics, compound filters, recommendations and authoritative cart pricing.
- `server/src/modules/` groups routes by auth, catalogue, cart, orders, wishlist, seller, admin and payments.
- `database/schema.sql` is the source of truth for durable relational state.

Prices submitted by clients are ignored. The server resolves product, variant, city inventory, promotions, coupon, delivery and tax before returning totals.

## Security

- bcrypt cost 12 password hashes
- short-lived signed session token in HttpOnly, SameSite=Lax cookie; bearer token supported for API clients
- Zod validation at write boundaries
- parameterized PostgreSQL queries
- Helmet headers and restricted CORS
- seller/admin role middleware on every privileged namespace
- generic password-reset response to avoid account enumeration
- provider webhook signature verification boundary
- no repository secrets or plaintext passwords

## Evolution

The modular monolith keeps transactions simple now. Catalogue search can move to PostgreSQL full-text search or a dedicated index without changing HTTP contracts. Payments, storage, notifications and delivery are already separated at adapter boundaries and can become services when operational scale warrants it.
