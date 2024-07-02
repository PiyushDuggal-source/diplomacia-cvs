import e, { Request, Response } from "express";
import { User } from "../models";
import { checkPassword } from "../controllers/user-controller";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

// declare module "express-session" {
//   export interface SessionData {
//     session: string;
//   }
// }
// const loginRouter = e.Router();

// type RequestBody = {
//   email: string;
//   password: string;
// };

// loginRouter.get("/me", (req: Request, res: Response) => {
//   if (req.session.session) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });

// loginRouter.post(
//   "/login",
//   async (req: Request<{}, {}, RequestBody>, res: Response) => {
//     const { email, password } = req.body;
//     console.log(`\nEntering loginRouter.post("/login") with email: ${email}`);
//     const user = await User.findOne({ email, password });

//     if (!user) {
//       res.status(401).json({ success: false });
//       return;
//     }

//     const checkPass = await checkPassword(email, password);
//     if (!checkPass) {
//       res.status(401).json({ success: false });
//     }

//     req.session.session = uuidv4();
//     req.session.save();
//     res.json({ success: true });
//   }
// );

// export default loginRouter;

const generateAccessAndRefreshTokens = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    if(!user) throw new ApiError(404, "User not found");
    // console.log(user)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(accessToken,refreshToken)
    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  

  // Compare the incoming password with hashed password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // get the user document ignoring the password and refreshToken field
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const saveuser=loggedInUser?.updateOne({ refreshToken:refreshToken })
  // console.log(saveuser)

  // TODO: Add more options to make cookie more secure and reliable
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
        "User logged in successfully"
      )
    );
});

export {loginUser};