import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
    };
  }
}




declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
