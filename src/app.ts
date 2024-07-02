import e from "express";
import dotenv from "dotenv";
import cvsRouter from "./routes/csvIndex";
import loginRouter from "./routes/loginIndex";
import pingRoute from "./routes/pingRoute";
import { checkAPI } from "./middleware";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const app = e();

const DB_URL = process.env.DB_URL;

const store = MongoStore.create({
  mongoUrl: DB_URL,
  ttl: 1000 * 60 * 60 * 24 * 1, // 1 day
  collectionName: "cookieSessions",
  autoRemove: "interval",
});
// cookie parser middleware
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keepSummerSafe",
    resave: true,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    },

    store: store,
  }),
);
const allowedOrigins = [
  "https://localhost:3000",
  "https://iitmdiplomacia.in",
  "https://www.iitmdiplomacia.in",
];
app.use(
  cors({
    credentials: true,
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(checkAPI);
app.use("/", pingRoute);
// adding login temporarily here
app.use("/", loginRouter);
app.use("/cvs-service/api", cvsRouter);

export default app;
