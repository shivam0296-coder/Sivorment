const requiredInProduction = (name: string, fallback: string) => {
  const value = process.env[name];
  if (process.env.NODE_ENV === 'production' && !value) throw new Error(`${name} is required in production.`);
  return value ?? fallback;
};

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.API_PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: requiredInProduction('JWT_SECRET', 'development-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  paymentKey: process.env.PAYMENT_KEY,
  paymentSecret: process.env.PAYMENT_SECRET,
};
