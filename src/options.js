// OPTIONS.JS
import { Vehicle } from "./vehicles";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const gas_price_input = document.querySelector("#gas_price");
const eia_key_input   = document.querySelector("#eia_key");
const price_display   = document.querySelector("#price_display");
const vehicle_grid    = document.querySelector("#vehicle_grid");
const num_vehicles_el = document.querySelector("#num_vehicles");
const inline_form     = document.querySelector("#inline_form");
const make_input      = document.querySelector("#make");
const model_input     = document.querySelector("#model");
const mpg_input       = document.querySelector("#mpg");
const fuel_type_sel   = document.querySelector("#fuel_type");
const save_btn        = document.querySelector(".vehicle_save");
const cancel_btn      = document.querySelector(".vehicle_cancel");
const delete_btn      = document.querySelector(".vehicle_delete");
const clear_btn       = document.querySelector(".clear");
const warning_el      = document.querySelector(".warning");
const show_co2_cb     = document.querySelector("#show_co2");
const history_list    = document.querySelector("#history_list");
const history_count   = document.querySelector("#history_count");
const history_empty   = document.querySelector("#history_empty");
const clear_history   = document.querySelector("#clear_history");

// ── State ─────────────────────────────────────────────────────────────────────
var state = {
  price: null,
  num: 0,
  sel: null,
  vehicles: [],
  eiaKey: null
};

var formMode = null;
var editingVehicle = null;
var clearConfirm = false;

