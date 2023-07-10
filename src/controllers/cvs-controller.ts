import { createCertificate } from "../actions/cvs-action";
import { CertificateRes } from "../types";

export const handleCreateCert = async (certBody: CertificateRes) => {
  console.log("\nEntering handleCreateCert");
  const qrCodeSlang = await createCertificate(certBody);

  if (!qrCodeSlang) {
    console.log(`Certificate not created for ${certBody.name}`);
    return undefined;
  }

  const certUrl = `https://localhost:3000/certificates/${qrCodeSlang}`;
  console.log(`Certificate created for ${certBody.name} at ${certUrl}`);

  console.log("Leaving handleCreateCert\n");
  return certUrl;
};
