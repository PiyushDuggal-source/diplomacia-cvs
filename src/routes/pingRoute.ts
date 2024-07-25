import e, { Request, Response } from "express";

const router = e.Router();

router.get("/ping", (req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
});

export default router;
