document.body.style.margin = "0";
let mainSvg = MainSvg.add().svg;
addTableScenario();

function addTableScenario () {
  let data = [
    "Rank", "Company", "Country", "Industry", "Revenue",
    "1", "Walmart", "United States", "Retail", "573",
    "2", "Amazon", "United States", "E-commerce", "470",
    "3", "State Grid", "China", "Energy", "461",
    "4", "China Petroleum", "China", "Petroleum", "412",
    "5", "Sinopec Group", "China", "Petroleum", "401",
    "6", "Saudi Aramco", "Saudi Arabia", "Energy", "400",
    "7", "Apple", "United States", "Technology", "366",
    "8", "Volkswagen", "Germany", "Automobiles", "296",
    "9", "China Construction", "China", "Engineering", "294",
    "10", "CVS Health", "United States", "Health care", "292",
  ];

  let card = TableCard.add({
    svg: mainSvg,
    tableName: "Corporations",
    data,
    nColumns: 5,
  });
  let query = QueryInput.create(card);
  card.setOnMouseClick(query);

  // Move keyboard focus to shadow input on every click
  window.document.addEventListener("click", () => {
    query.focusAllShadowInputs();
  });
}

function addControlButtonScenario () {
  let rect = addRect(mainSvg);
  place(rect, { x: 10, y: 50 });
  let button = addRect(mainSvg);
  place(button, { x: 100, y: 100 })
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