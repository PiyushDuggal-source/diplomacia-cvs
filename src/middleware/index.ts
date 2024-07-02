// import { NextFunction, Request, Response } from "express";

// export const checkAPI = (req: Request, res: Response, next: NextFunction) => {
//   console.log("\nEntering checkAPI");
//   if (req.headers["x-diplo-api"] !== process.env.DIPLO_API_KEY) {
//     res.status(401).send("Unauthorized");
//     return;
//   }
//   next();
//   console.log("Leaving checkAPI\n");
// };



import { Request as ExpressRequest, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models";

// Define a custom interface extending Express's Request interface
interface Request extends ExpressRequest {
  user?: User; // This allows us to add 'user' property to Request
}

interface DecodedToken {
  _id: string;
  iat: number;
  exp: number;
}

export const checkAPI = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedToken;

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Assign user to req object
    req.user = user;

    // console.log(user); // Logging user for debugging

    next(); // Move to the next middleware
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
