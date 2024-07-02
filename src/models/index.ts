import mongoose, { Schema, Document } from 'mongoose';
import { CertificateType } from "../types";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 8 });
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



export interface User extends Document {
  email: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  refreshToken: string;
  
}
const UserSchema: Schema<User> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  },
  refreshToken: {
    type: String,
    default: "",
  },


});
UserSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  // this.password = await bcrypt.hash(this.password, 10)
  

  next()
})

UserSchema.methods.isPasswordCorrect = async function(password: string){
  return  password===this.password;
}

UserSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
UserSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

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



