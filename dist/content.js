// CONTENT.JS
// Injects trip cost (and optionally CO2) next to distance on Google Maps directions pages.

const DISTANCE_PATTERN   = /^\d+(\.\d+)? miles$/;
const CO2_KG_PER_GALLON  = { regular: 8.887, midgrade: 8.887, premium: 8.887, diesel: 10.180 };
const TRIP_HISTORY_ENABLED = false; // feature flag — enable when ready

var fuelPrices  = {};
var manualPrice = -1;
var vehicle     = null;
var roundTrip   = false;
var showCO2     = true;

function getPrice() {
    if (!vehicle) return -1;
    const fp = fuelPrices[vehicle.fuelType];
    return (fp != null && fp >= 0) ? fp : manualPrice;
}

function getMatchingDivs() {
    return Array.from(document.querySelectorAll('div'))
        .filter(div => DISTANCE_PATTERN.test(div.textContent) && !div.textContent.includes('($'));
}

function stripInjected() {
    // Remove standalone CO2 labels
    document.querySelectorAll('.tc-co2').forEach(el => el.remove());
    // Strip cost suffix from distance divs
    document.querySelectorAll('div').forEach(div => {
        if (/^\d[\d,.]* miles \(\$/.test(div.textContent)) {
            div.textContent = div.textContent.replace(/ \(\$.*\)$/, '');
        }
    });
}

function injectCosts() {
    if (!vehicle || getPrice() < 0) return;

    const dists = getMatchingDivs();
    if (dists.length === 0) return;

    const price = getPrice();
    const mult  = roundTrip ? 2 : 1;
    const rt    = roundTrip ? ' RT' : '';
    const co2PerGal = CO2_KG_PER_GALLON[vehicle.fuelType] || CO2_KG_PER_GALLON.regular;

    for (const dist of dists) {
        const text     = dist.textContent;
        const distance = parseFloat(text.replace(/,/g, '').split(' ')[0]);
        const gallons  = (distance / vehicle.mpg) * mult;
        const cost     = (gallons * price).toFixed(2);

        dist.textContent = `${text} ($${cost}${rt})`;

        if (showCO2) {
            const co2kg = (gallons * co2PerGal).toFixed(1);
            const co2el = document.createElement('div');
            co2el.className = 'tc-co2';
            co2el.style.cssText = 'font-size:0.78em;opacity:0.6;margin-top:1px;font-family:inherit';
            co2el.textContent = `${co2kg}kg CO2`;
            dist.insertAdjacentElement('afterend', co2el);
        }
    }

    if (TRIP_HISTORY_ENABLED) logTrip(dists, price, mult, co2PerGal);
}

function reinjectCosts() {
    stripInjected();
    injectCosts();
}

// ── Trip history (disabled) ───────────────────────────────────────────────────
function parseRoute() {
    const match = location.pathname.match(/\/maps\/dir\/([^/]+)\/([^/]+)/);
    if (!match) return { origin: 'Unknown', destination: 'Unknown' };
    return {
        origin:      decodeURIComponent(match[1].replace(/\+/g, ' ')),
        destination: decodeURIComponent(match[2].replace(/\+/g, ' '))
    };
}

function logTrip(dists, price, mult, co2PerGal) {
    let maxDist = 0;
    for (const dist of dists) {
        const d = parseFloat(dist.textContent.replace(/,/g, '').split(' ')[0]);
        if (d > maxDist) maxDist = d;
    }

    const gallons = (maxDist / vehicle.mpg) * mult;
    const cost    = parseFloat((gallons * price).toFixed(2));
    const co2     = parseFloat((gallons * co2PerGal).toFixed(2));
    const { origin, destination } = parseRoute();

    const trip = {
        date:        new Date().toISOString(),
        distance:    parseFloat((maxDist * mult).toFixed(1)),
        cost, co2, roundTrip, origin, destination,
        vehicle: { make: vehicle.make, model: vehicle.model, mpg: vehicle.mpg, fuelType: vehicle.fuelType }
    };

    chrome.storage.local.get('tripHistory').then((data) => {
        const history = data.tripHistory || [];
        history.unshift(trip);
        if (history.length > 50) history.splice(50);
        chrome.storage.local.set({ tripHistory: history });
    });
}

// ── DOM observer ──────────────────────────────────────────────────────────────
let injectDebounce = null;
const domObserver = new MutationObserver(() => {
    clearTimeout(injectDebounce);
    injectDebounce = setTimeout(injectCosts, 200);
});

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
    Promise.all([
        chrome.storage.sync.get(['price', 'sel', 'roundTrip', 'showCO2']),
        chrome.storage.local.get('fuelPrices')
    ]).then(([syncData, localData]) => {
        if (!syncData.sel) {
            console.warn('TripCost: no vehicle configured.');
            return;
        }

        vehicle     = JSON.parse(syncData.sel);
        roundTrip   = syncData.roundTrip || false;
        showCO2     = syncData.showCO2 !== false; // default true
        manualPrice = syncData.price ? parseFloat(syncData.price.replace('$', '')) : -1;

        if (localData.fuelPrices) {
            const fp = localData.fuelPrices;
            fuelPrices = { regular: fp.regular, midgrade: fp.midgrade, premium: fp.premium, diesel: fp.diesel };
        }

        injectCosts();
        domObserver.observe(document.body, { subtree: true, childList: true });
    });
}

// ── Storage changes ───────────────────────────────────────────────────────────
chrome.storage.onChanged.addListener((changes, area) => {
    let changed = false;

    if (area === 'sync') {
        if (changes.price)     { manualPrice = parseFloat(changes.price.newValue.replace('$', '')); changed = true; }
        if (changes.sel)       { vehicle = JSON.parse(changes.sel.newValue); changed = true; }
        if (changes.roundTrip) { roundTrip = changes.roundTrip.newValue; changed = true; }
        if (changes.showCO2)   { showCO2 = changes.showCO2.newValue; changed = true; }
    }

    if (area === 'local' && changes.fuelPrices) {
        const fp = changes.fuelPrices.newValue;
        fuelPrices = { regular: fp.regular, midgrade: fp.midgrade, premium: fp.premium, diesel: fp.diesel };
        changed = true;
    }

    if (changed) reinjectCosts();
});

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
