BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(32) NOT NULL UNIQUE CHECK (name IN ('customer','seller','admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL CHECK (length(password_hash) >= 20),
  display_name varchar(100) NOT NULL,
  phone varchar(20),
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_reset_active_idx ON password_reset_tokens(user_id, expires_at) WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL,
  slug varchar(80) NOT NULL UNIQUE,
  state varchar(80) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_id uuid NOT NULL REFERENCES cities(id),
  label varchar(40),
  recipient_name varchar(100) NOT NULL,
  phone varchar(20) NOT NULL,
  line1 varchar(180) NOT NULL,
  line2 varchar(180),
  locality varchar(100) NOT NULL,
  state varchar(80) NOT NULL,
  postal_code char(6) NOT NULL CHECK (postal_code ~ '^[1-9][0-9]{5}$'),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS addresses_user_idx ON addresses(user_id);

CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  display_name varchar(100) NOT NULL,
  legal_name varchar(160) NOT NULL,
  phone varchar(20) NOT NULL,
  gstin varchar(20),
  status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended')),
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sellers_status_idx ON sellers(status);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  slug varchar(100) NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plants (
  id varchar(32) PRIMARY KEY,
  name varchar(120) NOT NULL,
  slug varchar(140) NOT NULL UNIQUE,
  scientific_name varchar(180) NOT NULL,
  description text NOT NULL,
  setting varchar(16) NOT NULL CHECK (setting IN ('indoor','outdoor','both')),
  light_requirement varchar(24) NOT NULL CHECK (light_requirement IN ('low','medium','bright-indirect','full-sun')),
  water_requirement varchar(16) NOT NULL CHECK (water_requirement IN ('low','moderate','frequent')),
  difficulty varchar(16) NOT NULL CHECK (difficulty IN ('easy','moderate','advanced')),
  pet_safe boolean NOT NULL DEFAULT false,
  care_instructions text NOT NULL,
  seo_title varchar(180) NOT NULL,
  seo_description varchar(320) NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  search_document tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(scientific_name,'') || ' ' || coalesce(description,''))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS plants_search_idx ON plants USING gin(search_document);
CREATE INDEX IF NOT EXISTS plants_active_featured_idx ON plants(active, featured);
CREATE INDEX IF NOT EXISTS plants_care_idx ON plants(light_requirement, water_requirement, difficulty, pet_safe);

CREATE TABLE IF NOT EXISTS plant_variants (
  id varchar(48) PRIMARY KEY,
  plant_id varchar(32) NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  name varchar(40) NOT NULL,
  sku varchar(80) NOT NULL UNIQUE,
  pot_size varchar(80) NOT NULL,
  plant_size varchar(80) NOT NULL,
  base_price integer NOT NULL CHECK (base_price >= 0),
  shipping_weight_grams integer NOT NULL CHECK (shipping_weight_grams > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plant_id, name)
);
CREATE INDEX IF NOT EXISTS plant_variants_plant_idx ON plant_variants(plant_id) WHERE active;

CREATE TABLE IF NOT EXISTS plant_categories (
  plant_id varchar(32) NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (plant_id, category_id)
);

CREATE TABLE IF NOT EXISTS plant_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id varchar(32) NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  plant_variant_id varchar(48) REFERENCES plant_variants(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  thumbnail_url text NOT NULL,
  mobile_url text NOT NULL,
  webp_url text NOT NULL,
  alt_text varchar(220) NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS plant_images_plant_sort_idx ON plant_images(plant_id, sort_order);

CREATE TABLE IF NOT EXISTS seller_plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id),
  plant_id varchar(32) NOT NULL REFERENCES plants(id),
  plant_variant_id varchar(48) NOT NULL REFERENCES plant_variants(id),
  seller_sku varchar(100),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (seller_id, plant_variant_id)
);
CREATE INDEX IF NOT EXISTS seller_plants_plant_idx ON seller_plants(plant_id, active);

CREATE TABLE IF NOT EXISTS prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_variant_id varchar(48) NOT NULL REFERENCES plant_variants(id),
  seller_id uuid NOT NULL REFERENCES sellers(id),
  city_id uuid REFERENCES cities(id),
  price integer NOT NULL CHECK (price >= 0),
  sale_price integer CHECK (sale_price >= 0 AND sale_price <= price),
  promotional_price integer CHECK (promotional_price >= 0 AND promotional_price <= COALESCE(sale_price, price)),
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS prices_lookup_idx ON prices(plant_variant_id, city_id, seller_id, starts_at DESC);

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_plant_id uuid NOT NULL REFERENCES seller_plants(id) ON DELETE CASCADE,
  city_id uuid NOT NULL REFERENCES cities(id),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  reserved_stock integer NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0 AND reserved_stock <= stock),
  delivery_days smallint NOT NULL DEFAULT 3 CHECK (delivery_days BETWEEN 0 AND 30),
  delivery_fee integer NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (seller_plant_id, city_id)
);
CREATE INDEX IF NOT EXISTS inventory_city_stock_idx ON inventory(city_id, stock) WHERE stock > 0;

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(32) NOT NULL UNIQUE,
  discount_type varchar(16) NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value integer NOT NULL CHECK (discount_value > 0),
  min_order_amount integer NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  max_discount integer CHECK (max_discount > 0),
  usage_limit integer CHECK (usage_limit > 0),
  per_user_limit integer CHECK (per_user_limit > 0),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  city_id uuid NOT NULL REFERENCES cities(id),
  coupon_id uuid REFERENCES coupons(id),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  plant_variant_id varchar(48) NOT NULL REFERENCES plant_variants(id),
  seller_id uuid NOT NULL REFERENCES sellers(id),
  quantity smallint NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cart_id, plant_variant_id, seller_id)
);

