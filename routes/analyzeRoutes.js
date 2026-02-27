const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.post("/", upload.single("resume"), analyzeResume);

module.exports = router;
