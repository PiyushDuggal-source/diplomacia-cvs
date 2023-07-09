import mongoose from "mongoose";

export const connectToDB = async () => {
  const DBurl = process.env.DB_URL || "mongodb://localhost:27017/cvs-service";

  try {
    await mongoose.connect(DBurl);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB");
    process.exit(1);
  }
};
