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