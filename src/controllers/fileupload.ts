import { ok } from "assert";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
const pool = require("../db");
const path = require("path");
const {
  createUserInfo,
  showAllUserInfo,
  getFileById,
  markFilesUnsafe,
  updateToUnsafe,
  deleteFile,
} = require("../queries/fileUploadNInfo");
const {
  download,
  downloadUrlFileWIthAxios,
  downloadingFileUsingCloudinary,
} = require("../utilities");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

//upload file >>>> payload {name of file , file its-self , file-size}
const uploadFileLOcal = async (req: Request, res: Response) => {
  //   let vestFile;
  //   let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  // console.log(req.files.file);
  const vestFile = req.files.file as fileUpload.UploadedFile;
  if (!vestFile.mimetype.startsWith("image")) {
    return res.status(400).send("Please upload an image");
  }

  const maxSize = 200 * (1024 * 1024); // this equivalent to 200mb

  if (vestFile.size > maxSize) {
    return res.send("Please upload image not bigger than 200mb");
  }

  const filePath = path.join(
    __dirname,
    "../public/uploads/" + `${vestFile.name}`
  );
  await vestFile.mv(filePath, function (err) {
    if (err) return res.status(500).send(err);
    // console.log({ filePath });
    res.status(200).json({ image: { src: `/uploads/${vestFile.name}` } });
  });
};

const uploadFile = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.send("Empty File");
  }

  const vestFile = req.files.file as unknown as fileUpload.UploadedFile;

  const maxSize = 200 * (1024 * 1024); // this equivalent to 200mb
  //venting file size
  if (vestFile.size > maxSize) {
    res.status(400).send("File should not be bigger than 200mb");
    return;
  }
  // console.log(req.params.folderName);
  // console.log(req.params);
  // const { folderName } = req.params;
  // console.log("folderName", folderName);
  const result = await cloudinary.uploader.upload(vestFile.tempFilePath, {
    use_filename: true,
    folder:
      !req.params || Object.keys(req.params).length === 0
        ? "risevest"
        : req.params.folderName,
    // folder: `${folderName} ? ${folderName} : risevest`,
    // transformation: [{ quality: "auto" }],
  });
  // console.log("result", result);
  fs.unlinkSync(vestFile.tempFilePath);
  res.status(200).json({ image: { src: result.secure_url } });
};
// attach image to a product >>> User nationality

const uploadUserDeatils = async (req: Request, res: Response) => {
  const { name, filepath, country } = req.body;
  console.log(req.body);

  if (!name || !filepath || !country) {
    return res.status(400).send("incomplete user information");
  }

  const fileName = name.split(" ").join("-");

  const userInfo = await pool.query(createUserInfo, [
    fileName,
    filepath,
    country,
  ]);
  console.log(userInfo, "userInfo");
  if (!userInfo) {
    return res.status(400).send("error creating user");
  }
  console.log({ userInfo });
  res.status(200).json("user information created");
};

const allUserInfo = async (req: Request, res: Response) => {
  const info = await pool.query(showAllUserInfo);
  res.status(200).json(info.rows);
};

const downloadFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const findUser = await pool.query(getFileById, [id]);
  if (!findUser) {
    return res.status(400).json("user not found");
  }

  const downloadFileurl = findUser.rows[0].filepath;
  // console.log("downloadImageurl", downloadImageurl);
  try {
    //with axios and read / write streams ( using FS module)
    downloadUrlFileWIthAxios(downloadFileurl, res);

    //Using cloduinary
    // const fileImage = await downloadingFileUsingCloudinary(
    //   downloadFileurl,
    //   res
    // );
    // console.log("fileImage", fileImage);
    // res.status(200).json(fileImage);

    //  const imageFile =
  } catch (error: any) {
    // console.log("fileImage", error);
    res.status(400).send(`Download failed with error : ${error}`);
  }
  // if (downloadImage) {
  //   const downloadFile = await download(downloadImage);
  //   if (downloadFile) {
  //     res.status(200).json("download successful ");
  //   }
  // }

  // res.status(200).json(findUser.rows);
  // console.log({ downloadImage });
  // res.download(`${downloadImage}, ${downloadImageName}`);
  // res.download(`${downloadImage}, ${downloadImageName}`, function (err) {
  //   if (err) {
  //     console.log(err);
  //     // res.status(400).send("err downloading image");
  //   }
  //   console.log("image downloaded");
  //   // res.status(200).json("image downloaded");
  // });
};

const updateAndDeleteUnsafeFile = async (req: Request, res: Response) => {
  // the payload will be an array of files marked as unsafe and will be deleted subsequetly
  // string[] as payload
  const ids = req.body;

  const findFiles = await pool.query(markFilesUnsafe, [ids]);

  if (!findFiles) {
    res.status(400).send("Files does not exist");
  }

  const selectedIds = await findFiles.rows.map((item: any) => item.userid);
  const updateIsSafeColumn = await pool.query(updateToUnsafe, [selectedIds]);
  if (!updateIsSafeColumn) {
    res.status(400).send("Error Updating row(s)");
  }
  const deleteUnsafeFile = await pool.query(deleteFile, [selectedIds]);
  if (!deleteUnsafeFile) {
    res.status(400).json("error deleting ");
  }

  res
    .status(200)
    .json(`${deleteUnsafeFile.rowCount} item(s) updated and deleted`);
  // res.status(200).json(updateIsSafeColumn.rowCount);
};

// FILE HISTORY >>>> fs.watch is not the right soln to get file history , inquire on what's best
const fileHistory = async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const file = await pool.query(getFileById, [fileId]);
  const { userid, name, filepath } = file;
  // const watchFile = fs.watch(filepath, (eventType:string, filename:string)=> {

  // })
};

module.exports = {
  uploadFile,
  uploadUserDeatils,
  allUserInfo,
  downloadFile,
  updateAndDeleteUnsafeFile,
};
