import { $, $create } from "./utils.js";
const modalElement = $("#modal");

modalElement.addEventListener("click", (e) => {
  if (e.target === modalElement) modal.close();
});

const modal = {
  /**
   * Shows a modal for a set time with one or more messages
   * @param {number} time - Time in ms to show the modal
   * @param {string} heading - Heading text (h3)
   * @param {...string} messages - Additional message strings (p)
   */
  showTimedModal(time, heading, ...messages) {
    modalElement.innerHTML = "";

    const h3 = $create("h3", { text: heading });
    modalElement.appendChild(h3);

    messages.forEach((message) => {
      const p = $create("p", { text: message });
      modalElement.appendChild(p);
    });

    const loadingSpinner = $create("div", { id: "loading-spinner" });
    modalElement.appendChild(loadingSpinner);

    modalElement.showModal();
    setTimeout(() => modalElement.close(), time);
  },

  show(messages) {
    modalElement.innerHTML = "";

    if (!Array.isArray(messages)) return console.error("Needs to be an array");

    messages.forEach((message) => {
      const p = $create("p", { text: message });
      modalElement.appendChild(p);
    });

    modalElement.showModal();
  },

  close() {
    modalElement.close();
  },

  showElement(element) {
    modalElement.innerHTML = "";

    const closeBtn = $create("button", { id: "close-form-btn", class: ["close-btn"], text: "X" });
    closeBtn.addEventListener("click", () => this.close());

    modalElement.appendChild(closeBtn);
    modalElement.appendChild(element);
    modalElement.showModal();
  },
};

export default modal;
