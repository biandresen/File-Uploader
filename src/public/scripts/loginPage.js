import { PATH, MSG } from "./constants.js";
import modal from "./modal.js";
import { user } from "./user.js";
import { navigate } from "./router.js";
import nav from "./nav.js";
import { resetInputs, createErrorListItems } from "./utils.js";
import { dataToArray, $ } from "./utils.js";

const loginForm = $("#login-form");
const loginErrorWrapper = $("#login-error-wrapper");
const loginErrorList = $("#login-error-list");
const loginEmail = $("#loginEmail");
const loginPassword = $("#loginPassword");

loginForm.addEventListener("submit", handleLogin);

export async function handleLogin(e, registerEmail, registerPassword) {
  try {
    if (e?.preventDefault) e.preventDefault();
    console.log(registerEmail, registerPassword);

    const email = loginEmail?.value || registerEmail;
    const password = loginPassword?.value || registerPassword;

    const response = await fetch(PATH.BASEURL + PATH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("DATA: ", data);
    loginErrorList.innerHTML = "";

    if (response.ok) return handleLoginSuccess(data);
    handleLoginFail(data);
  } catch (err) {
    console.error(err);
  }
}

async function handleLoginSuccess(data) {
  console.log("Success", data);
  loginErrorWrapper.hidden = true;
  modal.showTimedModal(2500, MSG.LOGIN_HEADING, MSG.LOGIN_SUCCESS, MSG.LOGIN_REDIRECT);
  resetInputs(loginEmail, loginPassword);
  nav.updateAuthState(await user.checkAuth()).render();
  navigate(PATH.HOME);
}

function handleLoginFail(data) {
  console.error("Fail", data);
  resetInputs(loginPassword);
  navigate(PATH.LOGIN);
  const messages = dataToArray(data);
  const listItems = createErrorListItems(messages);
  loginErrorWrapper.hidden = false;
  loginErrorList.append(...listItems);
}
