import { PATH, MSG } from "./constants.js";
import modal from "./modal.js";
import { resetInputs, createErrorListItems } from "./utils.js";
import { handleLogin } from "./loginPage.js";
import { dataToArray, $ } from "./utils.js";

const registerForm = $("#register-form");
const registerErrorWrapper = $("#register-error-wrapper");
const registerErrorList = $("#register-error-list");
const registerEmail = $("#registerEmail");
const registerPassword = $("#registerPassword");
const registerConfirmPassword = $("#registerConfirmPassword");

registerForm.addEventListener("submit", handleRegistration);

async function handleRegistration(e) {
  e.preventDefault();

  try {
    const response = await fetch(PATH.BASEURL + PATH.REGISTER, {
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

    const data = await response.json();
    registerErrorList.innerHTML = "";

    if (response.ok) return handleRegisterSuccess(data);
    handleRegisterFail(data);
  } catch (err) {
    console.error("Error during registration: ", err);
  }
}

async function handleRegisterSuccess(data) {
  console.log("Success:", data);
  registerErrorWrapper.hidden = true; //hide error field
  modal.showTimedModal(2500, MSG.REGISTER_HEADING, MSG.REGISTER_SUCCESS, MSG.REGISTER_REDIRECT);
  await handleLogin(null, registerEmail.value, registerPassword.value); // auto-login
  resetInputs(registerEmail, registerPassword, registerConfirmPassword);
}

function handleRegisterFail(data) {
  console.error("Fail:", data);
  resetInputs(registerPassword, registerConfirmPassword);
  const messages = dataToArray(data);
  const listItems = createErrorListItems(messages);
  registerErrorWrapper.hidden = false;
  registerErrorList.append(...listItems);
}
