/**
 * Create svg rect
 */
 function mkRect() {
    const ns = "http://www.w3.org/2000/svg";
    let rect = document.createElementNS(ns, "rect");
    rect.setAttribute("y", "20");
    rect.setAttribute("height", "50");
    rect.setAttribute("width", "50");
    rect.setAttribute("fill", "white");
    rect.setAttribute("stroke", "#1a73e8");
    rect.setAttribute("rx", "5");
    return rect;
}