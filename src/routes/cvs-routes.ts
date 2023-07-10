import e, { Request, Response } from "express";
import { CertificateRes } from "../types";
import { handleCreateCert } from "../controllers/cvs-controller";

const cvsRouter = e.Router();

cvsRouter.post(
  "/",
  async (req: Request<{}, {}, CertificateRes>, res: Response) => {
    const certData = await handleCreateCert(req.body);
    if (!certData) {
      res.status(500).json({
        certData: undefined,
        error: "Certificate not created",
      });
      return;
    }
    res.json({
      certData,
    });
  }
);
export default cvsRouter;
