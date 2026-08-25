# Database

PostgreSQL is normalized around plants, sellable variants, sellers and city inventory.

```text
plants ──< plant_variants ──< seller_plants >── sellers
  │              │                  │
  ├──< images    └──< prices        └──< inventory >── cities
  └──< plant_categories >── categories

users ──< addresses
  ├── cart ──< cart_items
  ├── wishlist ──< wishlist_items
  └── orders ──< order_items ──> payments / reviews
```

Money is stored as integer INR minor units at the current whole-rupee product granularity, avoiding floating-point arithmetic. Historical order items snapshot product/variant names and prices. Price rows are time-bounded and can vary by city and seller. Inventory separates stock from reserved stock.

Important indexes cover plant full-text search, care filters, active/featured retrieval, city stock, effective price lookup, orders by user/status, seller fulfilment and published reviews.

`database/schema.sql` is transactional and uses foreign keys, unique constraints, checks and timestamps. `database/seed.ts` creates the complete 40-plant, ten-city development catalogue.
