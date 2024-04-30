const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { uploadFile, downloadFile } = require("../controllers/FileControler");
const router = express.Router();

router.post("/upload", protect, uploadFile);
router.get("/:id", downloadFile);

module.exports = router;
