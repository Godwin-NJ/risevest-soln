export const createUser =
  "INSERT INTO account.users(fullname,email,password,createdat) VALUES($1,$2,$3,CURRENT_TIMESTAMP)";

export const emailExist = "SELECT email FROM account.users WHERE email = $1";
export const emailExistWithPayload =
  "SELECT * FROM account.users WHERE email = $1";
