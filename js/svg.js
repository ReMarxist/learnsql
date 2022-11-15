/**
 * Create, append to container and return svg
 */
function addSvg(container) {
    let svg = createSvg();
    container.appendChild(svg);
    return svg;
}

/**
 * Create, append to `svg` and return `<text>` tag
 * @param {SVGSVGElement} svg 
 * @param {string} text 
 * @param {Object} position Position of text
 * @param {number} position.x
 * @param {number} position.y
 */
function addText(svg, text, position) {
    let textEl = createText(text);
    textEl.setAttribute("x", position.x);
    textEl.setAttribute("y", position.y);
    svg.appendChild(textEl);
    return textEl;
}

/**
 * Create, append and return rect
 * @param {SVGSVGElement} svg
 * @param {Object} params
 * @param {number} params.x
 * @param {number} params.y
 */
function addRect(svg, params) {
    let rect = createRect(params);
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
function createSvg() {
    const ns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(ns, "svg");
    svg.style.borderColor = "#1a73e8";
    svg.style.borderStyle = "solid";
    svg.style.borderWidth = "1px";
    svg.style.width = "800px";
    svg.style.height = "600px";
    return svg;
}

/**
 * Create `<text>` tag with `text` content and basic font
 * @param {string} text 
 */
function createText(text) {
    const ns = "http://www.w3.org/2000/svg";
    let textEl = document.createElementNS(ns, "text");
    textEl.textContent = text;
    textEl.style.font = "14px sans-serif";
    return textEl;
}

/**
 * Create svg rect
 * @param {Object} params
 * @param {number} params.x
 * @param {number} params.y
 */
function createRect(params) {
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
    let parentX = rect.parentElement.getBoundingClientRect().x;
    let currentX = rect.getBoundingClientRect().x - parentX;
    animate.setAttribute("from", currentX);
    animate.setAttribute("to", target.x);
    animate.setAttribute("dur", "1s");
    animate.setAttribute("repeatCount", "1");
    animate.setAttribute("fill", "freeze");
    rect.appendChild(animate);
    animate.beginElement();
}

/**
 * Remove `<animate>` tags from rect
 * @param {SVGRectElement} rect 
 */
function removeAnimate(rect) {
    rect.querySelectorAll(".animate").forEach(el => el.remove());
}

/**
 * Create svg table
 * @param {SVGSVGElement} svg
 * @param {string} name Table name
 * @param {Object} position Position of table
 * @param {string} header Headers of table (names of columns)
 * @param {string[][]} dataRows Data that fills the table
 */
function addTable(svg, name, position, header, dataRows) {
    addText(svg, "Таблица " + name, position);
}