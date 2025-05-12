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
 * Shorthand for creating elements with classes, data or appending children
 * @param {String} tag
 * @param {Object} options
 * @returns the inserted element type
 */
export function $create(tag, options = {}) {
  const element = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      element.classList.add(...value);
    } else if (key === "data") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === "text") {
      element.textContent = value;
    } else if (key === "src") {
      element.src = value;
    } else if (key === "type") {
      element[key] = value;
    } else if (key === "title") {
      element.title = value;
    } else if (key === "children") {
      value.forEach((child) => element.appendChild(child));
    } else {
      element[key] = value;
    }
  });

  return element;
}

export const dataToArray = (data) => data?.message[0].split(",") || [];
