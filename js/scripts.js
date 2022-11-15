let div = addDiv();
let svg = addSvg(div);

addTableScenario();

function addTableScenario() {
    addText(svg, "Таблица FortuneGlobal", { x: 50, y: 50 });
}

function addControlButtonScenario() {
    let rect = addRect(svg, { x: 10, y: 50 });
    let button = addRect(svg, { x: 100, y: 100 });
    button.style.cursor = "pointer";
    button.id = "controlButton";

    let logicalX = { val: 0 };
    button.addEventListener("click", () => {
        toggle(logicalX);
        let target = {
            x: 10 + logicalX.val * 50,
            y: 50,
        };
        animate(rect, target);
    });
}