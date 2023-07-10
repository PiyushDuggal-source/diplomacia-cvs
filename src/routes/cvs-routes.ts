import e, { Request, Response } from "express";
import { CertificateRes } from "../types";
import { handleCreateCert } from "../controllers/cvs-controller";

const cvsRouter = e.Router();

cvsRouter.post(
  "/",
  async (req: Request<{}, {}, CertificateRes>, res: Response) => {
    const certUrl = await handleCreateCert(req.body);
    if (!certUrl) {
      res.json({
        certUrl: "",
        error: "Certificate not created",
      });
      return;
    }
    res.json({
      certUrl,
    });
  }
);
export default cvsRouter;
