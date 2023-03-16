/**
 * Clause block of SQL query
 */
class Clause {
  /**
   * @param {QueryInput} queryInput link to parent QueryInput
   * @param {("SELECT" | "FROM")} type
   * @param {number} clauseI index of clause
   */
  constructor (queryInput, type, clauseI) {
    /** @type {QueryInput} */
    this.queryInput = queryInput;
    /** @type {("SELECT" | "FROM")} */
    this.type = type;
    /** @type {number} */
    this.clauseI = clauseI;
    /** @type {HTMLInputElement} */
    this.shadowInput = this.addShadowInput();
    /**
     * `<g>` containing clause elements
     * @type {SVGGElement}
     */
    this.clauseG = addG(queryInput.queryG);
    /**
     * `<text>` containing SVG clause label
     * @type {SVGTextElement}
     */
    this.clauseLabel = this.addClauseLabel();
    /**
     * `<g>` containing clause `<text>`s
     * @type {SVGGElement}
     */
    this.textInputG = this.addTextInputG();
    /**
     * Frame surrounding nodes of clause input
     * @type {SVGRectElement}
     */
    this.inputFrame = this.addInputFrame();
  }

  /**
   * Add invisible `<input>` to read user input
   */
  addShadowInput () {
    let shadowInput = document.createElement("input");
    document.body.appendChild(shadowInput);
    shadowInput.style.opacity = "0";
    shadowInput.focus();
    shadowInput.addEventListener("input", () => {
      this.onInput();
    });
    shadowInput.addEventListener("blur", () => {
      this.queryInput.focusActiveShadowInput();
    })
    document.addEventListener("selectionchange", () => {
      this.updateCaret();
    });
    return shadowInput;
  }

  focusShadowInput () {
    this.shadowInput.focus();
  }

  /**
   * Update value of shadow input and update display
   * @param {string} newValue 
   */
  updateValue (newValue) {
    this.shadowInput.value = newValue;
    this.onInput();
  }

  /**
   * Handle input event
   */
  onInput () {
    this.queryInput.delayCaretAnimation();
    this.updateDisplay();
    this.updateCaret();
    this.queryInput.translate();
  }

  /**
   * Update display of svg elements
   */
  updateDisplay () {
    this.textInputG.remove();
    this.textInputG = this.addTextInputG();
    let nodes = this.splitIntoNodes(this.value);
    let currentWidth = 0;
    nodes.forEach(node => {
      let text = addText(this.textInputG, node);
      this.stylizeText(text);
      place(text, {
        x: currentWidth,
        y: this.height / 2,
      });
      currentWidth += getWidth(text);
    });
    this.resizeInputFrame();
    this.placeInputFrame();
  }

  addTextInputG () {
    let g = addG(this.clauseG);
    translate(g, {
      x: this.textInputGX,
      y: 0,
    });
    return g;
  }

  /**
   * Get x coordinate of text input `<g>` relative to `this.clauseG`
   */
  get textInputGX() {
    let labelMargin = 10;
    return getWidth(this.clauseLabel) + labelMargin;
  }

  addClauseLabel () {
    let clauseLabel = addText(this.clauseG, this.type);
    restyle(clauseLabel, {
      "fontWeight": "bolder",
    });
    clauseLabel.setAttribute("fill", "#0077a9");
    return clauseLabel;
  }

  addInputFrame () {
    let inputFrame = addRect(this.clauseG);
    restyle(inputFrame, {
      "fill": "white",
      "stroke": "#c0c0c0",
      "rx": "3px",
      "filter": "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
    });
    return inputFrame;
  }

  get inputFrameMargin() {
    return 4;
  }

  resizeInputFrame () {
    let minWidth = 150;
    let minHeight = this.measureHeight("text");
    let textWidth = this.measureWidth(this.value);
    let textHeight = this.measureHeight(this.value);
    resize(this.inputFrame, {
      width: Math.max(minWidth, textWidth + 2 * this.inputFrameMargin),
      height: Math.max(minHeight, textHeight) + 2 * this.inputFrameMargin,
    });
  }

  placeInputFrame () {
    place(this.inputFrame, {
      x: this.textInputGX - this.inputFrameMargin,
      y: 0,
    })
  }

  /**
   * Split query into nodes
   * @param {string} query 
   */
  splitIntoNodes (query) {
    // Split by separators: , and non-breaking space
    const regex = /,| |[^, ]+/g;
    let iter = query.matchAll(regex);
    let nodes = [];
    for (let node of iter) {
      nodes.push(node[0]);
    }
    return nodes;
  }

