class QueryInput {
    /**
     * @param {TableCard} tableCard Table with data
     */
    static create(tableCard) {
        let query = new QueryInput(tableCard);
        query.addQuerySvg();
        query.addCaret();
        query.addMeasurementText();
        query.animateCaret();
        query.addQuery();
        query.addShadowInput();
        query.updateCaret();
        query.listenResize();
    }

    /**
     * @param {TableCard} tableCard 
     */
    constructor(tableCard) {
        /** @type {TableCard} */
        this.tableCard = tableCard;
        /** @type {SVGSVGElement} */
        this.svg = null;
        /** @type {SVGLineElement} */
        this.caret = null;
        /** @type {HTMLInputElement} */
        this.shadowInput = null;
        /**
         * `<g>` containing query `<text>`s
         * @type {SVGGElement}
         */
        this.queryG = null;
        /**
         * `<text>` for measurement text width
         * @type {SVGTextElement}
         */
        this.measurementText = null;
        /** @type {number} */
        this.expectedAnimationId = null;
    }

    addQuerySvg() {
        this.svg = createSvgElement("svg");
        restyle(this.svg, {
            position: "fixed",
            left: "0",
            bottom: "0",
            width: "100%",
            height: "100px",
            backgroundColor: "white",
            borderTop: "3px #eaeaea solid",
            font: "18px monospace",
        });
        document.body.appendChild(this.svg);
    }

    /**
     * Add editing caret to query input
     */
    addCaret() {
        const caretHeight = 30;
        this.caret = addLine(this.svg);
        let middle = this.svg.clientHeight / 2;
        setAttributes(this.caret, {
            "stroke": "black",
            "y1": middle - caretHeight / 2,
            "y2": middle + caretHeight / 2,
        });
    }

    addMeasurementText() {
        this.measurementText = addText(this.svg, "");
        place(this.measurementText, {
            x: 0,
            y: -1000,
        });
    }

    /**
     * Add blinking animation to caret
     */
    animateCaret() {
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
    addQuery() {
        this.queryG = addG(this.svg);
    }

    /**
     * Add invisible `<input>` to read user input
     */
    addShadowInput() {
        this.shadowInput = document.createElement("input");
        document.body.appendChild(this.shadowInput);
        this.shadowInput.style.opacity = "0";
        this.shadowInput.focus();
        this.shadowInput.addEventListener("input", () => {
            this.onInput();
        });
        this.shadowInput.addEventListener("blur", () => {
            this.shadowInput.focus();
        })
        document.addEventListener("selectionchange", () => {
            this.updateCaret();
        });
    }

    /**
     * Handle input event
     */
    onInput() {
        this.delayCaretAnimation();
        this.updateQuery();
        this.updateCaret();
    }

    /**
     * Temporarily stop caret animation
     */
    delayCaretAnimation() {
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

    get value() {
        const nonBreaking = " ";
        return this.shadowInput.value.replaceAll(" ", nonBreaking);
    }

    /**
     * Update query content
     */
    updateQuery() {
        let nodes = this.getNodes(this.value);
        this.queryG.remove();
        this.addQuery();
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
    stylizeText(text) {
        let value = text.textContent.toLowerCase();
        if (value === "select" || value === "from") {
            text.style.fontWeight = "bolder";
            text.style.fontStyle = "italic";
            text.setAttribute("fill", "#0077a9");
        } else if (value === "*") {
            text.style.fontWeight = "bolder";
        } else if (this.tableCard.columnLabels.includes(text)) {
            text.style.fontWeight = "bolder";
        }
    }

    updateCaret() {
        let textBeforeCaret = this.value.substring(0, this.caretPosition);
        let widthBeforeCaret = this.measureWidth(textBeforeCaret);
        let x = this.inputX + widthBeforeCaret;
        setAttributes(this.caret, {
            "x1": x,
            "x2": x,
        });
    }

    /**
     * Measure width of svg `text`
     * @param {string} text 
     */
    measureWidth(text) {
        this.measurementText.textContent = text;
        let width = getWidth(this.measurementText);
        return width;
    }

    get inputX() {
        return (this.svg.clientWidth - getWidth(this.queryG)) / 2;
    }

    get caretPosition() {
        return this.shadowInput.selectionEnd;
    }

    listenResize() {
        window.addEventListener("resize", () => {
            this.updateQuery();
            this.updateCaret();
        });
    }

    /**
     * Split query into nodes
     * @param {string} query 
     */
    getNodes(query) {
        // Split by separators: , and non-breaking space
        const regex = /,| |[^, ]+/g;
        let iter = query.matchAll(regex);
        let nodes = [];
        for (let node of iter) {
            nodes.push(node[0]);
        }
        return nodes;
    }
}