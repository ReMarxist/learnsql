let svg = mkSvg();
document.body.appendChild(svg);

let rect = mkRect();
svg.appendChild(rect);
addAnimation(rect);

/**
 * Create svg
 */
function mkSvg() {
    const ns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(ns, "svg");
    svg.style.borderColor = "#1a73e8";
    svg.style.borderStyle = "solid";
    svg.style.borderWidth = "1px";
    return svg;
}

/**
 * Add animation to `rect`
 * @param {SVGRect} rect 
 */
function addAnimation(rect) {
    const ns = "http://www.w3.org/2000/svg";
    let animate = document.createElementNS(ns, "animate");
    animate.setAttribute("attributeName", "x");
    animate.setAttribute("values", "20;80");
    animate.setAttribute("dur", "3s");
    animate.setAttribute("repeatCount", "1");
    rect.setAttribute("x", "80");
    rect.appendChild(animate);
}