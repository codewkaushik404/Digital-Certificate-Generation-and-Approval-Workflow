const router = require("express").Router();
const { login, logout, register} = require("../controllers/userAuthController");
const verifyUser = require("../middlewares/verifyUser");
//POST   /auth/login
router.post("/login",login);

//POST   /auth/register
router.post("/register",register);

//DELETE   /auth/logout
router.delete("/logout", verifyUser, logout);

module.exports = router;