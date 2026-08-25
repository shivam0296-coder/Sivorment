import { Router } from 'express';
import { z } from 'zod';
import { priceCart } from '../../../../lib/catalogue-service.js';
import { requireDatabase } from '../../db.js';
import { authenticate } from '../../middleware/auth.js';

const orderSchema = z.object({ city: z.string(), addressId: z.string().uuid(), couponCode: z.string().optional(), paymentMethod: z.enum(['upi', 'card']), items: z.array(z.object({ plantId: z.string(), variantId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1) });
export const ordersRouter = Router();
ordersRouter.use(authenticate);
ordersRouter.get('/', async (request, response) => { const result = await requireDatabase().query('SELECT id, order_number, status, total_amount, currency, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100', [request.user!.id]); return response.json({ data: result.rows }); });
ordersRouter.post('/', async (request, response) => {
  const input = orderSchema.parse(request.body);
  const totals = priceCart(input.items, input.city, input.couponCode);
  const db = requireDatabase();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const city = await client.query<{ id: string }>('SELECT c.id FROM cities c JOIN addresses a ON a.city_id=c.id WHERE c.slug=$1 AND c.active=true AND a.id=$2 AND a.user_id=$3', [input.city, input.addressId, request.user!.id]);
    if (!city.rows[0]) throw Object.assign(new Error('Delivery city is unavailable.'), { status: 400, code: 'CITY_UNAVAILABLE' });
    const order = await client.query<{ id: string; order_number: string }>(`INSERT INTO orders (user_id, city_id, address_id, status, subtotal_amount, discount_amount, delivery_amount, tax_amount, total_amount, currency) VALUES ($1,$2,$3,'pending_payment',$4,$5,$6,$7,$8,'INR') RETURNING id, order_number`, [request.user!.id, city.rows[0].id, input.addressId, totals.subtotal, totals.discount, totals.delivery, totals.tax, totals.total]);
    for (const item of totals.items) await client.query('INSERT INTO order_items (order_id, plant_id, plant_variant_id, seller_id, product_name, variant_name, unit_price, quantity, line_total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [order.rows[0].id, item.plantId, item.variantId, item.sellerId, item.name, item.variant, item.unitPrice, item.quantity, item.lineTotal]);
    await client.query('COMMIT');
    return response.status(201).json({ data: { ...order.rows[0], totals, paymentStatus: 'provider_configuration_required' } });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
});
