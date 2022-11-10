let svg = addSvg();

let button = addRect(svg, { x: 100, y: 100 });
button.style.cursor = "pointer";
button.id = "controlButton";

let rect = addRect(svg, { x: 10, y: 50 });
let animate = addAnimation(rect);

/* document.addEventListener("click", () => {
    addAnimation(rect);
});*/