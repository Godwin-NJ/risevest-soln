export const createUserInfo =
  "INSERT INTO account.userinfo(name,image,country) VALUES($1,$2,$3)";

export const showAllUserInfo = "SELECT * FROM account.userinfo";
export const getFileById = "SELECT * FROM account.userinfo WHERE userid=$1";
