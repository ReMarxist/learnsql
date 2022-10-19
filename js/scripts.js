let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
document.body.appendChild(svg);

var svgns = "http://www.w3.org/2000/svg";
let rect = mkRect();
svg.appendChild(rect);

/**
 * Create new svg rect
 */
function mkRect() {
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttribute('x', '150');
    rect.setAttribute('y', '150');
    rect.setAttribute('height', '50');
    rect.setAttribute('width', '50');
    rect.setAttribute('fill', 'blue');
    return rect;
}