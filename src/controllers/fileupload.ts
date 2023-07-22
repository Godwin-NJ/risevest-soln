import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
const path = require("path");
// const fileUpload = require("express-fileupload");

//upload file >>>> payload {name of file , file its-self , file-size}
const uploadFile = async (req: Request, res: Response) => {
  //   let vestFile;
  //   let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const vestFile = req.files.file as fileUpload.UploadedFile;
  const filePath = path.join(__dirname, "../public/" + `${vestFile.name}`);
  await vestFile.mv(filePath, function (err) {
    if (err) return res.status(500).send(err);
    // console.log({ filePath });
    res.send("File uploaded!");
  });
};
//show all files uploaded

module.exports = {
  uploadFile,
};