const FUEL_LABELS = { regular: 'Regular', midgrade: 'Midgrade', premium: 'Premium', diesel: 'Diesel' };

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  Promise.all([
    chrome.storage.sync.get(null),
    chrome.storage.local.get('fuelPrices')
  ]).then(([syncData, localData]) => {
    state.price    = syncData.price || null;
    state.num      = parseInt(syncData.num) || 0;
    state.sel      = syncData.sel ? JSON.parse(syncData.sel) : null;
    state.eiaKey   = syncData.eiaApiKey || null;
    state.vehicles = [];

    for (let i = 0; i < state.num; i++) {
      if (syncData["v" + i]) state.vehicles[i] = JSON.parse(syncData["v" + i]);
    }

    if (state.eiaKey) eia_key_input.placeholder = "API key saved";
    if (localData.fuelPrices) renderPriceDisplay(localData.fuelPrices);
    show_co2_cb.checked = syncData.showCO2 !== false; // default true

    render();
    renderHistory();
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  num_vehicles_el.textContent = state.num;

  if (state.price) {
    gas_price_input.placeholder = "$" + parseFloat(state.price).toFixed(2) + " per gallon";
  }

  renderGrid();
}

function renderGrid() {
  vehicle_grid.innerHTML = "";

  state.vehicles.forEach((v) => {
    const card = document.createElement("div");
    card.className = "vehicle_item" + (state.sel && state.sel.id === v.id ? " selected" : "");
    card.dataset.id = v.id;
    const fuelLabel = FUEL_LABELS[v.fuelType] || 'Regular';
    card.innerHTML = `
      <span class="fa-solid fa-car-side"></span>
      <p class="v-name">${v.make} ${v.model}</p>
      <p class="v-mpg">${v.mpg} MPG &middot; ${fuelLabel}</p>
    `;
    vehicle_grid.appendChild(card);
  });

  if (state.num < 6) {
    const addCard = document.createElement("div");
    addCard.className = "vehicle_item add-card";
    addCard.id = "add-vehicle-card";
    addCard.innerHTML = `<span class="fa-solid fa-plus"></span><p>Add vehicle</p>`;
    vehicle_grid.appendChild(addCard);
  }
}

function renderPriceDisplay(fp) {
  if (!fp || !fp.regular) { price_display.textContent = ""; return; }
  const date = fp.fetchedAt ? new Date(fp.fetchedAt).toLocaleDateString() : '';
  price_display.innerHTML =
    `<span class="price-tag">Regular $${fp.regular?.toFixed(2)}</span>` +
    `<span class="price-tag">Midgrade $${fp.midgrade?.toFixed(2)}</span>` +
    `<span class="price-tag">Premium $${fp.premium?.toFixed(2)}</span>` +
    `<span class="price-tag">Diesel $${fp.diesel?.toFixed(2)}</span>` +
    (date ? `<span class="price-date">Updated ${date}</span>` : '');
}

// ── Trip history ──────────────────────────────────────────────────────────────
function renderHistory() {
  chrome.storage.local.get('tripHistory').then((data) => {
    const trips = data.tripHistory || [];
    history_count.textContent = trips.length;

    if (trips.length === 0) {
      history_list.innerHTML = "";
      history_empty.style.display = "block";
      return;
    }

    history_empty.style.display = "none";
    history_list.innerHTML = trips.map((t) => {
      const d = new Date(t.date);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const origin = truncate(t.origin, 20);
      const dest   = truncate(t.destination, 20);
      const rt     = t.roundTrip ? ' RT' : '';
      return `
        <div class="history-row">
          <span class="h-date">${dateStr}</span>
          <span class="h-route">${origin} → ${dest}</span>
          <span class="h-stats">${t.distance.toFixed(1)} mi${rt} &nbsp; $${t.cost.toFixed(2)} &nbsp; ${t.co2.toFixed(1)}kg CO₂</span>
        </div>`;
    }).join('');
  });
}

function truncate(str, max) {
  if (!str) return '?';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

// ── Inline form ───────────────────────────────────────────────────────────────
function openAddForm() {
  formMode = 'add';
  editingVehicle = null;
  make_input.value    = "";
  model_input.value   = "";
  mpg_input.value     = "";
  fuel_type_sel.value = "regular";
  delete_btn.style.display = "none";
  inline_form.style.display = "block";
  make_input.focus();
}

function openEditForm(vehicle) {
  formMode = 'edit';
  editingVehicle = vehicle;
  make_input.value    = vehicle.make;
  model_input.value   = vehicle.model;
  mpg_input.value     = vehicle.mpg;
  fuel_type_sel.value = vehicle.fuelType || 'regular';
  delete_btn.style.display = "inline-block";
  inline_form.style.display = "block";
  make_input.focus();
}

function closeForm() {
  formMode = null;
  editingVehicle = null;
  inline_form.style.display = "none";
  make_input.value  = "";
  model_input.value = "";
  mpg_input.value   = "";
}

// ── Save / update / delete ────────────────────────────────────────────────────
function handleSave() {
  const make     = make_input.value.trim();
  const model    = model_input.value.trim();
  const mpg      = mpg_input.value.trim();
  const fuelType = fuel_type_sel.value;

  if (!make || !model || !mpg) return;

  if (formMode === 'add') {
    const v = new Vehicle(make, model, mpg, state.num, fuelType);
    state.vehicles.push(v);
    state.num++;
    state.sel = v;
    chrome.storage.sync.set({
      ["v" + v.id]: JSON.stringify(v),
      num: state.num,
      sel: JSON.stringify(v)
    });
  } else {
    const v = new Vehicle(make, model, mpg, editingVehicle.id, fuelType);
    state.vehicles[v.id] = v;
    if (state.sel && state.sel.id === v.id) state.sel = v;
    chrome.storage.sync.set({
      ["v" + v.id]: JSON.stringify(v),
      sel: state.sel ? JSON.stringify(state.sel) : undefined
    });
  }

  closeForm();
  render();
}

function deleteVehicle() {
  if (!editingVehicle) return;

  const del_id = editingVehicle.id;
  state.vehicles.splice(del_id, 1);
  state.num--;

  const updates = { num: state.num };
  for (let i = 0; i < state.vehicles.length; i++) {
    state.vehicles[i].id = i;
    updates["v" + i] = JSON.stringify(state.vehicles[i]);
  }
  chrome.storage.sync.remove("v" + state.num);

  if (state.sel && state.sel.id === del_id) {
    if (state.vehicles.length > 0) {
      state.sel = state.vehicles[0];
      updates.sel = JSON.stringify(state.sel);
    } else {
      state.sel = null;
      chrome.storage.sync.remove("sel");
    }
  }

  chrome.storage.sync.set(updates);
  closeForm();
  render();
}

// ── Event delegation for vehicle grid ─────────────────────────────────────────
vehicle_grid.addEventListener("click", (e) => {
  const card = e.target.closest(".vehicle_item");
  if (!card) return;

  if (card.id === "add-vehicle-card") {
    openAddForm();
    return;
  }

  const id = parseInt(card.dataset.id);
  const vehicle = state.vehicles[id];
  if (!vehicle) return;

  if (formMode === 'edit' && editingVehicle && editingVehicle.id === id) {
    closeForm();
    return;
  }

  state.sel = vehicle;
  chrome.storage.sync.set({ sel: JSON.stringify(vehicle) });

  vehicle_grid.querySelectorAll(".vehicle_item").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");

  openEditForm(vehicle);
});

// ── Gas price ─────────────────────────────────────────────────────────────────
function saveGasPrice(value) {
  const cleaned = value.replace('$', '').trim();
  if (!cleaned || isNaN(parseFloat(cleaned))) return;
  state.price = cleaned;
  chrome.storage.sync.set({ price: cleaned });
  gas_price_input.value = "";
  gas_price_input.placeholder = "$" + parseFloat(cleaned).toFixed(2) + " per gallon";
}

gas_price_input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveGasPrice(gas_price_input.value);
});
gas_price_input.addEventListener("blur", () => {
  if (gas_price_input.value !== "") saveGasPrice(gas_price_input.value);
});

