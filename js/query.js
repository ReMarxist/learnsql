class QueryInput {
    static create() {
        let query = new QueryInput();
        query.addQuerySvg();
        query.addCaret();
        query.addMeasurementText();
        query.animateCaret();
        query.addQuery();
        query.addShadowInput();
    }

    constructor() {
        /** @type {SVGSVGElement} */
        this.svg = null;
        /** @type {SVGLineElement} */
        this.caret = null;
        /** @type {HTMLInputElement} */
        this.shadowInput = null;
        /**
         * `<text>` containing query 
         * @type {SVGTextElement}
         */
        this.query = null;
        /**
         * `<text>` for measurement text width
         * @type {SVGTextElement}
         */
        this.measurementText = null;
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
            font: "18px system-ui",
        });
        document.body.appendChild(this.svg);
    }

    /**
     * Add editing caret to query input
     */
    addCaret() {
        const caretHeight = 30;
        this.caret = addLine(this.svg);
        let x = this.svg.clientWidth / 2;
        let middle = this.svg.clientHeight / 2;
        setAttributes(this.caret, {
            "x1": x,
            "y1": middle - caretHeight / 2,
            "x2": x,
            "y2": middle + caretHeight / 2,
            "stroke": "black",
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
        animate.beginElementAt(3);
    }

    /**
     * Add `<text>` containing user query
     */
    addQuery() {
        this.query = addText(this.svg, "");
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
        this.replaceSpaces();
        this.updateQuery();
        this.updateCaret();
    }

    /**
     * Replace normal spaces with non-breaking spaces to output them correctly
     * in svg
     */
    replaceSpaces() {
        const nonBreaking = " ";
        this.shadowInput.value = this.shadowInput.value.replace(" ", nonBreaking);
    }

    /**
     * Update query content
     */
    updateQuery() {
        this.query.textContent = this.shadowInput.value;
        place(this.query, {
            x: this.inputX,
            y: (this.svg.clientHeight / 2),
        });
    }

    updateCaret() {
        let textBeforeCaret = this.shadowInput.value.substring(0, this.caretPosition);
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
        return (this.svg.clientWidth - getWidth(this.query)) / 2;
    }

    get caretPosition() {
        return this.shadowInput.selectionEnd;
    }
}