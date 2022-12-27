class TableCard {
  /**
   * Create svg table card
   * @param {Object} params
   * @param {SVGSVGElement} params.svg
   * @param {string} params.tableName Table name
   * @param {string[]} params.data Headers and data
   * @param {number} params.nColumns Number of columns
   */
  static add (params) {
    let card = new TableCard(params.svg, params.data, params.nColumns);
    // Append elements to svg before calculating their sizes
    card.addCard();
    card.addLid();
    card.addTable();
    card.addLabelRect();
    card.addLabel(params.tableName);
    card.calculateSizes();
    card.setOnMouseMove();
    card.setOnMouseLeave();
    card.resizeLid();
    card.transformTable();
    card.transformLabelRect();
    card.placeLabel();
    card.resizeCard();
    card.placeCardG();
    card.listenResize();
    return card;
  }

  /**
   * @param {SVGSVGElement} svg Container of table card
   * @param {string[]} data Headers and data
   * @param {number} nColumns Number of columns
   */
  constructor (svg, data, nColumns) {
    /** @type {SVGSVGElement} */
    this.svg = svg;
    /** @type {string[]} */
    this.data = data;
    /** @type {number} */
    this.nColumns = nColumns;
    /** @type {number} */
    this.nRows = data.length / nColumns;
    /** @type {SVGGElement} */
    this.cardG = null;
    /** @type {SVGGElement} */
    this.tableG = null;
    /** @type {SVGGElement} */
    this.tableBackground = null;
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
    /** @type {SVGRectElement} */
    this.columnFraming = null;
    /** @type {number} */
    this.framingColumnI = null;
    /** @type {number} */
    this.labelHeight = null;
    this.lidHeight = 8;
    this.dataRowsTopMargin = 0;
    this.labelMargin = 8;
    this.lidAdjust = 0.1;
  }

  addCard () {
    this.cardG = addG(this.svg);
    this.card = addRect(this.cardG);
    setAttributes(this.card, {
      "fill": "white",
      "stroke": "white",
      "rx": "5",
    });
    this.card.style.filter = "drop-shadow(3px 3px 2px rgba(200, 200, 200, .7))";
  }

  addLid () {
    this.lid = addRect(this.cardG);
    place(this.lid, {
      x: this.lidAdjust,
      y: 0,
    });
    setAttributes(this.lid, {
      "fill": "#3491dc",
      "stroke": "#3491dc",
      "rx": "5",
    });
  }

  addLabelRect () {
    this.labelRect = addRect(this.cardG);
    setAttributes(this.labelRect, {
      "fill": "#f1f6f8",
      "stroke": "#e2e8f0",
    });
  }

  /**
   * Add table background rect to make cursor: pointer style
   * work on whole table
   */
  addTableBackground () {
    this.tableBackground = addRect(this.tableG);
    setAttributes(this.tableBackground, {
      "stroke": "white",
      "fill": "white",
      "rx": "5",
    });
  }

  addRowsHighlight () {
    let nHighlights = Math.floor(this.nRows / 2);
    this.rowsHighlight = increasing(nHighlights)
      .map(_ => {
        let rect = addRect(this.tableG);
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
  addTexts () {
    this.texts = this.data.map(content => addText(this.tableG, content));
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
  }

  /**
   * Add label for table
   * @param {string} name Table name
   */
  addLabel (name) {
    this.label = createText(name);
    this.label.style.fontWeight = "lighter";
    this.label.style.fontSize = "17px";
    this.label.style.dominantBaseline = "middle";
    this.cardG.appendChild(this.label);
  }

  addTable () {
    this.tableG = addG(this.cardG);
    setAttributes(this.tableG, {
      "cursor": "pointer",
    });
    this.addTableBackground();
    this.addRowsHighlight();
    this.addTexts();
  }

  /**
   * Calculate sizes of table card elements after their appending to svg
   */
  calculateSizes () {
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
  resizeCard () {
    resize(this.card, this);
  }

  placeCardG () {
    translate(this.cardG, {
      x: (this.svg.clientWidth - this.width) / 2,
      y: 20,
    });
  }

  setOnMouseMove () {
    this.tableG.addEventListener("mousemove", mouseEvent => {
      if (this.columnFraming === null) {
        this.addColumnFraming();
        this.calculateFramingColumnI(mouseEvent);
        this.transformColumnFraming();
      } else if (this.framingColumnChanged(mouseEvent)) {
        this.calculateFramingColumnI(mouseEvent);
        this.transformColumnFraming();
      }
    });
  }

  /**
   * Return true iff column that should be framed changed
   * @param {MouseEvent} mouseEvent 
   */
  framingColumnChanged (mouseEvent) {
    return this.framingColumnI !== this.getColumnI(mouseEvent);
  }

  /**
   * Calculate and set `this.framingColumnI`
   * @param {MouseEvent} mouseEvent 
   */
  calculateFramingColumnI (mouseEvent) {
    this.framingColumnI = this.getColumnI(mouseEvent);
  }

  addColumnFraming () {
    this.columnFraming = addRect(this.tableG);
    setAttributes(this.columnFraming, {
      "stroke": "#3491dc",
      "fill-opacity": "0",
      "rx": "5",
    });
  }

  transformColumnFraming () {
    const yOffset = 1;
    transform(this.columnFraming, {
      x: this.columnOffsets[this.framingColumnI],
      y: yOffset,
      width: this.columnWidths[this.framingColumnI],
      height: this.rowsHeight - yOffset,
    });
  }

  setOnMouseLeave () {
    this.tableG.addEventListener("mouseleave", mouseEvent => {
      if (this.columnFraming !== null) {
        this.columnFraming.remove();
        this.columnFraming = null;
      }
    });
  }

  /**
   * Get index of column that should be highlighted
   * @param {MouseEvent} mouseEvent 
   */
  getColumnI (mouseEvent) {
    for (let i = 0; i < this.nColumns; i++) {
      let border = this.cardG.getBoundingClientRect().x
        + this.columnOffsets[i]
        + this.columnWidths[i];
      if (mouseEvent.offsetX <= border) {
        return i;
      }
    }
    return this.nColumns - 1;
  }

  resizeLid () {
    resize(this.lid, {
      width: this.width - this.lidAdjust * 2,
      height: this.lidHeight * 2,
    });
  }

  transformLabelRect () {
    transform(this.labelRect, {
      x: 0,
      y: this.lidHeight,
      width: this.width,
      height: this.labelHeight,
    });
  }

  transformTable () {
    place(this.tableBackground, { x: 0, y: 0 });
    resize(this.tableBackground, {
      width: this.width,
      height: this.rowsHeight,
    });
    translate(this.tableG, this.textsPosition);
    this.transformRowsHighlight();
    this.placeTexts();
  }

  transformRowsHighlight () {
    this.rowsHighlight.forEach((highlight, i) => {
      transform(highlight, {
        x: 0,
        y: (i * 2 + 1) * this.rowHeight,
        width: this.width,
        height: this.rowHeight,
      });
    });
  }

  /**
   * Calculate positions and place `<text>`s on `<svg>`
   */
  placeTexts () {
    this.texts.forEach((text, i) => {
      const columnWidth = this.columnWidths[i % this.nColumns];
      const columnOffset = this.columnOffsets[i % this.nColumns];
      const rowI = Math.floor(i / this.nColumns);
      place(text, {
        x: (columnWidth - getWidth(text)) / 2 + columnOffset,
        y: (rowI + 0.5) * this.rowHeight,
      });
    });
  }

  /**
   * Position table label
   */
  placeLabel () {
    place(this.label, {
      x: (this.width - getWidth(this.label)) / 2,
      y: this.lidHeight + this.labelHeight / 2,
    });
  }

  /** Get array of column labels */
  get columnLabels () {
    return this.data.slice(0, this.nColumns);
  }

  get textsPosition () {
    return {
      x: 0,
      y: this.dataRowsTopMargin
        + this.lidHeight
        + this.labelHeight,
    };
  }

  /** Get height of all rows as a whole */
  get rowsHeight () {
    return this.nRows * this.rowHeight;
  }

  /**
   * Calculate column widths
   */
  calculateColumnWidths () {
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
  calculateColumnOffsets () {
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
  calculateRowHeight () {
    const verticalMargin = 2;
    let heights = this.texts.map(getHeight);
    this.rowHeight = verticalMargin + max(heights);
  }

  listenResize () {
    window.addEventListener("resize", () => {
      this.placeCardG();
    });
  }
}