/**
 * Create, append to container and return svg
 */
function addSvg(container) {
    let svg = createSvg();
    container.appendChild(svg);
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
    let rect = createRect(params);
    svg.appendChild(rect);
    return rect;
}

/**
 * Create svg
 */
function createSvg() {
    let svg = createSvgElement("svg");
    svg.style.borderColor = "black";
    svg.style.borderStyle = "solid";
    svg.style.borderWidth = "1px";
    svg.style.width = "800px";
    svg.style.height = "600px";
    svg.style.font = "14px sans-serif";
    return svg;
}

/**
 * Create `<text>` tag with `text` content and basic font
 * @param {string} text 
 */
function createText(text) {
    let textEl = createSvgElement("text");
    textEl.textContent = text;
    return textEl;
}

/**
 * Create svg rect
 * @param {Object} params
 * @param {number} params.x
 * @param {number} params.y
 */
function createRect(params) {
    let rect = createSvgElement("rect");
    setAttributes(rect, {
        "x": params.x,
        "y": params.y,
        "height": "50",
        "width": "50",
        "fill": "white",
        "stroke": "#1a73e8",
        "rx": "5",
    });
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
    let animate = createSvgElement("animate");
    animate.setAttribute("attributeName", "x");
    let parentX = rect.parentElement.getBoundingClientRect().x;
    let currentX = rect.getBoundingClientRect().x - parentX;
    setAttributes(animate, {
        "from": currentX,
        "to": target.x,
        "dur": "1s",
        "repeatCount": "1",
        "fill": "freeze",
    })
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
 * Get height of `<text>` element
 * @param {SVGTextElement} text 
 */
function getHeight(text) {
    return text.getBoundingClientRect().height;
}

/**
 * Get width of `<text>`
 * @param {SVGTextElement} text 
 */
function getWidth(text) {
    return text.getBoundingClientRect().width;
}

/**
 * @type {<K extends keyof SVGElementTagNameMap>(qualifiedName: K) => SVGElementTagNameMap[K]}
 */
function createSvgElement(type) {
    const ns = "http://www.w3.org/2000/svg";
    return document.createElementNS(ns, type);
}

/**
 * Set attributes of svg `element` using `setAttribute(...)`
 * @param {SVGElement} element 
 * @param {Object.<string, string>} attributes Dictionary with 
 * attribute names and values
 */
function setAttributes(element, attributes) {
    for (let key of Object.keys(attributes)) {
        element.setAttribute(key, attributes[key]);
    }
}