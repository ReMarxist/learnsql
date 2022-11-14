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