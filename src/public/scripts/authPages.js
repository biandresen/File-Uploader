// LABEL ANIMATION
function handlePathChange() {
  const path = window.location.pathname;

  if (path === "/register" || path === "/login") {
    initLabelHandlers(path.slice(1)); // 'register' or 'login'
  }
}

// Call on load
handlePathChange();

// Listen for URL changes (back/forward navigation)
window.addEventListener("popstate", handlePathChange);

const moveLabelUp = (label) => (label.style.top = "0px");
const moveLabelDown = (label) => (label.style.top = "39px");

export function initLabelHandlers(pageName) {
  const inputs = document.querySelectorAll(`input[data-page="${pageName}"]`);
  const labels = document.querySelectorAll(`label[data-page="${pageName}"]`);

  function handleFocusIn(e) {
    const input = e.target;
    const label = Array.from(labels).find((el) => el.getAttribute("for") === input.id);
    if (input.value === "") moveLabelUp(label);
  }

  function handleFocusOut(e) {
    const input = e.target;
    const label = Array.from(labels).find((el) => el.getAttribute("for") === input.id);
    if (input.value === "") moveLabelDown(label);
  }

  inputs.forEach((el) => {
    el.addEventListener("focusin", handleFocusIn);
    el.addEventListener("focusout", handleFocusOut);
  });

  // When the page is shown, move label up if input has value
  inputs.forEach((el) => {
    const label = Array.from(labels).find((el) => el.getAttribute("for") === el.id);
    if (el.value !== "") moveLabelUp(label);
  });
}

// LABEL ANIMATION-----------------------------------------------------
