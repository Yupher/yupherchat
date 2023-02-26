const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.delete("/:id", protect, deleteGroup);

module.exports = router;
