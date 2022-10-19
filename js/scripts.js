let svg = mkSvg();
document.body.appendChild(svg);

let rect = mkRect();
svg.appendChild(rect);

/**
 * Create new svg rect
 */
function mkRect() {
    var rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", "20");
    rect.setAttribute("y", "20");
    rect.setAttribute("height", "50");
    rect.setAttribute("width", "50");
    rect.setAttribute("fill", "blue");
    return rect;
}

function mkSvg() {
    let ns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(ns, "svg");
    return svg;
}