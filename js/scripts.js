let div = addDiv();
let svg = addSvg(div);

addTableScenario();

function addTableScenario() {
    let headers = ["Rank", "Company", "Country", "Industry", "Revenue"];
    let dataRows = [
        ["1", "Walmart", "United States", "Retail", "572.8"],
        ["2", "Amazon", "United States", "Internet Services and Retailing", "469.8"],
        ["3", "State Grid", "China", "Energy", "460.6"],
        ["4", "China National Petroleum", "China", "Petroleum", "411.7"],
        ["5", "Sinopec Group", "China", "Petroleum", "401.3"],
        ["6", "Saudi Aramco", "Saudi Arabia", "Energy",	"400.4"],
        ["7", "Apple", "United States", "Technology", "365.8"],
        ["8", "Volkswagen", "Germany", "Automobiles", "295.8"],
        ["9", "China Construction", "China", "Engineering",	"293.7"],
        ["10", "CVS Health", "United States", "Health care", "292.1"]
    ];

    addTable(svg, "FortuneGlobal", { x: 50, y: 50 }, headers, dataRows);
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