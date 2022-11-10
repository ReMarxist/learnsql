let svg = addSvg();
let rect = addRect(svg, { x: 10, y: 50 });
// addAnimation(rect);
let button = addRect(svg, { x: 100, y: 100 });
button.style.cursor = "pointer";
document.addEventListener("click", () => {
    addAnimation(rect);
});