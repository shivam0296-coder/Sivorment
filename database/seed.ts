import pg from 'pg';
import { cities } from '../data/cities.js';
import { categories, plants } from '../data/plants.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required to seed PostgreSQL.');
const client = new pg.Client({ connectionString: databaseUrl, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined });
const categorySlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const sellerNames = ['Canopy Nursery', 'Moss & Soil Collective', 'Urban Root House'];

await client.connect();
try {
  await client.query('BEGIN');
  for (const role of ['customer', 'seller', 'admin']) await client.query('INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [role]);
  for (const city of cities) await client.query('INSERT INTO cities (name, slug, state, active) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO UPDATE SET name=excluded.name,state=excluded.state,active=excluded.active,updated_at=now()', [city.name, city.slug, city.state, city.active]);
  for (const name of categories) await client.query('INSERT INTO categories (name,slug,description) VALUES ($1,$2,$3) ON CONFLICT (slug) DO UPDATE SET name=excluded.name,description=excluded.description,updated_at=now()', [name, categorySlug(name), `${name} curated for Sivorment living environments.`]);

  const sellers: Array<{ id: string; display_name: string }> = [];
  for (let index = 0; index < sellerNames.length; index += 1) {
    const email = `seed-seller-${index + 1}@sivorment.invalid`;
    const user = await client.query<{ id: string }>(`INSERT INTO users (role_id,email,password_hash,display_name) SELECT id,$1,'DISABLED_SEED_ACCOUNT_HASH', $2 FROM roles WHERE name='seller' ON CONFLICT (email) DO UPDATE SET display_name=excluded.display_name RETURNING id`, [email, sellerNames[index]]);
    const seller = await client.query<{ id: string; display_name: string }>(`INSERT INTO sellers (user_id,display_name,legal_name,phone,status,approved_at,rating) VALUES ($1,$2,$2,'0000000000','approved',now(),4.6) ON CONFLICT (user_id) DO UPDATE SET display_name=excluded.display_name,status='approved',updated_at=now() RETURNING id,display_name`, [user.rows[0].id, sellerNames[index]]);
    sellers.push(seller.rows[0]);
  }

  for (const plant of plants) {
    await client.query(`INSERT INTO plants (id,name,slug,scientific_name,description,setting,light_requirement,water_requirement,difficulty,pet_safe,care_instructions,seo_title,seo_description,featured,active,rating,review_count) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,$15,$16) ON CONFLICT (id) DO UPDATE SET name=excluded.name,scientific_name=excluded.scientific_name,description=excluded.description,light_requirement=excluded.light_requirement,water_requirement=excluded.water_requirement,difficulty=excluded.difficulty,pet_safe=excluded.pet_safe,care_instructions=excluded.care_instructions,seo_title=excluded.seo_title,seo_description=excluded.seo_description,featured=excluded.featured,rating=excluded.rating,review_count=excluded.review_count,updated_at=now()`, [plant.id,plant.name,plant.slug,plant.scientificName,plant.description,plant.setting,plant.lightRequirement,plant.waterRequirement,plant.difficulty,plant.petSafe,plant.careInstructions,plant.seoTitle,plant.seoDescription,plant.featured,plant.rating,plant.reviewCount]);
    await client.query(`INSERT INTO plant_categories (plant_id,category_id) SELECT $1,id FROM categories WHERE slug=$2 ON CONFLICT DO NOTHING`, [plant.id, categorySlug(plant.category)]);
    const image = plant.images[0];
    await client.query(`INSERT INTO plant_images (plant_id,image_url,thumbnail_url,mobile_url,webp_url,alt_text,sort_order) SELECT $1,$2,$3,$4,$5,$6,0 WHERE NOT EXISTS (SELECT 1 FROM plant_images WHERE plant_id=$1 AND sort_order=0)`, [plant.id,image.imageUrl,image.thumbnailUrl,image.mobileUrl,image.webpUrl,image.altText]);
    for (const variant of plant.variants) {
      await client.query(`INSERT INTO plant_variants (id,plant_id,name,sku,pot_size,plant_size,base_price,shipping_weight_grams,active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true) ON CONFLICT (id) DO UPDATE SET name=excluded.name,pot_size=excluded.pot_size,plant_size=excluded.plant_size,base_price=excluded.base_price,shipping_weight_grams=excluded.shipping_weight_grams,updated_at=now()`, [variant.id,plant.id,variant.name,`SIV-${plant.id}-${variant.name.replace(/\s+/g,'-').toUpperCase()}`,variant.potSize,variant.plantSize,variant.price,variant.shippingWeightGrams]);
      for (const inventory of plant.inventory) {
        const seller = sellers.find((item) => item.display_name === inventory.sellerName) ?? sellers[0];
        const sellerPlant = await client.query<{ id: string }>(`INSERT INTO seller_plants (seller_id,plant_id,plant_variant_id,seller_sku,active) VALUES ($1,$2,$3,$4,true) ON CONFLICT (seller_id,plant_variant_id) DO UPDATE SET active=true,updated_at=now() RETURNING id`, [seller.id,plant.id,variant.id,`${plant.id}-${variant.id}-${seller.id.slice(0,6)}`]);
        const city = await client.query<{ id: string }>('SELECT id FROM cities WHERE slug=$1', [inventory.citySlug]);
        await client.query(`INSERT INTO inventory (seller_plant_id,city_id,stock,delivery_days,delivery_fee) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (seller_plant_id,city_id) DO UPDATE SET stock=excluded.stock,delivery_days=excluded.delivery_days,delivery_fee=excluded.delivery_fee,updated_at=now()`, [sellerPlant.rows[0].id,city.rows[0].id,inventory.stock,inventory.deliveryDays,inventory.deliveryFee]);
        await client.query(`INSERT INTO prices (plant_variant_id,seller_id,city_id,price,sale_price,promotional_price,currency,starts_at) SELECT $1,$2,$3,$4,$5,$6,'INR',now() WHERE NOT EXISTS (SELECT 1 FROM prices WHERE plant_variant_id=$1 AND seller_id=$2 AND city_id=$3 AND ends_at IS NULL)`, [variant.id,seller.id,city.rows[0].id,Math.round(inventory.price*(variant.price/plant.basePrice)),inventory.salePrice ? Math.round(inventory.salePrice*(variant.price/plant.basePrice)) : null,inventory.promotionalPrice ? Math.round(inventory.promotionalPrice*(variant.price/plant.basePrice)) : null]);
      }
    }
  }
  await client.query(`INSERT INTO coupons (code,discount_type,discount_value,min_order_amount,max_discount,starts_at,ends_at,active) VALUES ('GROW10','percentage',10,299,500,now(),now()+interval '1 year',true) ON CONFLICT (code) DO UPDATE SET active=true,ends_at=excluded.ends_at`);
  await client.query('COMMIT');
  console.info(`Seeded ${plants.length} plants, ${cities.length} cities and ${sellers.length} sellers.`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
