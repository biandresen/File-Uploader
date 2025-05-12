import { user } from "./user.js";
import { initRouter, navigate } from "./router.js";
import { initInputLabels } from "./inputLabels.js";
import { renderDashboard } from "./dashboardPage.js";
import nav from "./nav.js";
import createNewContent from "./create-new-content.js";
import "./constants.js";
import "./loginPage.js";
import "./modal.js";
import "./registerPage.js";
import "./user.js";

document.addEventListener("DOMContentLoaded", async () => {
  const isAuthenticated = await user.checkAuth();

  const theme = localStorage.getItem("theme");
  document.body.classList.add(theme);

  nav.init(isAuthenticated);
  initInputLabels("register");
  initInputLabels("login");
  initInputLabels("new-file");
  initInputLabels("new-folder");
  initRouter();
  createNewContent.init();
  if (isAuthenticated) renderDashboard();
  await navigate(window.location.pathname);
});
