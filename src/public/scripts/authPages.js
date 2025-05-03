import { navigate } from "./main.js";
import { baseUrl } from "./main.js";
import { homePath, registerPath, loginPath } from "./main.js";
import { modal } from "./main.js";

// LABEL ANIMATION
let labelsInitialized = false;
window.onload = () => {
  initLabelHandlers("register");
  labelsInitialized = false;
  initLabelHandlers("login");
};

function initLabelHandlers(pageName) {
  if (labelsInitialized) return; // Skip if already initialized to avoid several event attachments

  const inputs = document.querySelectorAll(`input[data-page="${pageName}"]`);
  const labels = document.querySelectorAll(`label[data-page="${pageName}"]`);

  inputs.forEach((el) => {
    el.addEventListener("focusin", (e) => {
      handleFocusIn(e, labels);
    });
    el.addEventListener("focusout", (e) => handleFocusOut(e, labels));
  });

  // Move label up if input already has a value
  inputs.forEach((input) => {
    const label = Array.from(labels).find((el) => el.getAttribute("for") === input.id);
    if (input.value !== "") moveLabelUp(label);
  });

  labelsInitialized = true;
}

const moveLabelUp = (label) => (label.style.top = "0px");
const moveLabelDown = (label) => (label.style.top = "39px");

function handleFocusIn(e, labels) {
  const input = e.target;
  const label = Array.from(labels).find((el) => el.getAttribute("for") === input.id);
  if (input.value === "") moveLabelUp(label);
}

function handleFocusOut(e, labels) {
  const input = e.target;
  const label = Array.from(labels).find((el) => el.getAttribute("for") === input.id);
  if (input.value === "") moveLabelDown(label);
}
// LABEL ANIMATION-----------------------------------------------------

// REGISTER
const registerForm = document.querySelector("#register-form");
const registerErrorWrapper = document.querySelector("#register-error-wrapper");
const registerErrorList = document.querySelector("#register-error-list");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerConfirmPassword = document.querySelector("#registerConfirmPassword");

registerForm.addEventListener("submit", handleRegistration);

async function handleRegistration(e) {
  e.preventDefault();

  try {
    const response = await fetch(baseUrl + registerPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail.value,
        password: registerPassword.value,
        confirmPassword: registerConfirmPassword.value,
      }),
    });

    const registerResponseData = await response.json();

    registerErrorList.innerHTML = ""; //clear error field

    if (response.ok) {
      handleRegisterSuccess(registerResponseData);

      setTimeout(async () => {
        modal.close();
        await handleLogin(registerEmail.value, registerPassword.value);
        resetInputs(registerEmail, registerPassword, registerConfirmPassword);
      }, 2500);
      //
    } else handleRegisterFail(registerResponseData);
    //
  } catch (err) {
    console.error(err);
  }
}

function handleRegisterSuccess(data) {
  console.log("Success:", data);
  registerErrorWrapper.hidden = true;
  modal.innerHTML = "<p>Registration successful! 🎉</p><p>Trying to login...</p>";
  modal.showModal();
}

function handleRegisterFail(data) {
  console.error("Fail:", data);
  resetInputs(registerPassword, registerConfirmPassword);
  const errorMessages = data?.message[0].split(",");
  const listItems = createErrorListItems(errorMessages);
  registerErrorWrapper.hidden = false; //display error field
  registerErrorList.append(...listItems);
}

function createErrorListItems(errorMessages) {
  const listItems = [];
  errorMessages.forEach((msg) => {
    const listItem = document.createElement("li");
    listItem.textContent = msg;
    listItems.push(listItem);
  });
  return listItems;
}

function resetInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}
// LOGIN

const loginForm = document.querySelector("#login-form");
const loginErrorWrapper = document.querySelector("#login-error-wrapper");
const loginErrorList = document.querySelector("#login-error-list");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");

loginForm.addEventListener("submit", handleLogin);

async function handleLogin(e = null, registerEmail, registerPassword) {
  e.preventDefault();
  const email = loginEmail.value || registerEmail;
  const password = loginPassword.value || registerPassword;

  try {
    const response = await fetch(baseUrl + loginPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const loginData = await response.json();

    loginErrorList.innerHTML = ""; //clear error field

    if (response.ok) {
      handleLoginSuccess(loginData);
      resetInputs(loginEmail, loginPassword);
      setTimeout(async () => {
        modal.close();
      }, 2500);
    } else {
      handleLoginFail(loginData);
      resetInputs(loginPassword);
    }
  } catch (err) {
    console.error(err);
  }
}

function handleLoginSuccess(data) {
  console.log("Success", data);
  loginErrorWrapper.hidden = true;
  modal.innerHTML = "<p>Login successful! 🎉</p><p>Redirecting to your Dashboard...</p>";
  navigate(homePath); //to homepage/dashboard
  modal.showModal();
}

function handleLoginFail(data) {
  console.error("Fail", data);
  navigate(loginPath);
  const errorMessages = data?.message[0].split(",");
  const listItems = createErrorListItems(errorMessages);
  loginErrorWrapper.hidden = false; //display error field
  loginErrorList.append(...listItems);
}
// LOGIN------------------------------------------------------------------------
