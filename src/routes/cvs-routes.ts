import e, { Request, Response } from "express";

const csvRouter = e.Router();

csvRouter.get("/", (req: Request, res: Response) => {
  console.log(req.body)
  res.send("Hello World!");
})
export default csvRouter;
