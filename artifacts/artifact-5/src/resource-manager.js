/* ============================================================
   Data & Consts
   ============================================================ */
   
const BACKPACK_LIMITS = {
    maxWeightKg: 25,
    maxVolumeL: 25
};

const RESOURCE_TARGETS = {
    foodKcal: 6000,
    waterMl: 6000,
    ropeM: 5,
    swords: 3,
    survivalDays: 3
};

const RESOURCE_THRESHOLDS = {
    categoryWarningPercent: 10,
    categoryOverfillConfirmationPercent: 100,
    backpackWeightWarningPercent: 90,
    backpackVolumeWarningPercent: 90
};

const RESOURCE_MESSAGES = {
    success: "Backpack well-stocked. You’re all set.",
    warning: {
        food: "Seems you will be hungry soon!",
        water: "You are running out of water!",
        gear: "You should upgrade your gear!"
    },
    error: {
        invalidAmount: "Enter positive whole numbers only.",
        addCapacity: "This exceeds your backpack capacity. Reduce the items before packing.",
        useUnavailable: (itemNames) => `You do not have enough of ${itemNames.join(", ")}. Use only what you have!`
    },
    manageSuccess: {
        add: "Success!Items have been added.",
        use: "Success! Items have been used."
    },
    info: "Calculations are based on a 25 L backpack with a maximum load of 25 kg and supplies for 3 days."
};

const RESOURCE_ITEMS = {
    food: {
        apple: {
            id: "apple",
            name: "Apple",
            unit: "pcs.",
            initialQuantity: 3,
            weightKgPerUnit: 0.2,
            volumeLPerUnit: 0.3,
            kcalPerUnit: 50
        },
        bread: {
            id: "bread",
            name: "Bread",
            unit: "pcs.",
            initialQuantity: 3,
            weightKgPerUnit: 0.5,
            volumeLPerUnit: 1.2,
            kcalPerUnit: 1200
        },
        jerky: {
            id: "jerky",
            name: "Jerky",
            unit: "pcs.",
            initialQuantity: 5,
            weightKgPerUnit: 0.2,
            volumeLPerUnit: 0.25,
            kcalPerUnit: 450
        }
    },
    water: {
        water: {
            id: "water",
            name: "Water",
            unit: "ml",
            initialQuantity: 6000,
            weightKgPerUnit: 0.001,
            volumeLPerUnit: 0.001,
            kcalPerUnit: 0
        }
    },
    gear: {
        rope: {
            id: "rope",
            name: "Rope",
            unit: "m",
            initialQuantity: 5,
            weightKgPerUnit: 0.15,
            volumeLPerUnit: 0.3,
            kcalPerUnit: 0
        },
        sword: {
            id: "sword",
            name: "Sword",
            unit: "pcs.",
            initialQuantity: 3,
            weightKgPerUnit: 2.5,
            volumeLPerUnit: 3,
            kcalPerUnit: 0
        }
    }
};

/* ============================================================
   State
   ============================================================ */

let inventoryState = createInitialInventoryState();

const resourceCharts = {};

/* ============================================================
   Calculation Functions
   ============================================================ */

function createInitialInventoryState() {
    return Object.fromEntries(
        Object.entries(RESOURCE_ITEMS).map(([categoryId, items]) => [
            categoryId,
            Object.fromEntries(
                Object.values(items).map((item) => [item.id, item.initialQuantity])
            )
        ])
    );
}

