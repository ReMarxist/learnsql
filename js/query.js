function addQueryInput() {
    let svg = createSvgElement("svg");
    svg.style.position = "fixed";
    svg.style.left = "0";
    svg.style.bottom = "0";
    svg.style.width = "100%";
    svg.style.height = "100px";
    svg.style.backgroundColor = "white";
    svg.style.borderTop = "3px #eaeaea solid";
    document.body.appendChild(svg);
}