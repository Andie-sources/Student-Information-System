// Real database version (MongoDB + Mongoose).
//
// 1. npm install mongoose
// 2. Rename this file to Student.js (replace the in-memory one)
// 3. In server.js add:
//      const mongoose = require("mongoose");
//      mongoose.connect("mongodb://127.0.0.1:27017/must_sis");
//
// To create a student, hash the password first:
//      const passwordHash = await bcrypt.hash("student123", 10);
//      await Student.create({ registrationNumber: "2024/BSE/001", name: "...", passwordHash });

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
