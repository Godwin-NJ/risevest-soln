const pool = require("../db");
import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const {
  createUser,
  emailExist,
  emailExistWithPayload,
  createUserRole,
  getAllRole,
  updateDefaultUserRole,
} = require("../queries/account");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  generateToken,
  comparePassword,
} = require("../utilities");
import { IGetAuthUserRequest } from "../LocalTypes";

interface tokenPayload {
  email: string;
  fullname: string;
  role: string[];
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
  const token = await generateToken({
    email: email,
    fullname: user.fullname,
    role: user.role,
  });

  const userLoginPayload = { email, fullname: user.fullname, token };
  //   console.log(req.user);
  // req.user = userLoginPayload;
  res.status(200).json(userLoginPayload);
  //set req.user
  //send user payload
};

//creating user role
const createRole = async (req: Request, res: Response) => {
  const { roleid, role } = req.body;
  const user_Role = await pool.query(createUserRole, [roleid, role]);
  if (!user_Role) {
    res.status(400).send("error creating user");
  }
  res.status(200).json(user_Role.rowCount);
};

const getRoles = async (req: Request, res: Response) => {
  const roles = await pool.query(getAllRole);
  if (!roles) {
    res.status(400).json("error getting roles");
  }
  res.status(200).json(roles.rows);
};

const UpdateUserRole = async (req: IGetAuthUserRequest, res: Response) => {
  const { role, email } = req.body;
  // const userEmail = req.user.email;
  // const args = Object.values(req.body);
  // const keys = Object.keys(req.body)
  const user = await pool.query(updateDefaultUserRole, [role, email]);
  if (!user) {
    throw new Error("Failed to update user role");
  }
  res.status(200).json("updated");
};

module.exports = {
  registerUser,
  loginUser,
  createRole,
  getRoles,
  UpdateUserRole,
};
