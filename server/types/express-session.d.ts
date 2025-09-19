import 'express-session';

declare module 'express-session' {
  interface SessionData {
    guestCart: Array<{
      id: string;
      productId: string;
      quantity: number;
      createdAt: Date;
    }>;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}