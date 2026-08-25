import { Router } from 'express';
import { z } from 'zod';
import { requireDatabase } from '../../db.js';
import { authenticate, authorize } from '../../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(authenticate, authorize('admin'));
adminRouter.get('/overview', async (_request, response) => {
  const result = await requireDatabase().query(`SELECT (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL)::int AS users, (SELECT COUNT(*) FROM plants WHERE active)::int AS plants, (SELECT COUNT(*) FROM sellers WHERE status='approved')::int AS sellers, (SELECT COUNT(*) FROM orders)::int AS orders, (SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE status IN ('paid','processing','shipped','delivered'))::int AS gross_sales`);
  return response.json({ data: result.rows[0] });
});
adminRouter.patch('/plants/:plantId', async (request, response) => {
  const input = z.object({ name: z.string().min(2).max(120).optional(), description: z.string().min(20).optional(), featured: z.boolean().optional(), active: z.boolean().optional() }).parse(request.body);
  const result = await requireDatabase().query('UPDATE plants SET name=COALESCE($1,name), description=COALESCE($2,description), featured=COALESCE($3,featured), active=COALESCE($4,active), updated_at=now() WHERE id=$5 RETURNING id,name,slug,featured,active', [input.name, input.description, input.featured, input.active, request.params.plantId]);
  if (!result.rows[0]) return response.status(404).json({ error: { code: 'PLANT_NOT_FOUND', message: 'Plant not found.' } });
  return response.json({ data: result.rows[0] });
});
adminRouter.patch('/sellers/:sellerId/status', async (request, response) => { const { status } = z.object({ status: z.enum(['pending','approved','suspended']) }).parse(request.body); const result = await requireDatabase().query('UPDATE sellers SET status=$1, approved_at=CASE WHEN $1=\'approved\' THEN now() ELSE approved_at END, updated_at=now() WHERE id=$2 RETURNING id,display_name,status', [status, request.params.sellerId]); return response.json({ data: result.rows[0] }); });
adminRouter.patch('/orders/:orderId/status', async (request, response) => { const { status } = z.object({ status: z.enum(['paid','processing','shipped','delivered','cancelled','refunded']) }).parse(request.body); const result = await requireDatabase().query('UPDATE orders SET status=$1, updated_at=now() WHERE id=$2 RETURNING id,order_number,status', [status, request.params.orderId]); return response.json({ data: result.rows[0] }); });
adminRouter.post('/coupons', async (request, response) => { const input = z.object({ code: z.string().min(3).max(32).transform((value)=>value.toUpperCase()), discountType: z.enum(['percentage','fixed']), discountValue: z.number().positive(), minOrderAmount: z.number().nonnegative().default(0), startsAt: z.iso.datetime(), endsAt: z.iso.datetime() }).parse(request.body); const result = await requireDatabase().query('INSERT INTO coupons (code,discount_type,discount_value,min_order_amount,starts_at,ends_at,active) VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING *', [input.code,input.discountType,input.discountValue,input.minOrderAmount,input.startsAt,input.endsAt]); return response.status(201).json({ data: result.rows[0] }); });
