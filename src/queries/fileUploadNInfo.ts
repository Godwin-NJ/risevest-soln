export const createUserInfo =
  "INSERT INTO account.userinfo(name,image,country) VALUES($1,$2,$3)";

export const showAllUserInfo = "SELECT * FROM account.userinfo";
export const getFileById = "SELECT * FROM account.userinfo WHERE userid=$1";
export const markFilesUnsafe =
  "Select * FROM account.userinfo WHERE userid = Any($1)";

export const updateToUnsafe =
  "UPDATE account.userinfo SET is_safe=false WHERE userid = Any($1)";

export const deleteFile = "DELETE FROM account.userinfo WHERE userid = Any($1)";
