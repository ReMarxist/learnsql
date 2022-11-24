class Table {
    /**
     * @param {SVGSVGElement} svg Container of Table
     * @param {{x: number, y: number}} position Top-left dot of table
     */
    constructor(svg, position) {
        /** @type {SVGSVGElement} */
        this.svg = svg;
        /** @type {{x: number, y: number}} */
        this.position = position;
        /** @type {number[]} */
        this.columnWidths = null;
        /** @type {number} */
        this.height = null;
        /** @type {SVGTextElement[]} */
        this.texts = null;
        /** @type {SVGTextElement} */
        this.label = null;
    }

    /**
     * Create `<text>` tags and append them to svg
     * @param {string[]} headers 
     * @param {string[][]} dataRows 
     */
    addTexts(headers, dataRows) {
        let headerSvgs = headers.map(createText);
        headerSvgs.forEach(el => {
            el.style.fontWeight = "bold";
        });
        let dataSvgs = dataRows.flatMap(row => row.map(createText));
        this.texts = headerSvgs.concat(dataSvgs);
        this.texts.forEach(text => {
            // Append texts to svg before calculating their sizes
            this.svg.appendChild(text);
        });
    }

    /**
     * Add label for whole table
     * @param {string} name Table name
     */
    addLabel(name) {
        this.label = createText(name);
        label.style.fontWeight = "bold";
        this.svg.appendChild(this.label);
    }
}

/**
 * Create svg table
 * @param {SVGSVGElement} svg
 * @param {string} name Table name
 * @param {{x: number, y: number}} position Position of table
 * @param {string[]} headers Headers of table (names of columns)
 * @param {string[][]} dataRows Data that fills the table
 */
 function addTable(svg, name, position, headers, dataRows) {
    let table = new Table(svg, position);
    table.addTexts(headers, dataRows);
    table.addLabel(name);
    let textsPosition = movedVertically(position, getHeight(table.label));
    placeTableTexts(table, textsPosition, headers.length);
    placeTableLabel(table, table.label, position);
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
 * Calculate positions and place `<text>`s on `<svg>`
 * @param {Table} table
 * @param {SVGTextElement[]} texts 
 * @param {{x: number, y: number}} basePosition Top-left dot of table
 * @param {number} nColumns Number of columns in table
 * @returns {number} Table width
 */
function placeTableTexts(table, basePosition, nColumns) {
    let columnWidths = getColumnWidths(table.texts, nColumns);
    let columnOffsets = getColumnOffsets(columnWidths);
    let rowHeight = getMaxHeight(table.texts);
    table.texts.forEach((text, i) => {
        const columnWidth = columnWidths[i % nColumns];
        const columnOffset = columnOffsets[i % nColumns];
        setAttributes(text, {
            "x": basePosition.x + (columnWidth - getWidth(text)) / 2 + columnOffset,
            "y": basePosition.y + Math.floor(i / nColumns) * rowHeight,
        });
    });
    table.columnWidths = columnWidths;
    table.height = table.texts.length / nColumns * rowHeight;
}

/**
 * Position label for whole table
 * @param {Table} table 
 * @param {SVGTextElement} label 
 * @param {{x: number, y: number}} tablePosition Top-left dot of table
 * @param {number[]} columnWidths
 */
function placeTableLabel(table, label, tablePosition, columnWidths) {
    let tableWidth = sum(table.columnWidths);
    setAttributes(label, {
        "x": tablePosition.x + (tableWidth - getWidth(label)) / 2,
        "y": tablePosition.y,
    });
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
    const columnMargin = 10;
    widths = widths.map(w => w + columnMargin);
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
 * @param {{x: number, y: number}} tablePosition
 */
function addTableLines(table, tablePosition) {
    let columnOffsets = getColumnOffsets(table.columnWidths);
    for (let i = 1; i < table.columnWidths.length; i++) {
        let line = createSvgElement("line");
        let x = tablePosition.x + columnOffsets[i];
        setAttributes(line, {
            "x1": x,
            "x2": x,
            "y1": tablePosition.y,
            "y2": tablePosition.y + table.height,
            "stroke": "black",
        });
        table.svg.appendChild(line);
    }
}