import { ok } from "assert";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
const pool = require("../db");
const path = require("path");
const {
  createUserInfo,
  showAllUserInfo,
  getFileById,
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
  });
  // console.log("result", result);
  fs.unlinkSync(vestFile.tempFilePath);
  res.status(200).json({ image: { src: result.secure_url } });
};
// attach image to a product >>> User nationality

const userNationality = async (req: Request, res: Response) => {
  const { name, image, country } = req.body;

  if (!name || !image || !country) {
    return res.status(400).send("incomplete user information");
  }

  const fileName = name.split(" ").join("-");

  const userInfo = await pool.query(createUserInfo, [fileName, image, country]);
  if (!userInfo) {
    return res.status(400).send("error creating user");
  }
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

  const downloadImageurl = findUser.rows[0].image;
  console.log("downloadImageurl", downloadImageurl);
  try {
    // downloadUrlFileWIthAxios(downloadImageurl); //with axios
    const fileImage = await downloadingFileUsingCloudinary(
      downloadImageurl,
      res
    );
    console.log("fileImage", fileImage);
    res.status(200).json(fileImage);

    //  const imageFile =
  } catch (error: any) {
    res.status(400).send("Download failed");
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

module.exports = {
  uploadFile,
  userNationality,
  allUserInfo,
  downloadFile,
};
