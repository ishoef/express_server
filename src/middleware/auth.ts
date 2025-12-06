import { NextFunction, Request, Response } from "express";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("authToken", authHeader);
    next();
  };
};

export default auth;
