import { Router } from 'express';
import { z } from 'zod';
import { priceCart } from '../../../../lib/catalogue-service.js';

const schema = z.object({ city: z.string().min(2), couponCode: z.string().max(32).optional(), items: z.array(z.object({ plantId: z.string(), variantId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1).max(50) });
export const cartRouter = Router();
cartRouter.post('/price', (request, response) => { const input = schema.parse(request.body); return response.json({ data: priceCart(input.items, input.city, input.couponCode) }); });
