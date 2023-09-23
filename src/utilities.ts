import fs, { PathLike, WriteStream } from "fs";
import https from "https";
import http from "http";
import { basename } from "path";
import { URL } from "url";
import { promises } from "dns";
const axios = require("axios");
import express, { Response } from "express";
const { v2: cloudinary } = require("cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TIMEOUT = 100000;
interface tokenPayload {
  email: string;
  fullname: string;
  role: string[];
}

function download(url: string, dest: string) {
  const uri = new URL(url);
  if (!dest) {
    dest = basename(uri.pathname);
    // console.log("dest", dest);
  }
  const pkg = url.toLowerCase().startsWith("https:") ? https : http;
  // console.log("uri", uri);
  // console.log("dest", dest);
  // console.log("pkg", pkg);

  return new Promise<void>((resolve, reject) => {
    // console.log(uri.href);
    const request = pkg.get(uri.href).on("response", (res) => {
      if (res.statusCode === 200) {
        // console.log("is 200 status ");
        const file = fs.createWriteStream(dest, { flags: "wx" });
        // console.log(file, "b4-pipe-file");
        // res.pipe(file);
        // console.log("after res.pipe", file);
        res
          .on("end", () => {
            file.end();
            // console.log(`'uri-pathname',${uri.pathname}`);
            resolve();
          })
          .on("error", (err) => {
            // console.log("res-error", err);
            file.destroy();
            fs.unlink(dest, () => reject(err));
          })
          .pipe(file);
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        // Recursively follow redirects, only a 200 will resolve.
        // console.log({ res });
        // console.log("is 302 status ");
        download(res.headers.location!, dest).then(() => resolve());
      } else {
        // console.log("got here >> else");
        reject(
          new Error(
            `Download request failed, response status: ${res.statusCode} ${res.statusMessage}`
          )
        );
      }
    });
    request.setTimeout(TIMEOUT, function () {
      request.abort();
      reject(new Error(`Request timeout after ${TIMEOUT / 1000.0}s`));
    });
  });
}

const downloadUrlFileWIthAxios = async (
  url: string,
  res: Response,
  dest?: string | PathLike
) => {
  const uri = new URL(url);
  if (!dest) {
    dest = basename(uri.pathname);
  }
  const pkg = url.toLowerCase().startsWith("https:") ? https : http;

  return new Promise<void>(async (resolve, reject) => {
    const response_stream = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    const file = fs.createWriteStream(dest as any as PathLike, {
      flags: "wx",
    });
    // console.log("file", file);
    file.on("error", (err: any) => {
      //extend the make err.code in the error type( typescript)
      if (err.code === "EEXIST") {
        res.status(302).json("file already exist");
      }
    });

    response_stream.data
      .on("end", () => {
        file.end();
        res.status(200).json(file.path);
        // console.log(file, "file-written-into-file-end");
        resolve();
      })
      .on("error", (err: any) => {
        file.destroy();
        // console.log("eror-code", err);
        fs.unlink(dest as any as PathLike, () => reject(err));
        // reject(err);
      })
      .pipe(file);
  });
};

const downloadingFileUsingCloudinary = async (
  url: string,
  res: Response,
  customFileName?: string
) => {
  const uri = new URL(url);
  if (!customFileName) {
    customFileName = basename(uri.pathname);
  }

  const image = await cloudinary.image(`${url}`, {
    flags: "f_auto/fl_attachment:customFileName",
  });
  if (!image) {
    res.status(400).json("Error downloading Image");
    return;
  }
  console.log("image", image);
  return image;
};

// hash password fxn
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// create token
const generateToken = async (payload: tokenPayload) => {
  const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "1h",
  });
  if (!token) {
    throw new Error("error generating token");
  }
  return token;
};

//check password
const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean | undefined> => {
  const match = await bcrypt.compare(password, hash);
  if (match) {
    return true;
  }
  return false;
};

module.exports = {
  download,
  downloadUrlFileWIthAxios,
  downloadingFileUsingCloudinary,
  hashPassword,
  generateToken,
  comparePassword,
};
