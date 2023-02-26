const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:id", protect, allMessages);

module.exports = router;
