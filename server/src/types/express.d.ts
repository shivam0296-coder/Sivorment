declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'customer' | 'seller' | 'admin'; email: string };
    }
  }
}

export {};
