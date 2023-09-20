const { Router } = require("express");
const router = Router();
const {
  registerUser,
  loginUser,
  createRole,
  getRoles,
  UpdateUserRole,
} = require("../controllers/account");
const {
  authentication,
  authorizationMD,
} = require("../Middleware/userLoginMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router
  .route("/roles")
  .get(authentication, getRoles)
  .post(authentication, createRole)
  .put(authentication, authorizationMD("admin"), UpdateUserRole);
// .put(authentication, UpdateUserRole);

module.exports = router;
