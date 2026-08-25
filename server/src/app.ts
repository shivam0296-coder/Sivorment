import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config } from './config.js';
import { errorHandler, notFound } from './middleware/error.js';
import { adminRouter } from './modules/admin/routes.js';
import { authRouter } from './modules/auth/routes.js';
import { cartRouter } from './modules/cart/routes.js';
import { ordersRouter } from './modules/orders/routes.js';
import { paymentsRouter } from './modules/payments/routes.js';
import { plantsRouter } from './modules/plants/routes.js';
import { recommendationsRouter } from './modules/recommendations/routes.js';
import { sellerRouter } from './modules/seller/routes.js';
import { wishlistRouter } from './modules/wishlist/routes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.corsOrigin.split(',').map((value) => value.trim()), credentials: true }));
  app.use('/api/payments/webhook/razorpay', express.raw({ type: 'application/json', limit: '256kb' }));
  app.use(express.json({ limit: '1mb' }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'sivorment-api', timestamp: new Date().toISOString() }));
  app.use('/api/auth', authRouter);
  app.use('/api/plants', plantsRouter);
  app.use('/api/recommendations', recommendationsRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/seller', sellerRouter);
  app.use('/api/admin', adminRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
