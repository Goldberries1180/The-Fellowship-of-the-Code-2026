// ============================================================
// SC-1: Inventory & Resource Tracking (Artifact V)
// ============================================================

// --- Provisions (Food + Water → Rations) ---
const FOOD_ITEMS = {
    lembas: { label: 'Lembas',     unit: 'pcs.' },
    apple:  { label: 'Äpfel',      unit: 'pcs.' },
    potato: { label: 'Kartoffeln', unit: 'pcs.' }
};

const WATER = { label: 'Wasser', unit: 'ml', step: 100 };

// One ration = what one member needs for one stretch of the journey
const RATION = { lembas: 1, apple: 2, potato: 3, water: 300 };
const TARGET_RATIONS = 6;

// --- Gear ---
const GEAR_ITEMS = {
    schlafsack: { label: 'Schlafsack', unit: 'pcs.', target: 3 },
    schwert:    { label: 'Schwert',    unit: 'pcs.', target: 3 },
    feuerholz:  { label: 'Feuerholz',  unit: 'pcs.', target: 6 }
};

// Confidence = how ready the Fellowship is to continue
const CONFIDENCE_WEIGHTS = { rations: 0.6, gear: 0.4 };


// ============================================================
// STATE
// ============================================================

const inv = {
    lembas: 4, apple: 8, potato: 9, water: 1500,
    schlafsack: 2, schwert: 2, feuerholz: 3
};

let confidenceChart = null;


// ============================================================
// CALCULATIONS
// ============================================================

// How many COMPLETE rations can we assemble? Limited by the scarcest ingredient.
function completeRations() {
    return Math.floor(Math.min(
        ...Object.entries(RATION).map(([id, per]) => inv[id] / per)
    ));
}

// Which ingredient is holding us back? (the mismatch driver)
function rationBottleneck() {
    let bottleneck = null;
    let lowest = Infinity;
    Object.entries(RATION).forEach(([id, per]) => {
        const possible = inv[id] / per;
        if (possible < lowest) { lowest = possible; bottleneck = id; }
    });
    return bottleneck;
}

function gearReadiness() {
    const items = Object.entries(GEAR_ITEMS);
    const sum = items.reduce((acc, [id, g]) => acc + Math.min(inv[id] / g.target, 1), 0);
    return (sum / items.length) * 100;
}

function rationReadiness() {
    return Math.min(completeRations() / TARGET_RATIONS, 1) * 100;
}

function confidence() {
    return Math.round(
        CONFIDENCE_WEIGHTS.rations * rationReadiness() +
        CONFIDENCE_WEIGHTS.gear * gearReadiness()
    );
}


// ============================================================
// RENDER: item lists
// ============================================================

function rowMarkup(id, item) {
    return `
        <div class="rm-row" data-item="${id}">
            <span class="rm-row__label">${item.label}</span>
            <span class="rm-row__value">${inv[id]} ${item.unit}</span>
            <div class="rm-row__actions">
                <button type="button" data-action="use" data-item="${id}" aria-label="Use ${item.label}">−</button>
                <button type="button" data-action="add" data-item="${id}" aria-label="Add ${item.label}">+</button>
            </div>
        </div>`;
}

function renderLists() {
    const provisions = { ...FOOD_ITEMS, water: WATER };
    document.getElementById('rm-provisions-list').innerHTML =
        Object.entries(provisions).map(([id, item]) => rowMarkup(id, item)).join('');

    document.getElementById('rm-gear-list').innerHTML =
        Object.entries(GEAR_ITEMS).map(([id, item]) => rowMarkup(id, item)).join('');
}

function updateValues() {
    document.querySelectorAll('.rm-row').forEach(row => {
        const id = row.dataset.item;
        const item = FOOD_ITEMS[id] || GEAR_ITEMS[id] || (id === 'water' ? WATER : null);
        row.querySelector('.rm-row__value').textContent = `${inv[id]} ${item.unit}`;
    });
}


// ============================================================
// RENDER: rations summary
// ============================================================

function renderRations() {
    const rations = completeRations();
    const bottleneckId = rationBottleneck();
    const bottleneckLabel = FOOD_ITEMS[bottleneckId]?.label || WATER.label;

    document.getElementById('rm-ration-count').textContent = rations;
    document.getElementById('rm-ration-bottleneck').textContent =
        rations >= TARGET_RATIONS
            ? 'Fully provisioned for the road ahead.'
            : `Bottleneck: ${bottleneckLabel} — gather more to complete additional rations.`;
}


// ============================================================
// RENDER: confidence ring
// ============================================================

function confidenceColor(value) {
    if (value >= 66) return '#6B8E5A';   // ready
    if (value >= 34) return '#8B7355';   // partial
    return '#DB3731';                    // critical
}

function renderConfidence() {
    const value = confidence();
    const color = confidenceColor(value);
    const canvas = document.getElementById('rm-confidence-chart');

    document.getElementById('rm-confidence-value').textContent = value + '%';

    if (!confidenceChart) {
        confidenceChart = new Chart(canvas, {
            type: 'doughnut',
            data: { datasets: [{ data: [value, 100 - value], backgroundColor: [color, '#3A3228'], borderWidth: 0 }] },
            options: {
                cutout: '74%',
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 350 },
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    } else {
        confidenceChart.data.datasets[0].data = [value, 100 - value];
        confidenceChart.data.datasets[0].backgroundColor = [color, '#3A3228'];
        confidenceChart.update();
    }
}


// ============================================================
// RENDER: orchestrator
// ============================================================

function render() {
    updateValues();
    renderRations();
    renderConfidence();
}


// ============================================================
// ACTIONS
// ============================================================

function change(id, direction) {
    const step = id === 'water' ? WATER.step : 1;
    inv[id] = Math.max(0, inv[id] + direction * step);
    render();
}


// ============================================================
// INIT
// ============================================================

function initResourceManager() {
    renderLists();
    render();

    document.querySelector('.rm-page').addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;
        change(button.dataset.item, button.dataset.action === 'add' ? 1 : -1);
    });
}

document.addEventListener('DOMContentLoaded', initResourceManager);