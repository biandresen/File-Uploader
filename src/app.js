import express from "express";
import "dotenv/config";
import authRouter from "./routes/authRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.all("*", (req, res) => {
  res.render("layout");
});

app.listen(port, () => {
  console.log(`Server running in *${process.env.NODE_ENV}* mode on port ${port}...`);
});
