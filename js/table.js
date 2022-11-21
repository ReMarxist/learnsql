class Table {
    /**
     * @param {SVGSVGElement} svg Container of Table
     */
    constructor(svg) {
        /** @type {SVGSVGElement} */
        this.svg = svg;
        /** @type {number[]} */
        this.columnWidths = null;
        /** @type {number} */
        this.height = null;
    }
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
    let table = new Table(svg);
    let texts = createTableTexts(headers, dataRows);
    let label = addTableLabel(svg, name);
    let textsPosition = movedVertically(position, getHeight(label));
    addTableTexts(table, texts, textsPosition, headers.length);
    addTableLines(table, position);
    positionTableLabel(table, label, position);
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
 * @param {Table} table
 * @param {SVGTextElement[]} texts 
 * @param {Object} basePosition Top-left dot of table
 * @param {number} basePosition.x
 * @param {number} basePosition.y
 * @param {number} nColumns Number of columns in table
 * @returns {number} Table width
 */
function addTableTexts(table, texts, basePosition, nColumns) {
    texts.forEach(text => {
        // Append texts to svg before calculating their sizes
        table.svg.appendChild(text);
    });
    let columnWidths = getColumnWidths(texts, nColumns);
    let columnOffsets = getColumnOffsets(columnWidths);
    let rowHeight = getMaxHeight(texts);
    texts.forEach((text, i) => {
        const columnWidth = columnWidths[i % nColumns];
        const columnOffset = columnOffsets[i % nColumns];
        const x = basePosition.x + (columnWidth - getWidth(text)) / 2 + columnOffset;
        text.setAttribute("x", x);

        const y = basePosition.y + Math.floor(i / nColumns) * rowHeight;
        text.setAttribute("y", y);
    });
    table.columnWidths = columnWidths;
    table.height = texts.length / nColumns * rowHeight;
}

/**
 * Add label for whole table
 * @param {SVGSVGElement} svg 
 * @param {string} name 
 */
function addTableLabel(svg, name) {
    let label = createText("Table " + name);
    svg.appendChild(label);
    return label;
}

/**
 * Position label for whole table
 * @param {Table} table 
 * @param {SVGTextElement} label 
 * @param {Object} tablePosition Top-left dot of table
 * @param {number} tablePosition.x
 * @param {number} tablePosition.y
 * @param {number[]} columnWidths
 */
function positionTableLabel(table, label, tablePosition, columnWidths) {
    let tableWidth = sum(table.columnWidths);
    label.setAttribute("x", tablePosition.x + (tableWidth - getWidth(label)) / 2);
    label.setAttribute("y", tablePosition.y);
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

/**
 * Add table lines
 * @param {Table} table 
 * @param {Object} tablePosition
 * @param {number} tablePosition.x
 * @param {number} tablePosition.y
 */
function addTableLines(table, tablePosition) {
    let columnOffsets = getColumnOffsets(table.columnWidths);
    for (let i = 0; i < table.columnWidths.length - 1; i++) {
        let line = createSvgElement("line");
        let x = tablePosition.x + columnOffsets[i];
        line.setAttribute("x1", x);
        line.setAttribute("x2", x);
        line.setAttribute("y1", tablePosition.y);
        line.setAttribute("y2", tablePosition.y + table.height);
        table.svg.appendChild(line);
    }
}