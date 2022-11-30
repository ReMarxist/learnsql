function addQueryInput() {
    let svg = addQuerySvg();
    let caret = addCaret(svg);
}

function addQuerySvg() {
    let svg = createSvgElement("svg");
    svg.style.position = "fixed";
    svg.style.left = "0";
    svg.style.bottom = "0";
    svg.style.width = "100%";
    svg.style.height = "100px";
    svg.style.backgroundColor = "white";
    svg.style.borderTop = "3px #eaeaea solid";
    document.body.appendChild(svg);
    return svg;
}

/**
 * Add editing caret to query input
 * @param {SVGSVGElement} svg 
 */
function addCaret(svg) {
    let caret = addLine(svg);
    let x = svg.clientWidth / 2;
    setAttributes(caret, {
        "x1": x,
        "y1": 10,
        "x2": x,
        "y2": 40,
        "stroke": "black",
    });
    return caret;
}