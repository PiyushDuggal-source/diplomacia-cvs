
export type CertificateRes = {
  name: string;
  date: Date;
  event: string;
  description?: string;
  image?: string;
};

export type CertificateType = CertificateRes & {
  qrCodeSlang: string;
};

