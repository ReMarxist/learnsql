/**
 * Toggle val of object
 * @param {Object} object
 * @param {number} object.val 
 */
function toggle(object) {
    if (object.val == 0) {
        object.val = 1;
    } else {
        object.val = 0;
    }
}

/**
 * Create, append and return div
 */
function addDiv() {
    let div = document.createElement("div");
    div.style.textAlign = "center";
    document.body.appendChild(div);
    return div;
}

/**
 * Get sum of `arr` elements
 * @param {number[]} arr 
 */
function sum(arr) {
    return arr.reduce((a, b) => a + b);
}

/**
 * Get maximum of `arr` elements
 * @param {number[]} arr 
 */
function max(arr) {
    // For some reason, arr.reduce(Math.max) doesn't work
    return arr.reduce((a, b) => Math.max(a, b));
}

/**
 * Returns new dot, moved horizontally by `x`
 * @param {Object} dot
 * @param {number} dot.x
 * @param {number} dot.y
 * @param {number} offset
 */
function movedHorizontally(dot, offset) {
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
 function movedVertically(dot, offset) {
    let newDot = {
        x: dot.x,
        y: dot.y + offset
    };
    return newDot;
}