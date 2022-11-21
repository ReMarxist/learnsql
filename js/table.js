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
    headerSvgs.forEach(el => {
        el.style.fontWeight = "bold";
    });
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
 * Get max height of `<text>`
 * @param {SVGTextElement[]} texts 
 */
function getMaxHeight(texts) {
    let heights = texts.map(getHeight);
    return max(heights);
}