/**
 * @field 
 */
class QueryInput {
    static create() {
        let query = new QueryInput();
        query.addQuerySvg();
        query.addCaret();
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
    }

    addQuerySvg() {
        this.svg = createSvgElement("svg");
        this.svg.style.position = "fixed";
        this.svg.style.left = "0";
        this.svg.style.bottom = "0";
        this.svg.style.width = "100%";
        this.svg.style.height = "100px";
        this.svg.style.backgroundColor = "white";
        this.svg.style.borderTop = "3px #eaeaea solid";
        restyle(this.svg, {
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

    /**
     * Add blinking animation to caret
     */
    animateCaret() {
        let animate = addAnimate(this.caret);
        setAttributes(animate, {
            "attributeName": "stroke-opacity",
            "values":"1;1;1;0;0;0",
            "dur":"1s",
            "repeatCount": "indefinite",
        });
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
        this.shadowInput.addEventListener("input", event => {
            this.updateQuery(this.shadowInput.value);
        });
        this.shadowInput.addEventListener("blur", () => {
            this.shadowInput.focus();
        })
    }

    /**
     * Update svg query value
     * @param {string} value New value
     */
    updateQuery(value) {
        place(this.query, {
            x: (this.svg.clientWidth - getWidth(this.query)) / 2,
            y: (this.svg.clientHeight / 2),
        });
        this.query.textContent = value;
    }
}