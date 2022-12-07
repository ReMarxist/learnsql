class MainSvg {
    constructor() {
        /** @type {SVGSVGElement} */
        this.svg = addSvg(document.body);
    }

    static add() {
        let mainSvg = new MainSvg();
        mainSvg.stylize();
        mainSvg.resize();
        mainSvg.listenResize();
        return mainSvg;
    }

    stylize() {
        this.svg.style.position = "absolute";
    }

    resize() {
        this.svg.style.height = window.innerHeight;
    }

    listenResize() {
        document.addEventListener("resize", () => {
            this.resize();
        });
    }
}