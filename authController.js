const bcrypt = require("bcrypt");
const Student = require("../models/Student");

// Format YYYY/BSE/NNN, e.g. 2024/BSE/001
const REG_PATTERN = /^\d{4}\/BSE\/\d{3}$/;

// POST /api/student/login
async function loginStudent(req, res) {
  try {
    // i. extract the values from the request body
    const { registrationNumber, password } = req.body || {};

    // ii. either field missing -> 400
    if (!registrationNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Registration number and password are required."
      });
    }

    // both must be plain strings (blocks injection like {"$ne": ""})
    if (typeof registrationNumber !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input."
      });
    }

    // iii. registration number format -> 400 if wrong
    if (!REG_PATTERN.test(registrationNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: "Registration number must follow the format YYYY/BSE/NNN."
      });
    }

    // iv. find the student in the database
    const student = await Student.findOne({
      registrationNumber: registrationNumber.trim()
    });

    // v. student does not exist -> 401
    // (same message as wrong password, so attackers cannot tell which exist)
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password."
      });
    }

    // vi. compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, student.passwordHash);

    // v. wrong password -> 401
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration number or password."
      });
    }

    // vii. authenticated -> 200
    return res.status(200).json({
      success: true,
      message: "Login successful."
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
}

module.exports = { loginStudent };
