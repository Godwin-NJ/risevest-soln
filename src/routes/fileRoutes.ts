import express from "express";
const fileRouter = express.Router();
const {
  uploadFile,
  uploadUserDeatils,
  allUserInfo,
  updateAndDeleteUnsafeFile,
} = require("../controllers/fileupload");
const { authorizationMD } = require("../Middleware/userLoginMiddleware");

fileRouter
  .route("/")
  .get(authorizationMD(["admin"]), allUserInfo)
  .post(uploadFile);
fileRouter.route("/:folderName?").post(uploadFile);
fileRouter.route("/information").post(uploadUserDeatils);
fileRouter
  .route("/markUnsafe")
  .put(authorizationMD(["admin"]), updateAndDeleteUnsafeFile);

module.exports = fileRouter;
