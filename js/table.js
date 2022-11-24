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
        this.rowHeight = null;
        /** @type {number} */
        this.height = null;
        /** @type {number} */
        this.width = null;
        /** @type {SVGTextElement[]} */
        this.texts = null;
        /** @type {SVGTextElement} */
        this.label = null;
        /** @type {SVGRectElement} */
        this.card = null;
        /** @type {SVGRectElement} */
        this.labelRect = null;
        /** @type {number} */
        this.nColumns = null;
        /** @type {number} */
        this.labelHeight = null;
        this.lidHeight = 10;
    }

    addCard() {
        this.card = addRect(this.svg, this.position);
    }

    addLabelRect() {
        this.labelRect = addRect(this.svg, this.position);
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
        this.nColumns = headers.length;
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
        this.label.style.fontWeight = "lighter";
        this.label.style.fontSize = "17px";
        this.svg.appendChild(this.label);
    }

    /**
     * Calculate sizes of table elements after their appending to svg
     */
    calculateSizes() {
        const labelMargin = 15;
        this.labelHeight = getHeight(this.label) + labelMargin + this.lidHeight;
    }

    /**
     * Resize rect that contains table
     */
    resizeCard() {
        setAttributes(this.card, {
            "width": "" + this.width,
            "height": "" + this.height,
        });
    }

    placeLabelRect() {
        setAttributes(this.labelRect, {
            "y": this.position.y + this.lidHeight,
        });
    }

    /**
     * Position label for whole table
     */
    placeLabel() {
        let y = this.position.y
            + this.lidHeight
            + (this.labelHeight - getHeight(this.label)) / 2;
        setAttributes(this.label, {
            "x": this.position.x + (this.width - getWidth(this.label)) / 2,
            "y": y,
        });
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
    table.addCard();
    table.addLabelRect();
    table.addTexts(headers, dataRows);
    table.addLabel(name);
    table.calculateSizes();
    placeTableTexts(table);
    table.placeLabelRect();
    table.placeLabel();
    table.resizeCard();
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
 * @returns {number} Table width
 */
function placeTableTexts(table) {
    let basePosition = movedVertically(table.position, table.labelHeight);
    table.columnWidths = getColumnWidths(table.texts, table.nColumns);
    let columnOffsets = getColumnOffsets(table.columnWidths);
    table.rowHeight = getMaxHeight(table.texts);
    table.texts.forEach((text, i) => {
        const columnWidth = table.columnWidths[i % table.nColumns];
        const columnOffset = columnOffsets[i % table.nColumns];
        setAttributes(text, {
            "x": basePosition.x + (columnWidth - getWidth(text)) / 2 + columnOffset,
            "y": basePosition.y + Math.floor(i / table.nColumns) * table.rowHeight,
        });
    });
    table.width = sum(table.columnWidths);
    table.height = table.labelHeight + table.texts.length / table.nColumns * table.rowHeight;
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
    const columnMargin = 15;
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