  /**
   * Stylize individual `<text>` node
   * @param {SVGTextElement} text 
   */
  stylizeText (text) {
    let value = text.textContent.toLowerCase();
    if (this.queryInput.isKeyWord(value)) {
      text.style.fontWeight = "bolder";
      text.style.fontStyle = "italic";
      text.setAttribute("fill", "#0077a9");
    } else if (value === "*") {
      text.style.fontWeight = "bolder";
    } else if (this.queryInput.tableCard.isColumnLabel(value)) {
      text.style.fontWeight = "bolder";
    }
  }

  updateCaret () {
    this.queryInput.caret.remove();
    this.clauseG.appendChild(this.queryInput.caret);
    let textBeforeCaret = this.value.substring(0, this.caretPosition);
    let widthBeforeCaret = this.measureWidth(textBeforeCaret);
    const caretHeight = 24;
    const middle = this.height / 2;
    setAttributes(this.queryInput.caret, {
      "x1": "" + (this.textInputGX + widthBeforeCaret),
      "x2": "" + (this.textInputGX + widthBeforeCaret),
      "y1": "" + (middle - caretHeight / 2),
      "y2": "" + (middle + caretHeight / 2),
    });
  }

  get caretPosition () {
    return this.shadowInput.selectionEnd;
  }

  get inputX () {
    return (this.queryInput.svg.clientWidth - getWidth(this.clauseG)) / 2;
  }

  /**
   * Measure width of svg `text`
   * @param {string} text 
   */
  measureWidth (text) {
    let nodes = this.splitIntoNodes(text);
    let width = sum(nodes.map(node => {
      this.queryInput.measurementText.textContent = node;
      this.stylizeText(this.queryInput.measurementText);
      return getWidth(this.queryInput.measurementText);
    }));
    return width;
  }

  /**
   * Measure height of svg `text`
   * @param {string} text 
   */
  measureHeight (text) {
    let nodes = this.splitIntoNodes(text);
    let height = max(nodes.map(node => {
      this.queryInput.measurementText.textContent = node;
      this.stylizeText(this.queryInput.measurementText);
      return getHeight(this.queryInput.measurementText);
    }), 0);
    return height;
  }

  /**
   * Return last node in current input or null, if input is empty
   */
  getLastNode () {
    if (this.value === "") {
      return null;
    } else {
      let nodes = this.splitIntoNodes(this.value);
      return nodes[nodes.length - 1];
    }
  }

  get height () {
    return 30;
  }

  get value () {
    const nonBreaking = " ";
    return this.shadowInput.value.replaceAll(" ", nonBreaking);
  }
}

class QueryInput {
  /**
   * @param {TableCard} tableCard Table with data
   */
  static create (tableCard) {
    let query = new QueryInput(tableCard);
    query.animateCaret();
    query.clauses.forEach(clause => clause.updateDisplay());
    query.updateCaret();
    query.listenResize();
    query.translate();
    return query;
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
    this.clauses = [new Clause(this, "SELECT", 0)];
    this.activeClauseI = 0;
    //[new Clause("SELECT"), new Clause("FROM")];
    /** @type {number} */
    this.expectedAnimationId = 0;
    /** @type {SVGLineElement} */
    this.caret = this.addCaret();
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
    });
  }

  /**
   * Add `<g>` containing user query
   */
  addQueryG () {
    let queryG = addG(this.svg);
    return queryG;
  }

  focusActiveShadowInput () {
    setTimeout(() => {
      this.activeClause.focusShadowInput();
    }, 1);
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
      let animates = this.caret.getElementsByTagName("animate");
      if (this.expectedAnimationId === id) {
        this.animateCaret();
      }
    }, 500);
  }

  /**
   * Calculate and set position of query `<g>`
   */
  translate () {
    translate(this.queryG, {
      x: (this.svg.clientWidth - getWidth(this.queryG)) / 2,
      y: (this.svg.clientHeight - this.height) / 2,
    });
  }

  get height () {
    let clausesSumHeight = sum(this.clauses.map(clause => clause.height));
    let clauseMargin = 10;
    let nClauses = this.clauses.length;
    let nMargins = nClauses - 1;
    return clausesSumHeight + nMargins * clauseMargin;
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