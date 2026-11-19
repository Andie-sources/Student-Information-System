// Student model
//
// The assessment says to assume a Student model already exists. So that this
// project runs with just "npm install" (no database to set up), this file is a
// small in-memory stand-in with the same findOne() the controller uses.
// Passwords are stored as bcrypt hashes, never as plain text.
//
// To use a real MongoDB database, replace this file with Student.mongoose.js
// (see that file). The controller does not need to change.

const bcrypt = require("bcrypt");

const students = [
  {
    registrationNumber: "2024/BSE/001",
    name: "Test Student One",
    passwordHash: bcrypt.hashSync("student123", 10)
  },
  {
    registrationNumber: "2024/BSE/002",
    name: "Test Student Two",
    passwordHash: bcrypt.hashSync("password456", 10)
  }
];

const Student = {
  // mimics Mongoose: await Student.findOne({ registrationNumber })
  async findOne({ registrationNumber }) {
    return students.find((s) => s.registrationNumber === registrationNumber) || null;
  }
};

module.exports = Student;