function roundValue(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getItems(categoryId = null, state = inventoryState) {
    const categories = categoryId ? { [categoryId]: RESOURCE_ITEMS[categoryId] } : RESOURCE_ITEMS;

    return Object.entries(categories).flatMap(([currentCategoryId, items]) =>
        Object.values(items).map((item) => ({
            ...item,
            category: currentCategoryId,
            quantity: state[currentCategoryId][item.id]
        }))
    );
}

function sumBy(items, key) {
    return items.reduce((total, item) => total + item.quantity * item[key], 0);
}

function calculateTotals(categoryId = null, state = inventoryState) {
    const items = getItems(categoryId, state);
    const weightKg = sumBy(items, "weightKgPerUnit");
    const volumeL = sumBy(items, "volumeLPerUnit");
    const kcal = sumBy(items, "kcalPerUnit");

    return {
        weightKg: roundValue(weightKg),
        volumeL: roundValue(volumeL),
        kcal: roundValue(kcal),
        weightPercent: roundValue((weightKg / BACKPACK_LIMITS.maxWeightKg) * 100),
        volumePercent: roundValue((volumeL / BACKPACK_LIMITS.maxVolumeL) * 100)
    };
}

function calculateQuantity(categoryId, state = inventoryState) {
    return getItems(categoryId, state).reduce((total, item) => total + item.quantity, 0);
}

function calculateGearPercent(state = inventoryState) {
    const ropePercent = (state.gear.rope / RESOURCE_TARGETS.ropeM) * 100;
    const swordPercent = (state.gear.sword / RESOURCE_TARGETS.swords) * 100;

    return roundValue((ropePercent + swordPercent) / 2);
}

const CATEGORY_STATUS_CONFIG = {
    food: {
        unit: "kcal",
        target: RESOURCE_TARGETS.foodKcal,
        getValue: (state) => calculateTotals("food", state).kcal
    },
    water: {
        unit: "ml",
        target: RESOURCE_TARGETS.waterMl,
        getValue: (state) => calculateQuantity("water", state)
    },
    gear: {
        unit: "%",
        target: 100,
        getValue: (state) => calculateGearPercent(state)
    }
};

function calculateCategoryStatus(categoryId, state = inventoryState) {
    const config = CATEGORY_STATUS_CONFIG[categoryId];
    const value = config.getValue(state);
    const percent = config.unit === "%" ? value : (value / config.target) * 100;

    return {
        category: categoryId,
        value: roundValue(value),
        target: config.target,
        unit: config.unit,
        percent: roundValue(percent),
        isWarning: percent <= RESOURCE_THRESHOLDS.categoryWarningPercent
    };
}

function calculateBackpackStatus(state = inventoryState) {
    const totals = calculateTotals(null, state);

    return {
        ...totals,
        isWeightWarning: totals.weightPercent >= RESOURCE_THRESHOLDS.backpackWeightWarningPercent,
        isVolumeWarning: totals.volumePercent >= RESOURCE_THRESHOLDS.backpackVolumeWarningPercent,
        isWeightOverLimit: totals.weightKg > BACKPACK_LIMITS.maxWeightKg,
        isVolumeOverLimit: totals.volumeL > BACKPACK_LIMITS.maxVolumeL
    };
}

/* ============================================================
   Markup dynamic generation functions
   ============================================================ */

function getIconPath(iconName) {
    return `../assets/icons/${iconName}.svg`;
}

function getCategoryLabel(categoryId) {
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

function renderResourceOverviewRows() {
    const list = document.getElementById("rm-resource-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    Object.keys(RESOURCE_ITEMS).forEach((categoryId) => {
        list.innerHTML += `
            <div class="rm-resource-row" data-category="${categoryId}">
                <img class="rm-resource-icon" src="${getIconPath(categoryId)}" alt="">
                <span class="rm-resource-label">${getCategoryLabel(categoryId)}</span>
                <canvas class="rm-resource-chart" aria-label="${getCategoryLabel(categoryId)} status"></canvas>
                <span class="rm-resource-value"></span>
            </div>
        `;
    });
}

function renderResourceDetailRows() {
    const list = document.getElementById("rm-detail-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    getItems().forEach((item) => {
        list.innerHTML += `
            <div class="rm-detail-row" data-category="${item.category}" data-item="${item.id}">
                <img class="rm-item-icon" src="${getIconPath(item.id)}" alt="">
                <span class="rm-item-label">${item.name}</span>
                <span class="rm-item-quantity"></span>
                <span class="rm-item-weight"></span>
            </div>
        `;
    });
}

function renderManageRows() {
    const list = document.getElementById("rm-manage-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    getItems().forEach((item) => {
        list.innerHTML += `
            <div class="rm-manage-row" data-category="${item.category}" data-item="${item.id}">
                <img class="rm-item-icon" src="${getIconPath(item.id)}" alt="">
                <label class="rm-item-label" for="amount-${item.id}">${item.name}</label>
                <input id="amount-${item.id}" class="rm-amount-input input" type="number" min="0" step="1" inputmode="numeric" placeholder="Enter amount">
                <span class="rm-item-unit">${item.unit}</span>
            </div>
        `;
    });
}

function initResourceManagerMarkup() {
    renderResourceOverviewRows();
    renderResourceDetailRows();
    renderManageRows();
}

/* ============================================================
   Global UI Functions
   ============================================================ */
   
function showAppScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.remove("is-active");
    });

    document.getElementById(screenId).classList.add("is-active");
}

function initBottomNavigation() {
    document.querySelectorAll(".bottomnav__button").forEach((button) => {
        const icon = button.querySelector("img");

        if (icon) {
            button.dataset.iconInactive = icon.getAttribute("src");
        }
    });

    document.querySelectorAll(".bottomnav__button[data-screen]").forEach((button) => {
        button.addEventListener("click", () => {
            showAppScreen(button.dataset.screen);
            setActiveBottomNav(button);
        });
    });
}


/* ============================================================
   UI Rendering Functions incl. Charts
   ============================================================ */

function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}

function getChartStyles(canvas) {
    const styles = getComputedStyle(canvas);

    return {
        fill: styles.getPropertyValue("--rm-chart-fill").trim(),
        track: styles.getPropertyValue("--rm-chart-track").trim()
    };
}

