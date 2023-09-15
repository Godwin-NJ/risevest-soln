const pool = require("../db");
import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const {
  createUser,
  emailExist,
  emailExistWithPayload,
} = require("../queries/account");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  generateToken,
  comparePassword,
} = require("../utilities");

interface tokenPayload {
  email: string;
  fullname: string;
}

interface MyUserRequest extends Request {
  // Use `user?:` here instead of `user:`.
  user?: tokenPayload;
}

const registerUser = async (req: Request, res: Response) => {
  // check if email exist
  //if email does not exist , create account
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    throw new Error("Provide all request");
  }

  const userEmail = await pool.query(emailExist, [email]);
  console.log({ user: userEmail.rows });
  if (userEmail.rows.length) {
    throw new Error("Email already exist");
    // console.log("email already exist");
  }

  //validate email address (Pending)
  const userPassword = await hashPassword(password);

  try {
    const registerUser = await pool.query(createUser, [
      fullname,
      email,
      userPassword,
    ]);
    if (registerUser) {
      res.status(201).json("user account created");
    }
  } catch (error) {
    console.log(error);
  }
};
const loginUser = async (req: MyUserRequest, res: Response) => {
  const { email, password } = req.body;
  const userEmail = await pool.query(emailExistWithPayload, [email]);
  if (!userEmail.rows.length) {
    throw new Error("Account does not exist ");
  }
  const user = userEmail.rows[0];
  //   console.log(userEmail.rows[0]);

  //compare hash password with current password
  const matchPassword = await comparePassword(password, user.password);

  if (!matchPassword) {
    // console.log("valid login credentials");
    throw new Error("Invalid login credentials");
  }
  //generate token
  const token = await generateToken({ email: email, fullname: user.fullname });

  const userLoginPayload = { email, fullname: user.fullname, token };
  //   console.log(req.user);
  req.user = userLoginPayload;
  res.status(200).json(userLoginPayload);
  //set req.user
  //send user payload
};

module.exports = {
  registerUser,
  loginUser,
};
