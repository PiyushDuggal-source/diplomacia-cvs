import e from "express";
import { loginUser } from "./login-routes";

const router = e.Router();

router.use("/",loginUser);

export default router;
