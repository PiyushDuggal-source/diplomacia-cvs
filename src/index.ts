import app from "./app";
import * as dotenv from "dotenv";
import { connectToDB } from "./utils/db";
import axios from "axios";

// dotenv.config();

dotenv.config({
  path: "./.env",
});

const intervalId = setInterval(async () => {
  // await axios.get("https://diplomacia-cvs.onrender.com/ping");
  console.log("[SERVER] Pinged server");
}, 4.5 * 60 * 1000); // every 4.5 minutes

const port = process.env.PORT || 3005;

connectToDB()

app.listen(port, () => {
  console.log(`Diplomacia CVS listening on port ${port}`);
});
