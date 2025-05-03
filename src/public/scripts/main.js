export const baseUrl = "http://localhost:3000";
export const homePath = "/";
export const checkAuthPath = "/check-auth";
export const registerPath = "/register";
export const loginPath = "/login";

export const modal = document.querySelector("#modal");

// SPA PAGE NAVIGATION
// Build pages map from DOM
const pages = {};
document.querySelectorAll("main[data-page]").forEach((el) => {
  pages[el.dataset.page] = el;
});

function focusFirstInputInVisibleMain() {
  const visibleMain = document.querySelector("main:not([hidden])");
  if (!visibleMain) return;

  const firstInput = visibleMain.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
}

// Navigate with history
export async function navigate(path) {
  let authenticated = true;

  if (path === homePath) {
    authenticated = await checkAuth();
  }

  if (!authenticated) {
    path = loginPath;
    modal.innerHTML = "<p>❌Not authorized for this page</p>";
    modal.showModal();
    setTimeout(() => {
      modal.close();
    }, 1500);
  }

  const validPath = pages[path] ? path : "/page-not-found";

  history.pushState({}, "", validPath); // Sets the path in browser
  renderPage(validPath);
}

// Show correct page
function renderPage(path) {
  //Hide all pages first before showing target page
  Object.values(pages).forEach((page) => (page.hidden = true));
  const targetPage = pages[path] || pages["/page-not-found"];
  targetPage.hidden = false; // Show target page
  focusFirstInputInVisibleMain();
  window.scrollTo({ top: 0, behavior: "smooth" }); // Auto-scroll to top
}

// Handle link clicks
document.querySelectorAll('a[data-link="page"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const path = e.currentTarget.getAttribute("href");
    navigate(path);
  });
});

// Handle browser back/forward nav
window.addEventListener("popstate", () => {
  renderPage(window.location.pathname);
});

// Initial load and oads the page by the name
// of the path in browser if put automatically. Creates refresh.
navigate(window.location.pathname);
// SPA PAGE NAVIGATION---------------------------------------------

// DASHBOARD / HOME
async function checkAuth() {
  try {
    const response = await fetch(baseUrl + checkAuthPath, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data.loggedIn;
  } catch (err) {
    console.error("Auth check failed:", err);
    return false;
  }
}
