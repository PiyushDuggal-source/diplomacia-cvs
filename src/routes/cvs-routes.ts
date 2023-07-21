import e, { Request, Response } from "express";
import { CertificateRes } from "../types";
import { handleCreateCert, handleGetCert } from "../controllers/cvs-controller";

const cvsRouter = e.Router();

cvsRouter.get("/getcert", async (req: Request, res: Response) => {
  const { qrCodeSlang } = req.body;

  if (!qrCodeSlang) {
    res.status(500).json({
      certData: undefined,
      error: "Certificate not found",
    });
    return;
  }

  const certData = await handleGetCert(qrCodeSlang);

  if (!certData) {
    res.status(500).json({
      certData: undefined,
      error: "Certificate not found",
    });
    return;
  }

  res.json({
    certData,
  });
});

cvsRouter.post(
  "/createCert",
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
  },
);
export default cvsRouter;
