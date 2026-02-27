const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB

router.post("/", upload.single("resume"), analyzeResume);

module.exports = router;
