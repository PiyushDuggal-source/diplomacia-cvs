import e from "express";
import loginRouter from "./login-routes";

const router = e.Router();

router.use("/", loginRouter);

export default router;
