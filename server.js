const express = require("express");
const path = require("path");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// allow the page to call the API even if it was opened from another port
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// lets Express read JSON sent in req.body
app.use(express.json());

// serves the client-side files (index.html, style.css, script.js) from ../client
app.use(express.static(path.join(__dirname, "..", "client")));

// API routes
app.use("/api/student", studentRoutes);

// bad JSON in the request body ends up here -> 400
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body." });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`SIS running at http://localhost:${PORT}`);
});
