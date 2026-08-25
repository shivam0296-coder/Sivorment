# API

Base paths are identical in the hosted read API and Express service where applicable. Errors use `{ "error": { "code", "message" } }`.

## Public

- `GET /api/health`
- `GET /api/plants?city=noida&search=low%20light%20plants&category=Palms&maxPrice=700&petSafe=true`
- `GET /api/plants/:slug`
- `POST /api/recommendations` — rule-based; never labelled AI
- `POST /api/cart/price` — validates stock and calculates coupon, delivery, tax and total
- `GET /api/payments/methods`

Search understands normal catalogue text plus the explicit phrases “low light”, “office”, “pet friendly”, “balcony”, “easy care” and “plants under ₹N”. Filters can be combined.

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password-reset/request`

## Customer (authenticated)

- `GET|POST /api/orders`
- `GET /api/wishlist`
- `POST /api/wishlist/items`
- `DELETE /api/wishlist/items/:plantId`

## Seller

- `POST /api/seller/apply` — authenticated customer application
- `GET /api/seller/dashboard`
- `POST /api/seller/profile`
- `PUT /api/seller/inventory/:inventoryId`
- `GET /api/seller/orders`
- `POST /api/seller/images/presign`

## Admin

- `GET /api/admin/overview`
- `PATCH /api/admin/plants/:plantId`
- `PATCH /api/admin/sellers/:sellerId/status`
- `PATCH /api/admin/orders/:orderId/status`
- `POST /api/admin/coupons`

Seller and admin responses are protected server-side; hiding a browser control is never treated as authorization.
