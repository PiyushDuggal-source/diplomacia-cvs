// import mongoose from "mongoose";

// export const connectToDB = async () => {
//   const DBurl = process.env.DB_URL || "mongodb://localhost:27017/cvs-service";

//   try {
//     await mongoose.connect(DBurl);
//     console.log("Connected to DB");
//   } catch (error) {
//     console.log("Error connecting to DB");
//     process.exit(1);
//   }
// };



import mongoose, { Mongoose } from "mongoose";

/** @type {Mongoose | undefined} */
export let dbInstance: Mongoose | undefined = undefined;

export const connectToDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL || "mongodb://localhost:27017/cvs-service"}`
    );
    dbInstance = connectionInstance;
    console.log(
      `\nMongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};


