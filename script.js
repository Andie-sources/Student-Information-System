// Client-side validation for the Student Information System login form

const form = document.getElementById("loginForm");
const regNoInput = document.getElementById("regNo");
const passwordInput = document.getElementById("password");
const regNoError = document.getElementById("regNoError");
const passwordError = document.getElementById("passwordError");
const successMsg = document.getElementById("successMsg");
const toggleBtn = document.getElementById("togglePassword");

// On a live website (or localhost:3000) the API is on the same address, so a
// relative URL works. Only when the page is opened as a file, or from another
// local port (e.g. Live Server on 5500), do we point at localhost:3000.
const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const openedElsewhere = location.protocol === "file:" || (isLocal && location.port !== "3000");
const API_URL = openedElsewhere
  ? "http://localhost:3000/api/student/login"
  : "/api/student/login";

// Format YYYY/BSE/NNN, e.g. 2024/BSE/001
const REG_PATTERN = /^\d{4}\/BSE\/\d{3}$/;

// Each validator returns an error message, or "" if the value is fine
function validateRegNo(value) {
  if (value === "") return "Registration number is required.";
  if (!REG_PATTERN.test(value)) return "Use the format 2024/BSE/001.";
  return "";
}

function validatePassword(value) {
  if (value === "") return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return "";
}

// Show or clear the message for one field
function showResult(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.classList.toggle("valid", message === "");
}

// Check the fields as the student leaves them
regNoInput.addEventListener("blur", function () {
  showResult(regNoInput, regNoError, validateRegNo(regNoInput.value.trim()));
});

passwordInput.addEventListener("blur", function () {
  showResult(passwordInput, passwordError, validatePassword(passwordInput.value));
});

// Once an error is showing, re-check while typing so it clears quickly
regNoInput.addEventListener("input", function () {
  successMsg.textContent = "";
  successMsg.className = "success";
  if (regNoInput.classList.contains("invalid")) {
    showResult(regNoInput, regNoError, validateRegNo(regNoInput.value.trim()));
  }
});

passwordInput.addEventListener("input", function () {
  successMsg.textContent = "";
  successMsg.className = "success";
  if (passwordInput.classList.contains("invalid")) {
    showResult(passwordInput, passwordError, validatePassword(passwordInput.value));
  }
});

// Show / hide password
toggleBtn.addEventListener("click", function () {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.textContent = hidden ? "Hide" : "Show";
});

// Main check when the form is submitted
form.addEventListener("submit", function (event) {
  // i. retrieve what the student entered
  const regNo = regNoInput.value.trim();
  const password = passwordInput.value;

  // ii, iii, iv. run all the rules
  const regNoMsg = validateRegNo(regNo);
  const passwordMsg = validatePassword(password);

  // v. display the error messages
  showResult(regNoInput, regNoError, regNoMsg);
  showResult(passwordInput, passwordError, passwordMsg);

  // stop the form from being submitted if any rule failed
  if (regNoMsg !== "" || passwordMsg !== "") {
    event.preventDefault();
    successMsg.textContent = "";
    successMsg.className = "success";
    // move the cursor to the first field with a problem
    (regNoMsg !== "" ? regNoInput : passwordInput).focus();
    return;
  }

  // vi. all rules satisfied: send the details to the server
  event.preventDefault();
  successMsg.textContent = "Validation successful. Logging you in...";
  successMsg.className = "success show";

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationNumber: regNo, password: password })
  })
    .then(function (response) {
      // read the JSON, then keep the status code with it
      return response.json().then(function (data) {
        return { status: response.status, data: data };
      });
    })
    .then(function (result) {
      // server-side result: 200 success, 400 bad input, 401 wrong details
      if (result.status === 200) {
        successMsg.textContent = result.data.message;
        successMsg.className = "success show";
      } else {
        successMsg.textContent = result.data.message || "Login failed.";
        successMsg.className = "success show fail";
      }
    })
    .catch(function () {
      successMsg.textContent = "Cannot reach the server. Make sure it is running (npm start in the server folder).";
      successMsg.className = "success show fail";
    });
});
