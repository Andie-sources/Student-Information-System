const express = require("express");
const { loginStudent } = require("../controllers/authController");

const router = express.Router();

// full path becomes POST /api/student/login (mounted in server.js)
router.post("/login", loginStudent);

module.exports = router;
