const { Router } = require("express");
const router = Router();
const { registerUser, loginUser } = require("../controllers/account");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
