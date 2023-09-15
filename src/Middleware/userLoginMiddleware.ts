import express, { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { IGetAuthUserRequest } from "../LocalTypes";

const authorizationMD = async (
  req: IGetAuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeaderToken = req.headers.authorization;
  // console.log("isTokenValid", authHeaderToken);
  const getBearerToken = authHeaderToken?.split(" ")[1];
  // console.log("getBearerToken", getBearerToken);
  try {
    const isTokenValid = await jwt.verify(
      getBearerToken,
      process.env.JWT_PRIVATE_KEY
    );
    const { email, fullname } = isTokenValid;
    req.user = { email, fullname };
    next();
  } catch (error) {
    return res.status(400).json("Token is not valid");
  }

  // if (!isTokenValid) {
  //   return res.status(400).json("Token is not valid");
  // }
};

module.exports = {
  authorizationMD,
};
