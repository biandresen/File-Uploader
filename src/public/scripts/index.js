import { user } from "./user.js";
import { initRouter, navigate } from "./router.js";
import nav from "./nav.js";
import { initInputLabels } from "./inputLabels.js";
import "./constants.js";
import "./loginPage.js";
import "./modal.js";
import "./registerPage.js";
import "./user.js";

document.addEventListener("DOMContentLoaded", async () => {
  const isAuthenticated = await user.checkAuth();
  nav.init(isAuthenticated);
  initInputLabels("register");
  initInputLabels("login");
  initRouter();
  navigate(window.location.pathname);
});
