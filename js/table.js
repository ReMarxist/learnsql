class TableCard {
    /**
     * @param {SVGSVGElement} svg Container of table card
     * @param {{x: number, y: number}} position Top-left dot of table card
     * @param {string[]} data Headers and data
     * @param {number} nColumns Number of columns
     */
    constructor(svg, position, data, nColumns) {
        /** @type {SVGSVGElement} */
        this.svg = svg;
        /** @type {{x: number, y: number}} */
        this.position = position;
        /** @type {string[]} */
        this.data = data;
        /** @type {number} */
        this.nColumns = nColumns;
        /** @type {number} */
        this.nRows = data.length / nColumns;
        /** @type {SVGGElement} */
        this.tableG = null;
        /** @type {number[]} */
        this.columnWidths = null;
        /** @type {number[]} */
        this.columnOffsets = null;
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
        this.lid = null;
        /** @type {SVGRectElement} */
        this.labelRect = null;
        /** @type {SVGRectElement[]} */
        this.rowsHighlight = null;
        /** @type {number} */
        this.labelHeight = null;
        this.lidHeight = 8;
        this.dataRowsTopMargin = 0;
        this.labelMargin = 8;
    }

    addCard() {
        this.card = addRect(this.svg, this.position);
        setAttributes(this.card, {
            "fill": "white",
            "stroke": "white",
            "rx": "5",
        });
        this.card.style.filter = "drop-shadow(3px 3px 2px rgba(200, 200, 200, .7))";
    }

    addLid() {
        this.lid = addRect(this.svg, this.position);
        setAttributes(this.lid, {
            "fill": "#3491dc",
            "stroke": "#3491dc",
            "rx": "5",
        });
    }

    addLabelRect() {
        this.labelRect = addRect(this.svg, this.position);
        setAttributes(this.labelRect, {
            "fill": "#f1f6f8",
            "stroke": "#e2e8f0",
        });
    }

    addRowsHighlight() {
        let nHighlights = Math.floor(this.nRows / 2);
        this.rowsHighlight = increasing(nHighlights)
            .map(_ => {
                let rect = addRect(this.tableG, {x: 0, y: 0});
                setAttributes(rect, {
                    "fill": "#f1f6f8",
                    "stroke": "#e2e8f0",
                });
                return rect;
            });
    }

    /**
     * Create `<text>` tags and append them to svg
     */
    addTexts() {
        this.texts = this.data.map(createText);
        for (let i = 0; i < this.nColumns; i++) {
            let header = this.texts[i];
            header.style.fontWeight = "bold";
            setAttributes(header, {
                "fill": "#334155",
            });
        }
        for (let i = this.nColumns; i < this.texts.length; i++) {
            let text = this.texts[i];
            setAttributes(text, {
                "fill": "#616f7b",
            });
        }
        // Append texts to svg before calculating their sizes
        this.texts.forEach(text => this.tableG.appendChild(text));
    }

    /**
     * Add label for table
     * @param {string} name Table name
     */
    addLabel(name) {
        this.label = createText(name);
        this.label.style.fontWeight = "lighter";
        this.label.style.fontSize = "17px";
        this.label.style.alignmentBaseline = "middle";
        this.svg.appendChild(this.label);
    }

    addTable() {
        this.tableG = createG();
        setAttributes(this.tableG, {
            "transform": 
                `translate(${this.textsPosition.x} ${this.textsPosition.y})`,
        });
        this.svg.appendChild(this.tableG);
        this.addRowsHighlight();
        this.addTexts();
    }

    /**
     * Calculate sizes of table card elements after their appending to svg
     */
    calculateSizes() {
        this.labelHeight = getHeight(this.label) + this.labelMargin;
        this.calculateColumnWidths();
        this.calculateColumnOffsets();
        this.calculateRowHeight();
        this.width = sum(this.columnWidths);
        this.height = this.lidHeight
            + this.labelHeight
            + this.dataRowsTopMargin
            + this.nRows * this.rowHeight;
    }

    /**
     * Resize rect of table card
     */
    resizeCard() {
        setAttributes(this.card, {
            "width": "" + this.width,
            "height": "" + this.height,
        });
    }

    setOnMouseMove() {
        this.svg.addEventListener("mousemove", ev => {
            if (ev.offsetX >= this.textsPosition.x
                && ev.offsetY >= this.textsPosition.y
                && ev.offsetX <= this.textsPosition.x + this.width
                && ev.offsetY <= this.textsPosition.y + this.rowsHeight) {
                console.log("rows move");
            }
        });
    }

    resizeLid() {
        setAttributes(this.lid, {
            "width": this.width,
            "height": this.lidHeight * 2,
        });
    }

    transformLabelRect() {
        setAttributes(this.labelRect, {
            "x": this.position.x,
            "y": this.position.y + this.lidHeight,
            "width": this.width,
            "height": this.labelHeight,
        });
    }

    transformRowsHighlight() {
        this.rowsHighlight.forEach((highlight, i) => {
            setAttributes(highlight, {
                "x": 0,
                "y": (i * 2 + 1) * this.rowHeight,
                "width": this.width,
                "height": this.rowHeight,
            });
        });
    }

    /**
     * Calculate positions and place `<text>`s on `<svg>`
     */
    placeTexts() {
        this.texts.forEach((text, i) => {
            const columnWidth = this.columnWidths[i % this.nColumns];
            const columnOffset = this.columnOffsets[i % this.nColumns];
            const rowI = Math.floor(i / this.nColumns);
            setAttributes(text, {
                "x": this.textsPosition.x
                    + (columnWidth - getWidth(text)) / 2
                    + columnOffset,
                "y": this.textsPosition.y
                    + (rowI + 0.5) * this.rowHeight,
            });
        });
    }

    /**
     * Position table label
     */
    placeLabel() {
        let y = this.position.y
            + this.lidHeight
            + this.labelHeight / 2;
        setAttributes(this.label, {
            "x": this.position.x + (this.width - getWidth(this.label)) / 2,
            "y": y,
        });
    }

    get textsPosition() {
        let yOffset = this.dataRowsTopMargin
            + this.lidHeight
            + this.labelHeight;
        return movedVertically(this.position, yOffset);
    }

    /** Get height of all rows as a whole */
    get rowsHeight() {
        return this.nRows * this.rowHeight;
    }

    /**
     * Calculate column widths
     */
    calculateColumnWidths() {
        let widths = [];
        for (let i = 0; i < this.nColumns; i++) {
            widths.push(getWidth(this.texts[i]));
        }
        for (let i = this.nColumns; i < this.texts.length; i++) {
            let width = getWidth(this.texts[i]);
            widths[i % this.nColumns] = Math.max(widths[i % this.nColumns], width);
        }
        const columnMargin = 15;
        this.columnWidths = widths.map(w => w + columnMargin);
    }

    /**
     * Get offset of columns
     */
    calculateColumnOffsets() {
        let offsets = [];
        let offset = 0;
        for (let i = 0; i < this.columnWidths.length; i++) {
            offsets.push(offset);
            offset += this.columnWidths[i];
        }
        this.columnOffsets = offsets;
    }

    /**
     * Get max height of table `<text>`s
     */
    calculateRowHeight() {
        const verticalMargin = 2;
        let heights = this.texts.map(getHeight);
        this.rowHeight = verticalMargin + max(heights);
    }
}

/**
 * Create svg table card
 * @param {SVGSVGElement} svg
 * @param {string} name Table name
 * @param {{x: number, y: number}} position Position of table card
 * @param {string[]} data Headers and data
 * @param {number} nColumns Number of columns
 */
function addTableCard(svg, name, position, data, nColumns) {
    let tableCard = new TableCard(svg, position, data, nColumns);
    tableCard.addCard();
    tableCard.addLid();
    tableCard.addLabelRect();
    tableCard.addLabel(name);
    tableCard.addTable();
    tableCard.calculateSizes();
    tableCard.setOnMouseMove();
    tableCard.resizeLid();
    tableCard.transformRowsHighlight();
    tableCard.placeTexts();
    tableCard.transformLabelRect();
    tableCard.placeLabel();
    tableCard.resizeCard();
}