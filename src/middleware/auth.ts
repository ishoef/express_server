import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      console.log({ authToken });
      if (!authToken) {
        return res.status(500).json({
          message: "You are not allowed, bad request",
        });
      }

      const decodedToken = jwt.verify(
        authToken,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log(decodedToken);
      req.user = decodedToken;

      // Role checking
      if (roles.length && !roles.includes(decodedToken.role as string)) {
        return res.status(500).json({
          error: "unauthorized!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
      console.log(`${err.message}`);
    }
  };
};

export default auth;
