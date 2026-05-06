const settingsBtn = document.querySelector('.settings-btn');
const cpmCard     = document.getElementById('cpm-card');
const cpmValue    = document.getElementById('cpm-value');
const co2Value    = document.getElementById('co2-value');
const rtToggle    = document.getElementById('rt-toggle');
const vehicleList = document.getElementById('vehicle-list');
const noVehicles  = document.getElementById('no-vehicles');
const gasDisplay  = document.getElementById('gas-display');
const noGas       = document.getElementById('no-gas');

const CO2_KG_PER_GALLON = { regular: 8.887, midgrade: 8.887, premium: 8.887, diesel: 10.180 };

function openSettings() {
	chrome.runtime.openOptionsPage();
}

function render() {
	Promise.all([
		chrome.storage.sync.get(null),
		chrome.storage.local.get('fuelPrices')
	]).then(([syncData, localData]) => {
		const num      = parseInt(syncData.num) || 0;
		const selRaw   = syncData.sel ? JSON.parse(syncData.sel) : null;
		const roundTrip = syncData.roundTrip || false;
		const showCO2   = syncData.showCO2 !== false;
		const fp        = localData.fuelPrices || {};

		// Determine effective price for selected vehicle
		let price = null;
		if (selRaw) {
			price = fp[selRaw.fuelType] || (syncData.price ? parseFloat(syncData.price.replace('$', '')) : null);
		}

		// Gas footer
		if (price) {
			gasDisplay.textContent = "$" + price.toFixed(2) + " / gal";
			gasDisplay.style.display = "inline";
			noGas.style.display = "none";
		} else {
			gasDisplay.style.display = "none";
			noGas.style.display = "inline";
		}

		// Round trip toggle
		rtToggle.checked = roundTrip;

		// Cost per mile + CO2 per mile
		if (price && selRaw) {
			const mult     = roundTrip ? 2 : 1;
			const cpm      = (price / parseFloat(selRaw.mpg) * mult).toFixed(3);
			const co2PerGal = CO2_KG_PER_GALLON[selRaw.fuelType] || CO2_KG_PER_GALLON.regular;
			const co2pm    = (co2PerGal / parseFloat(selRaw.mpg) * mult).toFixed(2);
			cpmValue.textContent = "$" + cpm + " / mi";
			co2Value.textContent = co2pm + " kg / mi";
			co2Value.closest('.stat').style.display = showCO2 ? "" : "none";
			cpmCard.style.display = "block";
		} else {
			cpmCard.style.display = "none";
		}

		// Vehicle list
		const vehicles = [];
		for (let i = 0; i < num; i++) {
			if (syncData["v" + i]) vehicles.push(JSON.parse(syncData["v" + i]));
		}

		vehicleList.innerHTML = "";

		if (vehicles.length === 0) {
			noVehicles.style.display = "block";
			return;
		}

		noVehicles.style.display = "none";

		vehicles.forEach((v) => {
			const isActive = selRaw && selRaw.id === v.id;
			const row = document.createElement("div");
			row.className = "vehicle-row" + (isActive ? " active" : "");
			row.dataset.id = v.id;
			row.innerHTML = `
				<span class="fa-solid fa-car-side v-icon"></span>
				<div class="v-details">
					<span class="v-name-text">${v.make} ${v.model}</span>
					<span class="v-mpg-text">${v.mpg} MPG &middot; ${v.fuelType || 'regular'}</span>
				</div>
				${isActive ? '<span class="fa-solid fa-check v-check"></span>' : ''}
			`;
			vehicleList.appendChild(row);
		});
	});
}

// Switch active vehicle
vehicleList.addEventListener('click', (e) => {
	const row = e.target.closest('.vehicle-row');
	if (!row) return;
	const id = parseInt(row.dataset.id);
	chrome.storage.sync.get(null).then((data) => {
		const v = data["v" + id];
		if (!v) return;
		chrome.storage.sync.set({ sel: v });
	});
});

// Round trip toggle
rtToggle.addEventListener('change', () => {
	chrome.storage.sync.set({ roundTrip: rtToggle.checked });
});

settingsBtn.addEventListener('click', openSettings);

document.querySelectorAll('.open-settings').forEach(el => {
	el.addEventListener('click', (e) => { e.preventDefault(); openSettings(); });
});

chrome.storage.onChanged.addListener(render);

render();
