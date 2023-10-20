import { Request, Response } from "express";

export interface IGetAuthUserRequest extends Request {
  user: any;
  session?: any;
}
export interface IError extends Error {
  message: any;
}

// module.exports = {
//     IGetAuthUserRequest
// };
