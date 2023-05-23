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
    this.clauseG = addG(this.queryInput.queryG);
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
   * @param {MouseEvent} mouseEvent 
   */
  onMouseMove (mouseEvent) {
    this.updateHoverCaret(mouseEvent);
  }

  addListeners () {
    this.inputFrame.addEventListener("mousemove", mouseEvent => {
      this.onMouseMove(mouseEvent);
    });
    this.inputFrame.addEventListener("mouseleave", () => {
      this.queryInput.hoverCaret.remove();
    });
  }

  get x () {
    const maxLabelWidth = this.queryInput.getMaxLabelWidth();
    return maxLabelWidth - getWidth(this.clauseLabel);
  }

  /**
   * Return absolute x position of query clause
   */
  get absoluteX () {
    return this.queryInput.queryGX + this.x;
  }

  /**
   * Make translations that apply after clauses creation
   */
  initialTranslate () {
    const nGaps = this.clauseI - 1;
    translate(this.clauseG, {
      x: this.x,
      y: this.height * this.clauseI + this.queryInput.gapBetweenQueries * nGaps,
    });
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
    shadowInput.addEventListener("selectionchange", () => {
      this.queryInput.delayCaretAnimation();
      this.updateCaret();
    });
    shadowInput.addEventListener("keydown", keyboardEvent => {
      if (keyboardEvent.key === "ArrowDown" || keyboardEvent.key === "ArrowUp") {
        keyboardEvent.preventDefault();
        this.queryInput.delayCaretAnimation();
        this.queryInput.moveCaretVertically(keyboardEvent.key);
      }
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
    g.classList.add("text-input-g");
    g.addEventListener("mousemove", (mouseEvent) => {
      this.onMouseMove(mouseEvent)
    });
    g.addEventListener("mousele", () => {
      this.queryInput.hoverCaret.remove();
    });
    return g;
  }

  /**
   * Get x coordinate of text input `<g>` relative to `this.clauseG`
   */
  get textInputGX () {
    let labelMargin = 10;
    return getWidth(this.clauseLabel) + labelMargin;
  }

  addClauseLabel () {
    let clauseLabel = addText(this.clauseG, this.type);
    restyle(clauseLabel, {
      "fontWeight": "bolder",
    });
    place(clauseLabel, {
      x: 0,
      y: this.height / 2,
    });
    clauseLabel.setAttribute("fill", "#3491dc");
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

  get inputFrameMargin () {
    return 4;
  }

  resizeInputFrame () {
    let minWidth = 150;
    let minHeight = this.measureHeight("text");
    let textWidth = this.measureWidth(this.value);
    let textHeight = this.measureHeight(this.value);
    resize(this.inputFrame, {
      width: Math.max(minWidth, textWidth + 2 * this.inputFrameMargin),
      height: this.height,
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

  /**
   * @param {number} position 
   * @returns 
   */
  widthBeforePosition (position) {
    let text = this.value.substring(0, position);
    return this.measureWidth(text);
  }

  get widthBeforeCaret () {
    return this.widthBeforePosition(this.caretPosition);
  }

  /**
   * Get index of character, position before of which corresponds to position
   * @param {number} position position in pixels
   */
  getCharI (position) {
    const maxPosition = this.value.length;
    let i = 0;
    while (i < maxPosition && this.widthBeforePosition(i) < position) {
      i++;
    }
    if (i > 0) {
      const deltaI = Math.abs(position - this.widthBeforePosition(i));
      const deltaPrevious = Math.abs(position - this.widthBeforePosition(i - 1));
      if (deltaI <= deltaPrevious) {
        return i;
      } else {
        return i - 1;
      }
    } else {
      return 0;
    }
  }

  /**
   * Moves caret in shadow input so that its position in real input
   * made approximate to `position`
   * @param {number} position 
   */
  moveCaretToApproximatePosition (position) {
    this.caretPosition = this.getCharI(position);
  }

  updateCaret () {
    this.queryInput.caret.remove();
    this.clauseG.appendChild(this.queryInput.caret);
    const x = this.textInputGX + this.widthBeforeCaret;
    const caretHeight = 24;
    const middle = this.height / 2;
    setAttributes(this.queryInput.caret, {
      "x1": "" + x,
      "x2": "" + x,
      "y1": "" + (middle - caretHeight / 2),
      "y2": "" + (middle + caretHeight / 2),
    });
  }

  /**
   * @param {MouseEvent} mouseEvent 
   */
  updateHoverCaret (mouseEvent) {
    this.queryInput.hoverCaret.remove();
    this.clauseG.appendChild(this.queryInput.hoverCaret);
    const charI = this.getHoverCharI(mouseEvent);
    const x = this.textInputGX + this.widthBeforePosition(charI);
    const caretHeight = 24;
    const middle = this.height / 2;
    setAttributes(this.queryInput.hoverCaret, {
      "x1": "" + x,
      "x2": "" + x,
      "y1": "" + (middle - caretHeight / 2),
      "y2": "" + (middle + caretHeight / 2),
    });
    let animate = addAnimate(this.queryInput.hoverCaret);
    setAttributes(animate, {
      "attributeName": "stroke-opacity",
      "values": "1;0",
      "dur": "1s",
      "repeatCount": "1",
      "begin": "indefinite",
    });
    animate.beginElement();
  }

  /**
   * Return index of the character, after which hover caret should be displayed
   * @param {MouseEvent} mouseEvent 
   */
  getHoverCharI (mouseEvent) {
    const mouseOffset = mouseEvent.pageX - this.absoluteX - this.textInputGX;
    return this.getCharI(mouseOffset);
  }

  get caretPosition () {
    return this.shadowInput.selectionEnd;
  }

  set caretPosition (newValue) {
    this.shadowInput.selectionStart = newValue;
    this.shadowInput.selectionEnd = newValue;
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
    return 34;
  }

  get value () {
    const nonBreaking = " ";
    return this.shadowInput.value.replaceAll(" ", nonBreaking);
  }
}