class QueryInput {
  /**
   * @param {TableCard} tableCard Table with data
   */
  static create (tableCard) {
    let query = new QueryInput(tableCard);
    query.animateCaret();
    query.updateCaret();
    query.listenResize();
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
    /** @type {SVGLineElement} */
    this.caret = this.addCaret();
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
    /** @type {HTMLInputElement} */
    this.shadowInput = this.addShadowInput();
    /** @type {number} */
    this.expectedAnimationId = 0;
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
      borderTop: "3px #eaeaea solid",
      font: "18px monospace",
    });
    document.body.appendChild(svg);
    return svg;
  }

  /**
   * Add editing caret to query input
   */
  addCaret () {
    const caretHeight = 30;
    let caret = addLine(this.svg);
    let middle = this.svg.clientHeight / 2;
    setAttributes(caret, {
      "stroke": "black",
      "y1": "" + (middle - caretHeight / 2),
      "y2": "" + (middle + caretHeight / 2),
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
      this.focusShadowInput();
    })
    document.addEventListener("selectionchange", () => {
      this.updateCaret();
    });
    return shadowInput;
  }

  focusShadowInput () {
    setTimeout(() => {
      this.shadowInput.focus();
    }, 1);
  }

  /**
   * Handle input event
   */
  onInput () {
    this.delayCaretAnimation();
    this.updateQuery();
    this.updateCaret();
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

  get value () {
    const nonBreaking = " ";
    return this.shadowInput.value.replaceAll(" ", nonBreaking);
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
   * Update query content
   */
  updateQuery () {
    let nodes = this.getNodes(this.value);
    this.queryG.remove();
    this.queryG = this.addQueryG();
    let currentWidth = 0;
    nodes.forEach(node => {
      let text = addText(this.queryG, node);
      this.stylizeText(text);
      place(text, {
        x: currentWidth,
        y: 0,
      });
      currentWidth += getWidth(text);
    });
    translate(this.queryG, {
      x: (this.svg.clientWidth - getWidth(this.queryG)) / 2,
      y: this.svg.clientHeight / 2,
    });
  }

  /**
   * Stylize individual `<text>` node
   * @param {SVGTextElement} text 
   */
  stylizeText (text) {
    let value = text.textContent.toLowerCase();
    if (this.isKeyWord(value)) {
      text.style.fontWeight = "bolder";
      text.style.fontStyle = "italic";
      text.setAttribute("fill", "#0077a9");
    } else if (value === "*") {
      text.style.fontWeight = "bolder";
    } else if (this.isColumnLabel(value)) {
      text.style.fontWeight = "bolder";
    }
  }

  /**
   * @param {string} value 
   */
  isKeyWord (value) {
    return value === "select" || value === "from";
  }

  /**
   * Is value corresponds to column label
   * @param {string} value 
   */
  isColumnLabel (value) {
    return this.tableCard.columnLabels
      .some(label => label.toLowerCase() === value.toLowerCase());
  }

  updateCaret () {
    let textBeforeCaret = this.value.substring(0, this.caretPosition);
    let widthBeforeCaret = this.measureWidth(textBeforeCaret);
    let x = this.inputX + widthBeforeCaret;
    setAttributes(this.caret, {
      "x1": "" + x,
      "x2": "" + x,
    });
  }

  /**
   * Measure width of svg `text`
   * @param {string} text 
   */
  measureWidth (text) {
    let nodes = this.getNodes(text);
    let width = sum(nodes.map(node => {
      this.measurementText.textContent = node;
      this.stylizeText(this.measurementText);
      return getWidth(this.measurementText);
    }));
    return width;
  }

  get inputX () {
    return (this.svg.clientWidth - getWidth(this.queryG)) / 2;
  }

  get caretPosition () {
    return this.shadowInput.selectionEnd;
  }

  listenResize () {
    window.addEventListener("resize", () => {
      this.updateQuery();
      this.updateCaret();
    });
  }

  /**
   * Split query into nodes
   * @param {string} query 
   */
  getNodes (query) {
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
   * Return last node in current input or null,
   * if input is empty
   */
  getLastNode () {
    if (this.value === "") {
      return null;
    } else {
      let nodes = this.getNodes(this.value);
      return nodes[nodes.length - 1];
    }
  }
}