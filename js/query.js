class QueryInput {
  /**
   * @param {TableCard} tableCard Table with data
   */
  static create (tableCard) {
    let query = new QueryInput(tableCard);
    query.animateCaret();
    query.clauses.forEach(clause => clause.initialTranslate());
    query.clauses.forEach(clause => clause.updateDisplay());
    query.clauses.forEach(clause => clause.listenMouseMove());
    query.updateCaret();
    query.listenResize();
    query.translate();
    return query;
  }

  getMaxLabelWidth () {
    let widths = this.clauses.map(clause => getWidth(clause.clauseLabel));
    return max(widths, 0);
  }

  /**
   * @param {TableCard} tableCard 
   */
  constructor (tableCard) {
    /** @type {TableCard} */
    this.tableCard = tableCard;
    /** @type {SVGSVGElement} */
    this.svg = this.addQuerySvg();
    /**
     * `<text>` for measurement text width
     * @type {SVGTextElement}
     */
    this.measurementText = this.addMeasurementText();
    /**
     * `<g>` containing query `<text>`s
     * @type {SVGGElement}
     */
    this.queryG = this.addQueryG();
    this.clauses = [new Clause(this, "SELECT", 0), new Clause(this, "FROM", 1)];
    this.activeClauseI = 0;
    /** @type {number} */
    this.expectedAnimationId = 0;
    /** @type {SVGLineElement} */
    this.caret = this.addCaret();
    /**
     * Caret that is shown when user mouse-moves in query clause input
     * @type {SVGLineElement} 
     */
    this.hoverCaret = this.createHoverCaret();
  }

  addQuerySvg () {
    let svg = createSvgElement("svg");
    restyle(svg, {
      position: "fixed",
      left: "0",
      bottom: "0",
      width: "100%",
      height: "100px",
      backgroundColor: "white",
      filter: "drop-shadow(rgba(0, 0, 0, 0.1) -5px 0px 5px)",
      font: "18px monospace",
    });
    document.body.appendChild(svg);
    return svg;
  }

  /**
   * Add editing caret to query input
   */
  addCaret () {
    let caret = addLine(this.svg);
    setAttributes(caret, {
      "stroke": "black",
    });
    return caret;
  }

  createHoverCaret () {
    let hoverCaret = createSvgElement("line");
    setAttributes(hoverCaret, {
      "stroke": "blue",
    });
    return hoverCaret;
  }

  addMeasurementText () {
    let measurementText = addText(this.svg, "");
    place(measurementText, {
      x: 0,
      y: -1000,
    });
    return measurementText;
  }

  /**
   * Add blinking animation to caret
   */
  animateCaret () {
    let animate = addAnimate(this.caret);
    setAttributes(animate, {
      "attributeName": "stroke-opacity",
      "values": "1;1;1;0;0;0",
      "dur": "1s",
      "repeatCount": "indefinite",
      "begin": "indefinite",
    });
    animate.beginElement();
  }

  /**
   * Add `<g>` containing user query
   */
  addQueryG () {
    let queryG = addG(this.svg);
    return queryG;
  }

  /**
   * Puts caret focus to active shadow input
   * @returns {Promise}
   */
  async focusActiveShadowInput () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.activeClause.focusShadowInput();
        resolve();
      }, 1);
    });
  }

  /**
   * Move caret between query clauses
   * @param {"ArrowDown" | "ArrowUp"} direction 
   */
  async moveCaretVertically (direction) {
    if (direction === "ArrowDown") {
      if (this.activeClauseI + 1 < this.clauses.length) {
        let currentPosition = this.activeClause.widthBeforeCaret;
        this.activeClauseI++;
        await this.focusActiveShadowInput();
        this.activeClause.moveCaretToApproximatePosition(currentPosition);
        this.updateCaret();
      }
    } else if (direction === "ArrowUp") {
      if (this.activeClauseI > 0) {
        let currentPosition = this.activeClause.widthBeforeCaret;
        this.activeClauseI--;
        await this.focusActiveShadowInput();
        this.activeClause.moveCaretToApproximatePosition(currentPosition);
        this.updateCaret();
      }
    }
  }

  /**
   * Temporarily stop caret animation
   */
  delayCaretAnimation () {
    let animates = this.caret.getElementsByTagName("animate");
    for (let animate of animates) {
      animate.remove();
    }
    let id = Math.random();
    this.expectedAnimationId = id;
    setTimeout(() => {
      if (this.expectedAnimationId === id) {
        this.animateCaret();
      }
    }, 300);
  }

  get queryGX () {
    return (this.svg.clientWidth - getWidth(this.queryG)) / 2;
  }

  /**
   * Calculate and set position of query `<g>`
   */
  translate () {
    translate(this.queryG, {
      x: this.queryGX,
      y: (this.svg.clientHeight - this.height) / 2,
    });
  }

  /** Get gap in pixels that separates queries */
  get gapBetweenQueries () {
    return 5;
  }

  get height () {
    let clausesSumHeight = sum(this.clauses.map(clause => clause.height));
    let nClauses = this.clauses.length;
    let nGaps = nClauses - 1;
    return clausesSumHeight + nGaps * this.gapBetweenQueries;
  }

  get activeClause () {
    return this.clauses[this.activeClauseI];
  }

  updateCaret () {
    this.activeClause.updateCaret();
  }

  listenResize () {
    window.addEventListener("resize", () => {
      this.translate();
      this.updateCaret();
    });
  }

  /**
   * @param {string} value 
   */
  isKeyWord (value) {
    return value === "select" || value === "from";
  }
}