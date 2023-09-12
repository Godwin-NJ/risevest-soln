import express from "express";
const fileRouter = express.Router();
const {
  uploadFile,
  userNationality,
  allUserInfo,
} = require("../controllers/fileupload");

fileRouter.route("/").get(allUserInfo).post(uploadFile);
fileRouter.route("/information").post(userNationality);

module.exports = fileRouter;
