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

  console.log("INIT");
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
