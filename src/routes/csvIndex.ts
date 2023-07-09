import e from "express";
import csvRouter from "./cvs-routes";

const router = e.Router();

router.use("/", csvRouter);

export default router;
