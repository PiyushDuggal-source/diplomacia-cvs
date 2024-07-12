import mongoose from "mongoose";
import { CertificateType } from "../types";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 8 });

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  password: String,
});

const CertificateSchema = new Schema<CertificateType>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  event: { type: String, required: true },
  image: String,
  description: String,
  qrCodeSlang: { type: String, default: uid() },
});

export const User = mongoose.model("User", UserSchema);
export const Certificate = mongoose.model<CertificateType>(
  "Certificates",
  CertificateSchema
);
