/**
 * Create, append to `container` and return svg
 * @param {HTMLElement} container
 */
function addSvg (container) {
  let svg = createSvg();
  container.appendChild(svg);
  return svg;
}

/**
 * Create, append to `container` and return rect
 * @param {SVGElement} container
 */
function addRect (container) {
  let rect = createRect();
  container.appendChild(rect);
  return rect;
}

/**
 * Create, append to `container` and return `<g>`
 * @param {SVGElement} container 
 */
function addG (container) {
  let g = createG();
  container.appendChild(g);
  return g;
}

/**
 * Create, append to `container` and return `<text>`
 * @param {SVGElement} container 
 * @param {string} content 
 */
function addText (container, content) {
  let text = createText(content);
  container.appendChild(text);
  return text;
}

/**
 * Create svg
 */
function createSvg () {
  let svg = createSvgElement("svg");
  svg.style.width = "100%";
  svg.style.height = "400px";
  svg.style.font = "14px system-ui";
  svg.style.backgroundColor = "#f1f6f8";
  return svg;
}

/**
 * Create `<text>` tag with `content` and basic font
 * @param {string} content 
 */
function createText (content) {
  let textEl = createSvgElement("text");
  textEl.textContent = content;
  textEl.style.dominantBaseline = "central";
  return textEl;
}

/**
 * Create svg rect
 */
function createRect () {
  let rect = createSvgElement("rect");
  setAttributes(rect, {
    "height": "50",
    "width": "50",
  });
  return rect;
}

/**
 * Create `<g>`
 */
function createG () {
  let g = createSvgElement("g");
  return g;
}

/**
 * Create, append to `container` and return `<line>`
 * @param {SVGElement} container 
 */
function addLine (container) {
  let line = createSvgElement("line");
  container.appendChild(line);
  return line;
}

/**
 * Create, append to `container` and return `<animate>`
 * @param {SVGElement} container 
 */
function addAnimate (container) {
  let animate = createSvgElement("animate");
  container.appendChild(animate);
  return animate;
}

/**
 * Animate `rect` to move it to `target`
 * @param {SVGRectElement} rect 
 * @param {Object} target Coordinates of rect final state
 * @param {number} target.x
 * @param {number} target.y
 */
function animate (rect, target) {
  removeAnimate(rect);
  let animate = createSvgElement("animate");
  animate.setAttribute("attributeName", "x");
  let parentX = rect.parentElement.getBoundingClientRect().x;
  let currentX = rect.getBoundingClientRect().x - parentX;
  setAttributes(animate, {
    "from": "" + currentX,
    "to": "" + target.x,
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
function removeAnimate (rect) {
  rect.querySelectorAll(".animate").forEach(el => el.remove());
}

/**
 * Get height of `<text>` element
 * @param {SVGTextElement} text 
 */
function getHeight (text) {
  return text.getBoundingClientRect().height;
}

/**
 * Get width of svg element
 * @param {SVGElement} element 
 */
function getWidth (element) {
  return element.getBoundingClientRect().width;
}

/**
 * @type {<K extends keyof SVGElementTagNameMap>(qualifiedName: K) => SVGElementTagNameMap[K]}
 */
function createSvgElement (type) {
  const ns = "http://www.w3.org/2000/svg";
  return document.createElementNS(ns, type);
}

/**
 * Set attributes of svg `element` using `setAttribute(...)`
 * @param {SVGElement} element 
 * @param {Object.<string, string>} attributes Dictionary with 
 * attribute names and values
 */
function setAttributes (element, attributes) {
  for (let key of Object.keys(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
}

/**
 * Place svg element
 * @param {SVGElement} element 
 * @param {{x: number, y: number}} position 
 */
function place (element, position) {
  setAttributes(element, {
    "x": "" + position.x,
    "y": "" + position.y,
  });
}

/**
 * Resize svg element
 * @param {SVGElement} element 
 * @param {{width: number, height: number}} dimensions 
 */
function resize (element, dimensions) {
  setAttributes(element, {
    "width": "" + dimensions.width,
    "height": "" + dimensions.height,
  });
}

/**
 * Transform svg element
 * @param {SVGElement} element 
 * @param {{x: number, y: number, width: number, height: number}} params 
 */
function transform (element, params) {
  place(element, params);
  resize(element, params);
}

/**
 * Translate svg `element` via transform attribute
 * @param {SVGElement} element 
 * @param {{x: number, y: number}} position 
 */
function translate (element, position) {
  setAttributes(element, {
    "transform": `translate(${position.x}, ${position.y})`,
  });
}