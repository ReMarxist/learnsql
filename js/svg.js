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
 * @param {string[]} headers Headers of table (names of columns)
 * @param {string[][]} dataRows Data that fills the table
 */
function addTable(svg, name, position, headers, dataRows) {
    let texts = createTableTexts(headers, dataRows);
    let tableWidth = addTableTexts(svg, texts, position, headers.length);
    addTableLabel(svg, name, position, tableWidth);
}

/**
 * Create `<text>` tags for table
 * @param {string[]} headers 
 * @param {string[][]} dataRows 
 */
function createTableTexts(headers, dataRows) {
    let headerSvgs = headers.map(createText);
    let dataSvgs = dataRows.flatMap(row => row.map(createText));
    return headerSvgs.concat(dataSvgs);
}

/**
 * Calculate positions and add `<text>` to `svg`
 * @param {SVGSVGElement} svg
 * @param {SVGTextElement[]} texts 
 * @param {Object} basePosition Top-left dot of table
 * @param {number} basePosition.x
 * @param {number} basePosition.y
 * @param {number} nColumns Number of columns in table
 * @returns {number} Table width
 */
function addTableTexts(svg, texts, basePosition, nColumns) {
    texts.forEach(text => {
        // Append texts to svg before calculating their sizes
        svg.appendChild(text);
    });
    let columnWidths = getColumnWidths(texts, nColumns);
    let columnOffsets = getColumnOffsets(columnWidths);
    let rowHeight = getMaxHeight(texts);
    texts.forEach((text, i) => {
        const columnWidth = columnWidths[i % nColumns];
        const columnOffset = columnOffsets[i % nColumns];
        const x = basePosition.x + (columnWidth - getWidth(text)) / 2 + columnOffset;
        text.setAttribute("x", x);

        const labelHeight = 50;
        const y = basePosition.y + labelHeight + Math.floor(i / nColumns) * rowHeight;
        text.setAttribute("y", y);
    });
    return sum(columnWidths);
}

/**
 * Calculate column widths
 * @param {SVGTextElement} texts 
 * @param {number} nColumns 
 */
function getColumnWidths(texts, nColumns) {
    let widths = [];
    for (let i = 0; i < nColumns; i++) {
        widths.push(getWidth(texts[i]));
    }
    for (let i = nColumns; i < texts.length; i++) {
        let width = getWidth(texts[i]);
        widths[i % nColumns] = Math.max(widths[i % nColumns], width);
    }
    return widths;
}

/**
 * Get width of `<text>`
 * @param {SVGTextElement} text 
 */
function getWidth(text) {
    return text.getBoundingClientRect().width;
}

/**
 * Get offset of columns
 * @param {number[]} columnWidths 
 */
function getColumnOffsets(columnWidths) {
    let offsets = [];
    let offset = 0;
    for (let i = 0; i < columnWidths.length; i++) {
        offsets.push(offset);
        offset += columnWidths[i];
    }
    return offsets;
}

/**
 * Add label for whole table
 * @param {SVGSVGElement} svg 
 * @param {string} name 
 * @param {Object} tablePosition Top-left dot of table
 * @param {number} tablePosition.x
 * @param {number} tablePosition.y
 * @param {number} tableWidth
 */
function addTableLabel(svg, name, tablePosition, tableWidth) {
    let position = movedHorizontally(tablePosition, tableWidth / 2);
    addText(svg, "Table " + name, position);
}

/**
 * Get max height of `<text>`
 * @param {SVGTextElement[]} texts 
 */
function getMaxHeight(texts) {
    let heights = texts.map(getHeight);
    console.log(max(heights));
    return max(heights);
}

/**
 * Get height of `<text>` element
 * @param {SVGTextElement} text 
 */
function getHeight(text) {
    return text.getBoundingClientRect().height;
}