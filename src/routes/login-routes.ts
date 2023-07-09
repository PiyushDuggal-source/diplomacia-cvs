import e, { Request, Response } from "express";
import { User } from "../models";
import { checkPassword } from "../controllers/user-controller";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    session: string;
  }
}
const loginRouter = e.Router();

type RequestBody = {
  email: string;
  password: string;
};

loginRouter.post(
  "/login",
  async (req: Request<{}, {}, RequestBody>, res: Response) => {
    const { email, password } = req.body;
    console.log(`\nEntering loginRouter.post("/login") with email: ${email}`);
    const user = await User.findOne({ email, password });

    if (!user) {
      res.status(401).json({ success: false });
      return;
    }

    const checkPass = await checkPassword(email, password);
    if (!checkPass) {
      res.status(401).json({ success: false });
    }

    req.session.session = uuidv4();
    req.session.save();
    res.json({ success: true });
  }
);

loginRouter.get("/me", (req: Request, res: Response) => {
  if (req.session.session) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
export default loginRouter;
