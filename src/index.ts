import app from "./app";
import * as dotenv from "dotenv";
import { connectToDB } from "./utils/db";
dotenv.config();

const port = process.env.PORT || 3005;

connectToDB()

app.listen(port, () => {
  console.log(`Diplomacia CVS listening on port ${port}`);
});
