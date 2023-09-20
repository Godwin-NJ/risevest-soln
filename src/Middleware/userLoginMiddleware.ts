import express, { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { IGetAuthUserRequest } from "../LocalTypes";

//AUTHENTICATION MIDDLEWARE
const authentication = async (
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
    const { email, fullname, role } = isTokenValid;
    req.user = { email, fullname, role };
    next();
  } catch (error) {
    return res.status(400).json("Token is not valid");
  }
};

const authorizationMD = (roles: string) => {
  // [admin, user,HR-Human Resource,accouts/finance]
  return (req: IGetAuthUserRequest, res: Response, next: NextFunction) => {
    const reqUser = req.user.role;
    // console.log(reqUser, "reqUser");
    // console.log(roles, "roles");
    // const checkRole = role.some((singleRole) => console.log(singleRole,'singleRole'));
    // const checkRole = role.some((singleRole) => reqUser.includes(singleRole));
    const checkRole = roles.includes(reqUser);
    // console.log(checkRole, "checkRole");
    if (!checkRole) {
      res.status(400).send("User is Unauthorized To Access this resource ");
    }
    next();
  };
};

//AUTHORIZATION MIDDLEWARE
//pass an array of user's , any user defined is give access to that resource
//That means the type is meant to reflect the user types in the platform e.g ==> admin,user,Human Resource,Accounts
//That means the schema will have to be modified
//Assign userType to user using a specific endpoint , then use a join method to link the user with the userType created
//Create a set of user type , have an API doing this ==> an id will be passed into the params,
//this will be used to identity the said user ==> The userId will be the unique identifier here , so ensure it's not duplicated

module.exports = {
  authentication,
  authorizationMD,
};
