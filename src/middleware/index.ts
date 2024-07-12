import { NextFunction, Request, Response } from "express";

export const checkAPI = (req: Request, res: Response, next: NextFunction) => {
  console.log("\nEntering checkAPI");
  if (req.headers["x-diplo-api"] !== process.env.DIPLO_API_KEY) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
  console.log("Leaving checkAPI\n");
};