function clampPercent(value) {
    return Math.min(Math.max(value, 0), 100);
}

function createProgressChart(canvas) {
    const chartStyles = getChartStyles(canvas);

    return new Chart(canvas, {
        type: "bar",
        data: {
            labels: [""],
            datasets: [
                {
                    data: [0],
                    backgroundColor: chartStyles.fill,
                    borderRadius: 999,
                    borderSkipped: false,
                    barThickness: 9
                },
                {
                    data: [100],
                    backgroundColor: chartStyles.track,
                    borderRadius: 999,
                    borderSkipped: false,
                    barThickness: 9
                }
            ]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            events: [],
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    display: false,
                    stacked: true,
                    min: 0,
                    max: 100
                },
                y: {
                    display: false,
                    stacked: true
                }
            }
        }
    });
}

function updateProgressChart(chart, canvas, percent, isWarning = false) {
    const chartValue = clampPercent(percent);

    canvas.classList.toggle("is-warning", isWarning);

    const chartStyles = getChartStyles(canvas);

    chart.data.datasets[0].data = [chartValue];
    chart.data.datasets[1].data = [100 - chartValue];

    chart.data.datasets[0].backgroundColor = chartStyles.fill;
    chart.data.datasets[1].backgroundColor = chartStyles.track;

    chart.update();
}

function renderProgressChart(chartId, canvas, percent, isWarning = false) {
    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    if (!resourceCharts[chartId]) {
        resourceCharts[chartId] = createProgressChart(canvas);
    }

    updateProgressChart(resourceCharts[chartId], canvas, percent, isWarning);
}

function renderResourceManager() {
    const backpackStatus = calculateBackpackStatus();

    setText('[data-backpack-status="weight"] .rm-status-value', `${backpackStatus.weightKg} / ${BACKPACK_LIMITS.maxWeightKg} kg`);
    setText('[data-backpack-status="volume"] .rm-status-value', `${backpackStatus.volumePercent}% taken up`);

    renderProgressChart(
        "weight",
        document.querySelector('[data-backpack-status="weight"] .rm-status-chart'),
        backpackStatus.weightPercent,
        false
    );

    renderProgressChart(
        "volume",
        document.querySelector('[data-backpack-status="volume"] .rm-status-chart'),
        backpackStatus.volumePercent,
        false
    );

    Object.keys(RESOURCE_ITEMS).forEach((categoryId) => {
        const status = calculateCategoryStatus(categoryId);

        setText(`[data-category="${categoryId}"] .rm-resource-value`, `${status.percent}%`);

        renderProgressChart(
            categoryId,
            document.querySelector(`.rm-resource-row[data-category="${categoryId}"] .rm-resource-chart`),
            status.percent,
            status.isWarning
        );
    });

    getItems().forEach((item) => {
        const rowSelector = `.rm-detail-row[data-category="${item.category}"][data-item="${item.id}"]`;
        const itemWeight = roundValue(item.quantity * item.weightKgPerUnit);

        setText(`${rowSelector} .rm-item-quantity`, `${item.quantity} ${item.unit}`);
        setText(`${rowSelector} .rm-item-weight`, `${itemWeight} kg`);
    });

    const warningCategory = Object.keys(RESOURCE_ITEMS).find((categoryId) => {
        return calculateCategoryStatus(categoryId).isWarning;
    });

    const message = document.getElementById("rm-backpack-message");
    const messageIcon = document.getElementById("rm-backpack-message-icon");

    if (!message || !messageIcon) {
        return;
    }

    message.classList.toggle("rm-backpack-message--warning", Boolean(warningCategory));
    message.classList.toggle("rm-backpack-message--success", !warningCategory);
    messageIcon.hidden = !warningCategory;

    setText(
        "#rm-backpack-message-text",
        warningCategory ? RESOURCE_MESSAGES.warning[warningCategory] : RESOURCE_MESSAGES.success
    );
}

/* ============================================================
   Manage Feedback & Actions
   ============================================================ */


let manageFeedbackTimer;

function showManageFeedback(message, type, autoHide = false) {
    const feedbackElement = document.getElementById("rm-manage-feedback");

    if (!feedbackElement) {
        return;
    }

    clearTimeout(manageFeedbackTimer);

    feedbackElement.textContent = message;
    feedbackElement.hidden = false;
    feedbackElement.classList.toggle("rm-manage-feedback--error", type === "error");
    feedbackElement.classList.toggle("rm-manage-feedback--success", type === "success");

    if (autoHide) {
        manageFeedbackTimer = setTimeout(() => {
            clearManageFeedback();
        }, 2000);
    }
}

