import { createCertificate } from "../actions/cvs-action";
import { Certificate } from "../models";
import { CertificateRes } from "../types";

export const handleCreateCert = async (certBody: CertificateRes) => {
  console.log("\nEntering handleCreateCert");
  const qrCodeSlang = await createCertificate(certBody);

  if (!qrCodeSlang) {
    console.log(`Certificate not created for ${certBody.name}`);
    return undefined;
  }

  const certUrl = `https://localhost:3000/certificates/${qrCodeSlang.qrCodeSlang}`;
  console.log(`Certificate created for ${certBody.name} at ${certUrl}`);

  console.log("Leaving handleCreateCert\n");
  return {
    qrCodeUrl: certUrl,
    name: qrCodeSlang.name,
  };
};

export const handleGetCert = async (qrCodeSlang: string) => {
  console.log("\nEntering handleGetCert");
  const certificate = await Certificate.findOne({
    qrCodeSlang: qrCodeSlang,
  });

  if(!certificate) {
    console.log(`Certificate not found for ${qrCodeSlang}`);
    return undefined;
  }
  console.log("Leaving handleGetCert\n");
  return certificate;
};
