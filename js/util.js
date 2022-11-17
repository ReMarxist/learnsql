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
    return columnWidths.reduce((a, b) => a + b);
}

/**
 * Returns new dot, moved horizontally by `x`
 * @param {number} dot.x
 * @param {number} dot.y
 * @param {number} dot
 * @param {number} x
 */
function movedHorizontally(dot, x) {
    let newDot = {
        x: dot.x + x,
        y: dot.y
    };
    return newDot;
}