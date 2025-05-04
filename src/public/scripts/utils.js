export function resetInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}

export function createErrorListItems(messages) {
  return messages.map((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    return li;
  });
}

/**
 * Shorthand for document.querySelector with error safety.
 * @param {string} selector - The CSS selector for the element.
 * @returns {Element} - The DOM element.
 * @throws {Error} - If no element matches the selector.
 */
export const $ = (selector) => {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Element not found for selector: '${selector}'`);
  }
  return el;
};

/**
 * Shorthand for document.querySelectorAll with error safety.
 * @param {string} selector - The CSS selector for the elements.
 * @returns {NodeListOf<Element>} - The list of matching DOM elements.
 * @throws {Error} - If no elements match the selector.
 */
export const $all = (selector) => {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    throw new Error(`No elements found for selector: '${selector}'`);
  }
  return elements;
};

/**
 * Shorthand for document.create(el)
 * @param {string} selector
 * @returns {Element}
 */
export const $create = (selector) => document.createElement(selector);

export const dataToArray = (data) => data?.message[0].split(",") || [];
