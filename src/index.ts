require("dotenv").config();
import express, { Request, Response, Application } from "express";
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user");
const fileRouter = require("./routes/fileRoutes");
const downLoadRouter = require("./routes/downLoadRouter");
const fileUpload = require("express-fileupload");
const { v2: cloudinary } = require("cloudinary");

// middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

// setting up cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});

// route middlware
app.use("/api/v1/user", userRoute);
app.use("/api/v1/upload", fileRouter);
app.use("/api/v1/download", downLoadRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
