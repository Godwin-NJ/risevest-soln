require("dotenv").config();
import express, { Request, Response, Application } from "express";
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user");
const fileRouter = require("./routes/fileRoutes");
const downLoadRouter = require("./routes/downLoadRouter");
const fileUpload = require("express-fileupload");
const { v2: cloudinary } = require("cloudinary");
const RedisStore = require("connect-redis").default;
const session = require("express-session");
const Redis = require("ioredis");
const redisIo = new Redis();

const { authentication } = require("./Middleware/userLoginMiddleware");

//redis store & client setup
redisIo
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err: { message: string }) => {
    console.log(err.message);
  });
// Initialize store.
let redisStore = new RedisStore({
  client: redisIo,
  prefix: "risevest-app:",
});

// middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.REDIS_SECRET,
    name: "sessionId",
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 20, // session max age in miliseconds
    },
  })
);
// setting up cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//this informs user that server is active and up
app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({ alive: true });
});

// route middlware
app.use("/api/v1/user", userRoute);
app.use("/api/v1/upload", authentication, fileRouter); // added the authorization middleware
app.use("/api/v1/download", authentication, downLoadRouter); // added the authorization middleware

module.exports = { app, redisIo };
