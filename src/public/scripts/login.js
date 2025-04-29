const inputsEl1 = document.querySelectorAll('input[data-page="login"]');
const labelsEl1 = document.querySelectorAll('label[data-page="login"]');

inputsEl1.forEach((el) => {
  el.addEventListener("focusin", handleFocusIn);
  el.addEventListener("focusout", handleFocusOut);
});

function handleFocusIn(e) {
  const inputEl = e.target;
  const labelEl = Array.from(labelsEl1).find((el) => el.getAttribute("for") === inputEl.id); // Find the matching label
  if (inputEl.value === "") {
    labelEl.style.top = "0px";
  }
}

function handleFocusOut(e) {
  const inputEl = e.target;
  const labelEl = Array.from(labelsEl1).find((el) => el.getAttribute("for") === inputEl.id); // Find the matching label
  if (inputEl.value === "") {
    labelEl.style.top = "39px";
  }
}
