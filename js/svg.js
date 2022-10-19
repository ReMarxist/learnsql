/**
 * Create, append and return svg
 */
function addSvg() {
    let svg = mkSvg();
    document.body.appendChild(svg);
    return svg;
}

/**
 * Create, append and return rect
 * @param {SVGSVGElement} svg 
 */
function addRect(svg) {
    let rect = mkRect();
    svg.appendChild(rect);
    return rect;
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
 * Create svg rect
 */
 function mkRect() {
    const ns = "http://www.w3.org/2000/svg";
    let rect = document.createElementNS(ns, "rect");
    rect.setAttribute("y", "20");
    rect.setAttribute("height", "50");
    rect.setAttribute("width", "50");
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "#1a73e8");
    rect.setAttribute("rx", "5");
    return rect;
}