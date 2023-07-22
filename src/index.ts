require("dotenv").config();
import express, { Request, Response, Application } from "express";
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user");
const fileRouter = require("./routes/fileRoutes");
const fileUpload = require("express-fileupload");

// middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("./public"));

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});

// route middlware
app.use("/api/v1/user", userRoute);
app.use("/api/v1/upload", fileRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
