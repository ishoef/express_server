import { NextFunction, Request, Response } from "express";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("i am clickd");
    console.log(req.body);
  };
};

export default auth;
