export function initInputLabels(formName) {
  const form = document.querySelector(`#${formName}-form`);

  form.addEventListener("focusin", (e) => {
    const input = e.target.closest("input");
    if (!input) return;

    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label && input.value === "") moveLabelUp(label);
  });

  form.addEventListener("focusout", (e) => {
    const input = e.target.closest("input");
    if (!input) return;

    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label && input.value === "") moveLabelDown(label);
  });
}

const moveLabelUp = (label) => label.classList.add("label-up");
const moveLabelDown = (label) => label.classList.remove("label-up");
