import { CertificateRes } from "../types";
import { Certificate } from "../models";

export const createCertificate = async (
  certData: CertificateRes
): Promise<string | undefined> => {
  console.log("\nEntering createCertificate");
  const certificate = await Certificate.create({
    name: certData.name,
    date: certData.date,
    event: certData.event,
    description: certData.description,
    image: certData.image,
  });

  if (!certificate) {
    console.log(`Certificate not created for ${certData.name}`);
    return undefined;
  }

  console.log("Leaving createCertificate\n");
  return certificate.qrCodeSlang;
};
