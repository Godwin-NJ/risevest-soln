import express from "express";
const downLoadRouter = express.Router();
const { downloadFile } = require("../controllers/fileupload");

downLoadRouter.route("/file/:id").get(downloadFile);

module.exports = downLoadRouter;
