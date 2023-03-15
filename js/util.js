/**
 * Toggle val of object
 * @param {Object} object
 * @param {number} object.val 
 */
function toggle (object) {
  if (object.val == 0) {
    object.val = 1;
  } else {
    object.val = 0;
  }
}

/**
 * Create, append and return div
 */
function addDiv () {
  let div = document.createElement("div");
  div.style.textAlign = "center";
  document.body.appendChild(div);
  return div;
}

/**
 * Get sum of `arr` elements
 * @param {number[]} arr 
 */
function sum (arr) {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Get maximum of `arr` elements
 * @param {number[]} arr 
 * @param {number} defaultValue value that is returned for empty array
 */
function max (arr, defaultValue) {
  if (arr.length === 0) {
    return defaultValue;
  } else {
    // For some reason, arr.reduce(Math.max) doesn't work
    return arr.reduce((a, b) => Math.max(a, b));
  }
}

/**
 * Returns new dot, moved horizontally by `x`
 * @param {Object} dot
 * @param {number} dot.x
 * @param {number} dot.y
 * @param {number} offset
 */
function movedHorizontally (dot, offset) {
  let newDot = {
    x: dot.x + offset,
    y: dot.y
  };
  return newDot;
}


/**
 * Returns new dot, moved horizontally by `x`
 * @param {Object} dot
 * @param {number} dot.x
 * @param {number} dot.y
 * @param {number} offset
 */
function movedVertically (dot, offset) {
  let newDot = {
    x: dot.x,
    y: dot.y + offset
  };
  return newDot;
}

/**
 * Return array 0, 1, ..., (n - 1)
 * @param {number} n 
 */
function increasing (n) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Set style attributes of `element`
 * @param {HTMLElement | SVGElement} element 
 * @param {Object.<string, string>} attributes Dictionary with 
 * attribute names and values
 */
function restyle (element, attributes) {
  for (let key of Object.keys(attributes)) {
    element.style[key] = attributes[key];
  }
}