function clearManageFeedback() {
    const feedbackElement = document.getElementById("rm-manage-feedback");

    if (!feedbackElement) {
        return;
    }

    feedbackElement.textContent = "";
    feedbackElement.hidden = true;
    feedbackElement.classList.remove("rm-manage-feedback--error", "rm-manage-feedback--success");
}

function handleManageAction(action) {
    const nextState = structuredClone(inventoryState);
    const unavailableItems = [];
    const changedCategories = new Set();
    let hasChanges = false;
    let hasInvalidInput = false;

    clearManageFeedback();

    document.querySelectorAll(".rm-manage-row").forEach((row) => {
        const input = row.querySelector(".rm-amount-input");
        const inputValue = input.value.trim();

        if (inputValue === "") {
            return;
        }

        const amount = Number(inputValue);

        if (amount === 0) {
            return;
        }

        if (!Number.isInteger(amount) || amount < 0) {
            hasInvalidInput = true;
            return;
        }

        const categoryId = row.dataset.category;
        const itemId = row.dataset.item;
        const item = RESOURCE_ITEMS[categoryId][itemId];
        const currentAmount = nextState[categoryId][itemId];
        const nextAmount = action === "add" ? currentAmount + amount : currentAmount - amount;

        if (action === "use" && nextAmount < 0) {
            unavailableItems.push(item.name);
            return;
        }

        nextState[categoryId][itemId] = nextAmount;
        changedCategories.add(categoryId);
        hasChanges = true;
    });

    if (hasInvalidInput) {
        showManageFeedback(RESOURCE_MESSAGES.error.invalidAmount, "error");
        return false;
    }

    if (unavailableItems.length > 0) {
        showManageFeedback(RESOURCE_MESSAGES.error.useUnavailable(unavailableItems), "error");
        return false;
    }

    if (!hasChanges) {
        return false;
    }

    if (action === "add") {
        const backpackStatus = calculateBackpackStatus(nextState);

        if (backpackStatus.isWeightOverLimit || backpackStatus.isVolumeOverLimit) {
            showManageFeedback(RESOURCE_MESSAGES.error.addCapacity, "error");
            return false;
        }

        const overfilledCategory = [...changedCategories].find((categoryId) => {
            return calculateCategoryStatus(categoryId, nextState).percent > RESOURCE_THRESHOLDS.categoryOverfillConfirmationPercent;
        });

        if (overfilledCategory && !confirm("This category is above its target. Add anyway?")) {
            return false;
        }
    }

    inventoryState = nextState;
    clearManageInputs();
    renderResourceManager();

    showManageFeedback(RESOURCE_MESSAGES.manageSuccess[action], "success", true);

    return true;
}

function clearManageInputs() {
    document.querySelectorAll(".rm-amount-input").forEach((input) => {
        input.value = "";
    });
}

function initManageActions() {
    document.querySelectorAll(".rm-manage-action").forEach((button) => {
        button.addEventListener("click", () => {
            handleManageAction(button.dataset.action);
        });
    });
}

function setActiveBottomNav(activeButton) {
    document.querySelectorAll(".bottomnav__button").forEach((button) => {
        button.classList.remove("is-active");

        const icon = button.querySelector("img");

        if (icon && button.dataset.iconInactive) {
            icon.src = button.dataset.iconInactive;
        }
    });

    activeButton.classList.add("is-active");

    const activeIcon = activeButton.querySelector("img");

    if (activeIcon && activeButton.dataset.iconActive) {
        activeIcon.src = activeButton.dataset.iconActive;
    }
}



/* ============================================================
   Navigation & Info Button
   ============================================================ */



function showResourceView(viewName) {
    document.querySelectorAll("#screen-resource-manager .rm-view").forEach((view) => {
        view.hidden = view.dataset.view !== viewName;
    });

    const backButton = document.getElementById("btn-resource-back");

    if (backButton) {
        backButton.hidden = viewName === "overview";
    }
}

function initResourceViewNavigation() {
    document.getElementById("btn-open-backpack")?.addEventListener("click", () => {
        showResourceView("detail");
    });

    document.getElementById("btn-resource-back")?.addEventListener("click", () => {
        showResourceView("overview");
    });

    document.getElementById("btn-manage-items")?.addEventListener("click", () => {
        clearManageInputs();
        clearManageFeedback();
        showAppScreen("screen-resource-manage");
    });

    document.getElementById("btn-back-to-resource-detail")?.addEventListener("click", () => {
        showAppScreen("screen-resource-manager");
        showResourceView("detail");
    });
}

function initResourceInfoButton() {
    document.getElementById("rm-info-button")?.addEventListener("click", () => {
        alert(RESOURCE_MESSAGES.info);
    });
}

/* ============================================================
   DOMContentLoaded Initialization
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initResourceManagerMarkup();
    initManageActions();
    initBottomNavigation();
    initResourceViewNavigation();
    initResourceInfoButton();
    renderResourceManager();
});


