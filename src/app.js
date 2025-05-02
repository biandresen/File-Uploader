import express from "express";
import "dotenv/config";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import passport from "./utils/passportConfig.js";
import authRouter from "./routes/authRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET, // use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
      // httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.all("*", (req, res) => {
  res.render("layout");
});

app.listen(port, () => {
  console.log(`Server running in *${process.env.NODE_ENV}* mode on port ${port}...`);
});
