SWE2106 Assessment: Client- and Server-Side Validation

SWE2106_Assessment_Answers.docx   written answers to Qn 1 and Qn 2

client/   QUESTION 1: client-side validation (runs in the browser)
  index.html   login form
  style.css    styling
  script.js    JavaScript validation + sends data to the server

server/   QUESTION 2: server-side validation (Node.js / Express)
  server.js                      starts the server, serves the client folder
  routes/studentRoutes.js        POST /api/student/login
  controllers/authController.js  validation + bcrypt.compare()
  models/Student.js              Student model (in-memory)
  models/Student.mongoose.js     MongoDB version (optional)
  package.json

How to run
1. Install Node.js
2. Open a terminal in the server folder
3. npm install
4. npm start
5. Open http://localhost:3000

Test login: 2024/BSE/001 / student123

PUTTING IT ON THE INTERNET
Option A (quick, for the presentation): keep npm start running, then in a
second terminal run:  npx ngrok http 3000   (or: cloudflared tunnel --url http://localhost:3000)
Share the https link it prints. It works only while your computer and the
server are running.

Option B (permanent, free): push the server folder to GitHub (the client
folder must stay next to it), then create a Web Service on render.com:
  Root directory: server    Build command: npm install    Start command: npm start
Render gives a public https link.
