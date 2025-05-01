// SPA PAGE NAVIGATION
// Build pages map from DOM
const pages = {};
document.querySelectorAll("[data-page]").forEach((el) => {
  pages[el.dataset.page] = el;
});

// Navigate with history
function navigate(path) {
  const validPath = pages[path] ? path : "/page-not-found";
  history.pushState({}, "", validPath); // Sets the path in browser
  navigateToPage(validPath);
}

// Show correct page
function navigateToPage(path) {
  //Hide all pages first before showing target page
  Object.values(pages).forEach((page) => (page.hidden = true));

  const targetPage = pages[path] || pages["/page-not-found"];
  targetPage.hidden = false; // Show target page
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
  navigateToPage(window.location.pathname);
});

// Initial load and oads the page by the name
// of the path in browser if put automatically. Creates refresh.
navigateToPage(window.location.pathname);
// SPA PAGE NAVIGATION---------------------------------------------
