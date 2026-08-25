import { Router } from 'express';
import { z } from 'zod';
import { requireDatabase } from '../../db.js';
import { authenticate } from '../../middleware/auth.js';

export const wishlistRouter = Router();
wishlistRouter.use(authenticate);
wishlistRouter.get('/', async (request, response) => { const result = await requireDatabase().query('SELECT p.id, p.name, p.slug, wi.created_at FROM wishlists w JOIN wishlist_items wi ON wi.wishlist_id = w.id JOIN plants p ON p.id = wi.plant_id WHERE w.user_id = $1 ORDER BY wi.created_at DESC', [request.user!.id]); return response.json({ data: result.rows }); });
wishlistRouter.post('/items', async (request, response) => { const { plantId } = z.object({ plantId: z.string().uuid() }).parse(request.body); const db = requireDatabase(); await db.query(`WITH w AS (INSERT INTO wishlists (user_id, name) VALUES ($1, 'My plants') ON CONFLICT (user_id) DO UPDATE SET updated_at = now() RETURNING id) INSERT INTO wishlist_items (wishlist_id, plant_id) SELECT id, $2 FROM w ON CONFLICT DO NOTHING`, [request.user!.id, plantId]); return response.status(201).json({ data: { plantId } }); });
wishlistRouter.delete('/items/:plantId', async (request, response) => { await requireDatabase().query('DELETE FROM wishlist_items USING wishlists WHERE wishlist_items.wishlist_id = wishlists.id AND wishlists.user_id = $1 AND wishlist_items.plant_id = $2', [request.user!.id, request.params.plantId]); return response.status(204).end(); });
