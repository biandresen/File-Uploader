// router.js
import { PATH, MSG } from "./constants.js";
import { user } from "./user.js";
import modal from "./modal.js";
import { $all } from "./utils.js";

const pages = {};

export function initRouter() {
  $all("main[data-page]").forEach((el) => {
    pages[el.dataset.page] = el;
  });

  window.addEventListener("popstate", () => {
    renderPage(window.location.pathname);
  });
}

export async function navigate(path) {
  if (path === PATH.HOME && !user.isAuthenticated) {
    return renderPage(PATH.LOGIN);
    // return modal.showTimedModal(2500, MSG.AUTH_HEADING, MSG.AUTH_FAILED);
  }

  if (path === PATH.LOGOUT) {
    await user.logout();
    return renderPage(PATH.LOGIN);
  }

  const validPath = pages[path] ? path : "/page-not-found";
  history.pushState({}, "", validPath);
  renderPage(validPath);
}

function renderPage(path) {
  try {
    Object.values(pages).forEach((p) => (p.hidden = true));
    const page = pages[path] || pages["/page-not-found"];
    page.hidden = false;
    const firstInput = page.querySelector("input");
    if (firstInput) firstInput.focus();
    window.scrollTo({ top: 0 });
  } catch (err) {
    console.error("Error rendering page: ", err);
  }
}
