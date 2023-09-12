import fs from "fs";
import https from "https";
import http from "http";
import { basename } from "path";
import { URL } from "url";
import { promises } from "dns";
const axios = require("axios");
import express, { Response } from "express";

const TIMEOUT = 10000;

function download(url: string, dest: string) {
  const uri = new URL(url);
  if (!dest) {
    dest = basename(uri.pathname);
    console.log("dest", dest);
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
  dest?: string,
  res?: Response
) => {
  const uri = new URL(url);
  if (!dest) {
    dest = basename(uri.pathname);
  }
  const pkg = url.toLowerCase().startsWith("https:") ? https : http;

  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  // // console.log(response);
  // if (response.path) {
  //   return res?.send("file already exist");
  // }
  const file = fs.createWriteStream(dest, { flags: "wx" });
  response.data.pipe(file);

  return new Promise<void>((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });
    response.data.on("error", (err: any) => {
      reject(err);
    });

    // response.setTimeout(() => {}, TIMEOUT); // check if this feasible from axios keys
  });
};

module.exports = { download, downloadUrlFileWIthAxios };
