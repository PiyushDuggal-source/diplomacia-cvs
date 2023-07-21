import e from "express";
import cvsRouter from "./routes/csvIndex";
import loginRouter from "./routes/loginIndex";
import { checkAPI } from "./middleware";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = e();

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/cvs-service";

const store = MongoStore.create({
  mongoUrl: DB_URL,
  ttl: 1000 * 60 * 60 * 24 * 1, // 1 day
  collectionName: "cookieSessions",
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
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      secure: true,
    },
    store: store,
  }),
);
const allowedOrigins = ["http://localhost:3000", "https://iitmdiplomacia.in"];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
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
// adding login temporarily here
app.use("/", loginRouter);
app.get("/", (_req, res) => {
  res.json({ success: true });
});
app.use("/cvs-service/api", cvsRouter);

export default app;
