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
import { IGetAuthUserRequest, IError } from "../LocalTypes";
// const redis = require("ioredis");

interface tokenPayload {
  email: string;
  fullname: string;
  role: string[];
}

interface MyUserRequest extends Request {
  // Use `user?:` here instead of `user:`.
  user?: tokenPayload;
  session?: any;
}

const registerUser = async (req: Request, res: Response) => {
  // check if email exist
  //if email does not exist , create account
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    throw new Error("Provide all request");
  }

  const userEmail = await pool.query(emailExist, [email]);
  // console.log({ user: userEmail.rows });
  if (userEmail.rows.length) {
    // throw new Error("Email already exist");
    res.status(400).json("Email already exist");
    return;
    // console.log("email already exist");
  }

  //validate email address (Pending)
  const userPassword = await hashPassword(password);

  const registerUser = await pool.query(createUser, [
    fullname,
    email,
    userPassword,
  ]);
  if (registerUser) {
    res.status(201).json("user account created");
    return;
  }
};
const loginUser = async (req: MyUserRequest, res: Response) => {
  const { email, password } = req.body;
  const userEmail = await pool.query(emailExistWithPayload, [email]);
  if (!userEmail.rows.length) {
    throw new Error("Account does not exist ");
  }
  const user = userEmail.rows[0];
  // console.log(user, "user");
  //   console.log(userEmail.rows[0]);

  //compare hash password with current password
  const matchPassword = await comparePassword(password, user.password);

  if (!matchPassword) {
    // console.log("valid login credentials");
    throw new Error("Invalid login credentials");
  }
  //------------------------//---JWT TOKEN--
  //generate token >>>>the token logic below is used when JWT is used for the authentication process rather
  //than cookie session
  // const token = await generateToken({
  //   email: email,
  //   fullname: user.fullname,
  //   role: user.role,
  // });
  // const userLoginPayload = { email, fullname: user.fullname, token };
  // res.status(200).json(userLoginPayload);

  // -----------------------//--Cookie Session
  const sessionUser = { ...user };
  req.session.user = sessionUser;
  req.user = { email, fullname: user.fullname, role: user.role };
  res.status(200).json({ email, fullname: user.fullname, role: user.role });
};

//creating user role
const createRole = async (req: Request, res: Response) => {
  const { roleid, role } = req.body;
  const user_Role = await pool.query(createUserRole, [roleid, role]);
  if (!user_Role) {
    res.status(400).send("error creating user");
  }
  res.status(201).json(user_Role.rowCount);
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

const sessionLogout = async (req: IGetAuthUserRequest, res: Response) => {
  await req.session.destroy((err: any) => {
    if (err) {
      return res.status(400).json(`Error revoking session : err.message`);
    }

    res.status(200).json("session revoked");
  });
};

module.exports = {
  registerUser,
  loginUser,
  createRole,
  getRoles,
  UpdateUserRole,
  sessionLogout,
};