// ── EIA API key ───────────────────────────────────────────────────────────────
function saveEiaKey(value) {
  const key = value.trim();
  if (!key) return;
  state.eiaKey = key;
  chrome.storage.sync.set({ eiaApiKey: key });
  eia_key_input.value = "";
  eia_key_input.placeholder = "API key saved";
}

eia_key_input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveEiaKey(eia_key_input.value);
});
eia_key_input.addEventListener("blur", () => {
  if (eia_key_input.value !== "") saveEiaKey(eia_key_input.value);
});

// Update price display when background fetches new prices
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.fuelPrices) {
    renderPriceDisplay(changes.fuelPrices.newValue);
  }
});

// ── CO2 toggle ────────────────────────────────────────────────────────────────
show_co2_cb.addEventListener("change", () => {
  chrome.storage.sync.set({ showCO2: show_co2_cb.checked });
});

// ── Form buttons ──────────────────────────────────────────────────────────────
save_btn.addEventListener("click", handleSave);
cancel_btn.addEventListener("click", closeForm);
delete_btn.addEventListener("click", deleteVehicle);

// ── History ───────────────────────────────────────────────────────────────────
clear_history.addEventListener("click", () => {
  chrome.storage.local.set({ tripHistory: [] });
  renderHistory();
});

// ── Clear all data ────────────────────────────────────────────────────────────
clear_btn.addEventListener("click", () => {
  if (!clearConfirm) {
    clearConfirm = true;
    clear_btn.textContent = "Yes, clear everything";
    clear_btn.classList.add("confirming");
    warning_el.style.display = "block";
    return;
  }

  chrome.storage.sync.clear();
  chrome.storage.local.remove('tripHistory');
  state = { price: null, num: 0, sel: null, vehicles: [], eiaKey: null };
  gas_price_input.value = "";
  gas_price_input.placeholder = "e.g. $3.89";
  eia_key_input.placeholder = "Paste your EIA API key";
  price_display.textContent = "";
  clearConfirm = false;
  clear_btn.textContent = "Clear all data";
  clear_btn.classList.remove("confirming");
  warning_el.style.display = "none";
  closeForm();
  render();
  renderHistory();
});

document.addEventListener("click", (e) => {
  if (clearConfirm && !e.target.closest(".danger-zone")) {
    clearConfirm = false;
    clear_btn.textContent = "Clear all data";
    clear_btn.classList.remove("confirming");
    warning_el.style.display = "none";
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
init();
