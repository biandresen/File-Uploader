// 1. Load environment variables
import "dotenv/config";

// 2. Imports
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "./utils/passportConfig.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import prisma from "./db/client.js";

// 3. Routers and middleware
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import folderRouter from "./routes/folderRouter.js";
import fileRouter from "./routes/fileRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// 4. Init
const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins =
  process.env.NODE_ENV === "production" ?
    ["https://file-uploader-6ipm.onrender.com"]
  : ["http://localhost:3000"];

// 5. Security Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // needed if you're using sessions
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://res.cloudinary.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      mediaSrc: ["'self'", "https://res.cloudinary.com"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
  })
);

// 6. Body parsers and static
app.use(express.static("src/public"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// 7. Sessions
app.set("trust proxy", 1); // Required on Render (behind HTTPS proxy)

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// 8. Passport
app.use(passport.initialize());
app.use(passport.session());

// 9. Set view engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// 10. Routes
app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

// 11. Catch-all and error handler
app.all("*", (req, res) => {
  res.render("layout");
});

app.use(errorHandler);

// 12. Start server
app.listen(port, () => {
  console.log(`Server running in *${process.env.NODE_ENV}* mode on port ${port}...`);
});

// process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
// process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
// process.on("SIGTERM", exitHandler(0, "SIGTERM"));
// process.on("SIGINT", exitHandler(0, "SIGINT"));
