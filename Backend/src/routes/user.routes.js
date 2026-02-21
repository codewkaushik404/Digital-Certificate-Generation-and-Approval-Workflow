const router = require("express").Router();
const { getUser } = require("../controllers/userController");
const verifyUser = require("../middlewares/verifyUser");

//GET    /users/me
router.get("/me", verifyUser, getUser);

module.exports = router;