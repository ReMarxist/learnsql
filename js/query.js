/**
 * @field 
 */
class QueryInput {
    static create() {
        let query = new QueryInput();
        query.addQuerySvg();
        query.addCaret();
        query.animateCaret();
        query.addShadowInput();
    }

    constructor() {
        /** @type {SVGSVGElement} */
        this.svg = null;
        /** @type {SVGLineElement} */
        this.caret = null;
        /** @type {HTMLInputElement} */
        this.shadowInput = null;
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
        document.body.appendChild(this.svg);
    }

    /**
     * Add editing caret to query input
     */
    addCaret() {
        this.caret = addLine(this.svg);
        let x = this.svg.clientWidth / 2;
        setAttributes(this.caret, {
            "x1": x,
            "y1": 10,
            "x2": x,
            "y2": 40,
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
     * Add invisible `<input>` to read user input
     */
    addShadowInput() {
        this.shadowInput = document.createElement("input");
        document.body.appendChild(this.shadowInput);
        this.shadowInput.style.opacity = "0";
        this.shadowInput.focus();
        this.shadowInput.addEventListener("input", event => {
            updateQuery(this.shadowInput.value);
        });
        this.shadowInput.addEventListener("blur", () => {
            this.shadowInput.focus();
        })
    }
}