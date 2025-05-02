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
const baseUrl = "http://localhost:3000";
const registerForm = document.querySelector("#register-form");
const registerErrorWrapper = document.querySelector("#register-error-wrapper");
const registerErrorList = document.querySelector("#register-error-list");
const registerSuccessModal = document.querySelector("#register-success-modal");

registerForm.addEventListener("submit", handleRegister);

async function handleRegister(e) {
  e.preventDefault();

  const registerEmail = document.querySelector("#registerEmail");
  const registerPassword = document.querySelector("#registerPassword");
  const registerConfirmPassword = document.querySelector("#registerConfirmPassword");

  const response = await fetch(baseUrl + "/register", {
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

  const registerData = await response.json();

  if (response.ok) {
    handleRegisterSuccess(registerData);
    setTimeout(async () => {
      registerSuccessModal.close();
      await autoLogin(registerEmail.value, registerPassword.value);
      resetInputs(registerEmail, registerPassword, registerConfirmPassword);
    }, 3000);
  } else handleRegisterFail(registerData);
}

function handleRegisterSuccess(data) {
  console.log("Success:", data);
  registerErrorList.innerHTML = "";
  registerErrorWrapper.hidden = true;
  registerSuccessModal.showModal();
}

function handleRegisterFail(data) {
  console.error("Error:", data);
  registerErrorList.innerHTML = "";
  resetInputs(registerPassword, registerConfirmPassword);
  const errorMessages = Array.isArray(data.message) ? data.message : [data.message];
  const listItems = createErrorListItems(errorMessages);
  registerErrorWrapper.hidden = false;
  registerErrorList.append(...listItems);
}

function createErrorListItems(errorMessages) {
  const listItems = [];
  errorMessages.forEach((msg) => {
    const listItem = document.createElement("li");
    listItem.textContent = msg.msg || msg;
    listItems.push(listItem);
  });
  return listItems;
}

function resetInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}
// LOGIN
import { navigate } from "./main.js";

async function autoLogin(email, password) {
  console.log(email, password);

  const response = await fetch(baseUrl + "/login", {
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
  console.log(loginData);

  if (response.ok) {
    console.log("Success");
    navigate("/");
    // handleLoginSuccess(loginData);
  } else {
    console.log("Fail");
    // handleLoginFail(loginData);
  }
}
