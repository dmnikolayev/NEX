cat > frontend/js/scene.js <<'EOF'
export class SceneEngine {
    constructor(root) {
        if (!(root instanceof HTMLElement)) {
            throw new Error("SceneEngine: root element is required");
        }

        this.root = root;
        this.elements = new Map();
    }

    createElement(tag, className, parent = this.root) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        parent.appendChild(element);

        return element;
    }

    register(name, element) {
        this.elements.set(name, element);
        return element;
    }

    get(name) {
        return this.elements.get(name) ?? null;
    }

    mount() {
        this.root.replaceChildren();
        this.root.classList.add("scene");

        this.createSky();
        this.createGround();
        this.createGrid();
        this.createHouse();
        this.createEnergyEquipment();
        this.createStatusLabels();

        requestAnimationFrame(() => {
            this.root.classList.add("scene--ready");
        });
    }

    createSky() {
        const sky = this.register(
            "sky",
            this.createElement("section", "scene__sky")
        );

        this.createElement("div", "scene__glow", sky);
        this.createElement("div", "scene__cloud scene__cloud--one", sky);
        this.createElement("div", "scene__cloud scene__cloud--two", sky);
        this.createElement("div", "scene__cloud scene__cloud--three", sky);
    }

    createGround() {
        const ground = this.register(
            "ground",
            this.createElement("section", "scene__ground")
        );

        this.createElement("div", "scene__hill scene__hill--back", ground);
        this.createElement("div", "scene__hill scene__hill--front", ground);
    }

    createGrid() {
        const grid = this.register(
            "grid",
            this.createElement("div", "grid-source")
        );

        grid.innerHTML = `
            <div class="grid-source__pole"></div>
            <div class="grid-source__arm"></div>
            <div class="grid-source__wire grid-source__wire--one"></div>
            <div class="grid-source__wire grid-source__wire--two"></div>

            <div class="object-label object-label--grid">
                <span class="object-label__title">Мережа</span>
                <strong>230 В</strong>
                <small>50.0 Гц</small>
            </div>
        `;
    }

    createHouse() {
        const house = this.register(
            "house",
            this.createElement("article", "house")
        );

        house.innerHTML = `
            <div class="house__shadow"></div>

            <div class="house__body">
                <div class="house__roof">
                    <div class="solar-array" aria-label="Сонячні панелі">
                        <div class="solar-panel"></div>
                        <div class="solar-panel"></div>
                        <div class="solar-panel"></div>
                        <div class="solar-panel"></div>
                    </div>

                    <div class="starlink">
                        <div class="starlink__mast"></div>
                        <div class="starlink__dish"></div>
                    </div>
                </div>

                <div class="house__wall">
                    <div class="house__window house__window--left">
                        <span></span>
                    </div>

                    <div class="house__door"></div>

                    <div class="house__window house__window--right">
                        <span></span>
                    </div>
                </div>

                <div class="house__terrace"></div>
            </div>

            <div class="object-label object-label--house">
                <span class="object-label__title">Будинок</span>
                <strong>742 Вт</strong>
            </div>

            <div class="object-label object-label--solar">
                <span class="object-label__title">Сонце</span>
                <strong>2.8 кВт</strong>
            </div>

            <div class="object-label object-label--starlink">
                <span class="status-dot status-dot--online"></span>
                <span>Starlink онлайн</span>
            </div>
        `;
    }

    createEnergyEquipment() {
        const equipment = this.register(
            "equipment",
            this.createElement("section", "energy-equipment")
        );

        equipment.innerHTML = `
            <div class="inverter">
                <div class="inverter__screen"></div>
                <div class="inverter__brand">DEYE</div>

                <div class="object-label object-label--inverter">
                    <span class="object-label__title">Інвертор</span>
                    <strong>Сонячний режим</strong>
                </div>
            </div>

            <div class="battery">
                <div class="battery__level"></div>
                <div class="battery__terminals"></div>

                <div class="object-label object-label--battery">
                    <span class="object-label__title">Батарея</span>
                    <strong>6 год 40 хв</strong>
                    <small>84%</small>
                </div>
            </div>
        `;
    }

    createStatusLabels() {
        const status = this.register(
            "status",
            this.createElement("footer", "scene-status")
        );

        status.innerHTML = `
            <div class="scene-status__item">
                <span class="status-dot status-dot--online"></span>
                <span>Будинок працює нормально</span>
            </div>

            <div class="scene-status__time" id="scene-clock">--:--</div>
        `;
    }
}
EOF
