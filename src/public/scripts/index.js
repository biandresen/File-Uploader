import { user } from "./user.js";
import { initRouter, navigate } from "./router.js";
import { initInputLabels } from "./inputLabels.js";
import { renderDashboard } from "./dashboardPage.js";
import nav from "./nav.js";
import createNewContent from "./create-new-content.js";
import { insertUserName } from "./user.js";
import "./constants.js";
import "./loginPage.js";
import "./modal.js";
import "./registerPage.js";
import "./user.js";

export async function initialLoad() {
  const theme = localStorage.getItem("theme");
  document.body.classList.add(theme);

  const isAuthenticated = await user.checkAuth();
  nav.init(isAuthenticated);
  initInputLabels("register");
  initInputLabels("login");
  initInputLabels("new-file");
  initInputLabels("new-folder");
  initRouter();
  isAuthenticated && createNewContent.init();
  isAuthenticated && insertUserName();
  if (isAuthenticated) renderDashboard();
  await navigate(window.location.pathname);
}

document.addEventListener("DOMContentLoaded", async () => initialLoad());
