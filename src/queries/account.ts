export const createUser =
  "INSERT INTO account.users(fullname,email,password,createdat) VALUES($1,$2,$3,CURRENT_TIMESTAMP)";

export const emailExist = "SELECT email FROM account.users WHERE email = $1";
export const emailExistWithPayload =
  "SELECT * FROM account.users WHERE email = $1";

export const createUserRole =
  "INSERT INTO account.roles(roleId,role,createdat) VALUES($1,$2,CURRENT_TIMESTAMP)";

export const getAllRole = "SELECT * FROM account.roles ";

export const updateDefaultUserRole =
  "Update account.users SET role=$1 WHERE email = $2 ";
// CREATE table account.roles( roleId VARCHAR (50) NOT NULL ,  role VARCHAR (50) NOT NULL );
//Creation of role table
