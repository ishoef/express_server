import { NextFunction, Request, Response } from "express";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    console.log("i am clickd");
    console.log(req.body);
    console.log(req.headers);
    next();
  };
};

export default auth;
