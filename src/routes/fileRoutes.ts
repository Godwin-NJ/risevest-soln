const express = require("express");
const fileRouter = express.Router();
const { uploadFile } = require("../controllers/fileupload");

fileRouter.route("/").post(uploadFile);

module.exports = fileRouter;
