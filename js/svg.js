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
 * @param {Object} params
 * @param {number} params.x
 * @param {number} params.y
 */
function addRect(svg, params) {
    let rect = mkRect(params);
    svg.appendChild(rect);
    return rect;
}

/**
 * Create, append and return animation to `rect`
 * @param {SVGRect} rect 
 */
function addAnimation(rect) {
    const ns = "http://www.w3.org/2000/svg";
    let animate = document.createElementNS(ns, "animate");
    animate.setAttribute("attributeName", "x");
    animate.setAttribute("values", "20;80");
    animate.setAttribute("dur", "3s");
    animate.setAttribute("repeatCount", "1");
    animate.setAttribute("begin", "controlButton.click");
    rect.setAttribute("x", "80");
    rect.appendChild(animate);
    return animate;
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
 * @param {Object} params
 * @param {number} params.x
 * @param {number} params.y
 */
function mkRect(params) {
    const ns = "http://www.w3.org/2000/svg";
    let rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", params.x);
    rect.setAttribute("y", params.y);
    rect.setAttribute("height", "50");
    rect.setAttribute("width", "50");
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "#1a73e8");
    rect.setAttribute("rx", "5");
    return rect;
}

/**
 * Animate `rect` to move it to `target`
 * @param {SVGRectElement} rect 
 * @param {Object} target Coordinates of rect final state
 * @param {number} target.x
 * @param {number} target.y
 */
function animate(rect, target) {
    removeAnimate(rect);
    const ns = "http://www.w3.org/2000/svg";
    let animate = document.createElementNS(ns, "animate");
    animate.setAttribute("attributeName", "x");
    let currentX = rect.getBoundingClientRect().x + 10;
    animate.setAttribute("from", currentX);
    animate.setAttribute("to", target.x);
    animate.setAttribute("dur", "1s");
    animate.setAttribute("repeatCount", "1");
    animate.setAttribute("fill", "freeze");
    rect.appendChild(animate);
    animate.beginElement();
    // rect.setAttribute("x", target.x);
}

/**
 * Remove `<animate>` tags from rect
 * @param {SVGRectElement} rect 
 */
function removeAnimate(rect) {
    rect.querySelectorAll(".animate").forEach(el => el.remove());
}