CREATE SEQUENCE IF NOT EXISTS order_number_seq;
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number varchar(32) NOT NULL UNIQUE DEFAULT ('SIV-' || to_char(now(),'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text,6,'0')),
  user_id uuid NOT NULL REFERENCES users(id),
  city_id uuid NOT NULL REFERENCES cities(id),
  address_id uuid NOT NULL REFERENCES addresses(id),
  coupon_id uuid REFERENCES coupons(id),
  status varchar(24) NOT NULL CHECK (status IN ('pending_payment','paid','processing','shipped','delivered','cancelled','refunded')),
  subtotal_amount integer NOT NULL CHECK (subtotal_amount >= 0),
  discount_amount integer NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  delivery_amount integer NOT NULL DEFAULT 0 CHECK (delivery_amount >= 0),
  tax_amount integer NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plant_id varchar(32) NOT NULL REFERENCES plants(id),
  plant_variant_id varchar(48) NOT NULL REFERENCES plant_variants(id),
  seller_id uuid REFERENCES sellers(id),
  product_name varchar(120) NOT NULL,
  variant_name varchar(80) NOT NULL,
  unit_price integer NOT NULL CHECK (unit_price >= 0),
  quantity smallint NOT NULL CHECK (quantity > 0),
  line_total integer NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_seller_idx ON order_items(seller_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  provider varchar(32) NOT NULL,
  provider_order_id varchar(160),
  provider_payment_id varchar(160),
  method varchar(32),
  status varchar(24) NOT NULL CHECK (status IN ('created','authorized','captured','failed','refunded')),
  amount integer NOT NULL CHECK (amount >= 0),
  currency char(3) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  failure_code varchar(80),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_payment_idx ON payments(provider, provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  plant_id varchar(32) NOT NULL REFERENCES plants(id),
  order_item_id uuid NOT NULL UNIQUE REFERENCES order_items(id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title varchar(120),
  body text,
  status varchar(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, order_item_id)
);
CREATE INDEX IF NOT EXISTS reviews_plant_status_idx ON reviews(plant_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name varchar(80) NOT NULL DEFAULT 'My plants',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS wishlist_items (
  wishlist_id uuid NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  plant_id varchar(32) NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (wishlist_id, plant_id)
);

CREATE TABLE IF NOT EXISTS delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id),
  name varchar(100) NOT NULL,
  postal_code_pattern varchar(80) NOT NULL,
  base_fee integer NOT NULL DEFAULT 0 CHECK (base_fee >= 0),
  free_delivery_threshold integer CHECK (free_delivery_threshold >= 0),
  estimated_days smallint NOT NULL CHECK (estimated_days BETWEEN 0 AND 30),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (city_id, name)
);
CREATE INDEX IF NOT EXISTS delivery_zones_city_active_idx ON delivery_zones(city_id, active);

CREATE TABLE IF NOT EXISTS homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key varchar(80) NOT NULL UNIQUE,
  content jsonb NOT NULL,
  published boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
