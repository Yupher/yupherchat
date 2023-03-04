const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  getAll,
  logout,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(register).get(protect, getAll);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
