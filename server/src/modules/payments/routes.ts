import { createHmac, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { config } from '../../config.js';

export const paymentsRouter = Router();
paymentsRouter.get('/methods', (_request, response) => response.json({ data: { currency: 'INR', providers: [{ id: 'razorpay', methods: ['upi', 'card'], configured: Boolean(config.paymentKey && config.paymentSecret) }] } }));
paymentsRouter.post('/webhook/razorpay', (request, response) => {
  if (!config.paymentSecret) return response.status(503).json({ error: { code: 'PAYMENT_NOT_CONFIGURED', message: 'Payment webhook is not configured.' } });
  const signature = request.headers['x-razorpay-signature'];
  if (typeof signature !== 'string') return response.status(401).end();
  const rawBody = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body));
  const expected = createHmac('sha256', config.paymentSecret).update(rawBody).digest('hex');
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return response.status(401).end();
  return response.status(202).json({ data: { accepted: true } });
});
