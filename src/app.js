import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`Server running in *${process.env.NODE_ENV}* mode on port ${port}...`);
});
