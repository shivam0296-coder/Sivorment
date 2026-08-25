import { Router } from 'express';
import { z } from 'zod';
import { config } from '../../config.js';
import { requireDatabase } from '../../db.js';
import { authenticate, authorize } from '../../middleware/auth.js';

export const sellerRouter = Router();
sellerRouter.post('/apply', authenticate, async (request, response) => {
  const input = z.object({ displayName: z.string().min(2).max(100), legalName: z.string().min(2).max(160), phone: z.string().min(8).max(20), gstin: z.string().max(20).optional() }).parse(request.body);
  const db = requireDatabase();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO sellers (user_id,display_name,legal_name,phone,gstin,status) VALUES ($1,$2,$3,$4,$5,\'pending\') ON CONFLICT (user_id) DO UPDATE SET display_name=excluded.display_name,legal_name=excluded.legal_name,phone=excluded.phone,gstin=excluded.gstin,updated_at=now() RETURNING id,display_name,status', [request.user!.id,input.displayName,input.legalName,input.phone,input.gstin]);
    await client.query(`UPDATE users SET role_id=(SELECT id FROM roles WHERE name='seller'),updated_at=now() WHERE id=$1`, [request.user!.id]);
    await client.query('COMMIT');
    return response.status(201).json({ data: result.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
});
sellerRouter.use(authenticate, authorize('seller', 'admin'));
sellerRouter.get('/dashboard', async (request, response) => {
  const result = await requireDatabase().query(`SELECT COUNT(DISTINCT sp.plant_id)::int AS plants, COALESCE(SUM(i.stock),0)::int AS stock, COUNT(DISTINCT o.id)::int AS active_orders, COALESCE(SUM(oi.line_total) FILTER (WHERE o.status IN ('paid','processing','shipped','delivered')),0)::int AS sales FROM sellers s LEFT JOIN seller_plants sp ON sp.seller_id=s.id LEFT JOIN inventory i ON i.seller_plant_id=sp.id LEFT JOIN order_items oi ON oi.seller_id=s.id LEFT JOIN orders o ON o.id=oi.order_id AND o.status NOT IN ('cancelled','refunded') WHERE s.user_id=$1`, [request.user!.id]);
  return response.json({ data: result.rows[0] });
});
sellerRouter.post('/profile', async (request, response) => {
  const input = z.object({ displayName: z.string().min(2).max(100), legalName: z.string().min(2).max(160), phone: z.string().min(8).max(20), gstin: z.string().max(20).optional() }).parse(request.body);
  const result = await requireDatabase().query('INSERT INTO sellers (user_id, display_name, legal_name, phone, gstin, status) VALUES ($1,$2,$3,$4,$5,\'pending\') ON CONFLICT (user_id) DO UPDATE SET display_name=$2, legal_name=$3, phone=$4, gstin=$5, updated_at=now() RETURNING id, display_name, status', [request.user!.id, input.displayName, input.legalName, input.phone, input.gstin]);
  return response.status(201).json({ data: result.rows[0] });
});
sellerRouter.put('/inventory/:inventoryId', async (request, response) => {
  const { stock, price, salePrice } = z.object({ stock: z.number().int().min(0), price: z.number().int().positive(), salePrice: z.number().int().positive().nullable().optional() }).parse(request.body);
  const result = await requireDatabase().query(`UPDATE inventory i SET stock=$1, updated_at=now() FROM seller_plants sp, sellers s WHERE i.id=$2 AND sp.id=i.seller_plant_id AND s.id=sp.seller_id AND (s.user_id=$3 OR $4='admin') RETURNING i.*`, [stock, request.params.inventoryId, request.user!.id, request.user!.role]);
  if (!result.rows[0]) return response.status(404).json({ error: { code: 'INVENTORY_NOT_FOUND', message: 'Inventory record not found.' } });
  await requireDatabase().query('INSERT INTO prices (plant_variant_id, seller_id, city_id, price, sale_price, currency, starts_at) SELECT sp.plant_variant_id, sp.seller_id, i.city_id, $1, $2, \'INR\', now() FROM inventory i JOIN seller_plants sp ON sp.id=i.seller_plant_id WHERE i.id=$3', [price, salePrice ?? null, request.params.inventoryId]);
  return response.json({ data: result.rows[0] });
});
sellerRouter.get('/orders', async (request, response) => { const result = await requireDatabase().query(`SELECT DISTINCT o.id,o.order_number,o.status,o.created_at FROM orders o JOIN order_items oi ON oi.order_id=o.id JOIN sellers s ON s.id=oi.seller_id WHERE s.user_id=$1 ORDER BY o.created_at DESC`, [request.user!.id]); return response.json({ data: result.rows }); });
sellerRouter.post('/images/presign', (request, response) => {
  z.object({ fileName: z.string().max(180), contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/avif']) }).parse(request.body);
  if (!process.env.STORAGE_URL || !process.env.STORAGE_ACCESS_KEY || !process.env.STORAGE_SECRET) return response.status(503).json({ error: { code: 'STORAGE_NOT_CONFIGURED', message: 'Seller image uploads require the configured object storage service.' } });
  return response.status(501).json({ error: { code: 'STORAGE_ADAPTER_REQUIRED', message: `Configure the signed-upload adapter for ${config.nodeEnv}.` } });
});
