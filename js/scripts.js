let svg = mkSvg();
document.body.appendChild(svg);

let rect = mkRect();
svg.appendChild(rect);
addAnimation(rect);