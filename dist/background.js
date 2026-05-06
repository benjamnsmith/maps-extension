// Background service worker — fetches EIA weekly fuel prices once per day.

const EIA_SERIES = {
    regular:  'EMM_EPMRU_PTE_NUS_DPG',
    midgrade: 'EMM_EPMMU_PTE_NUS_DPG',
    premium:  'EMM_EPMP_PTE_NUS_DPG',
    diesel:   'EMM_EPD2D_PTE_NUS_DPG',
};

async function fetchEiaPrices(apiKey) {
    const prices = {};
    for (const [fuelType, series] of Object.entries(EIA_SERIES)) {
        const url = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=${apiKey}&frequency=weekly&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&length=1&facets[series][]=${series}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        const value = json.response?.data?.[0]?.value;
        if (value != null) prices[fuelType] = parseFloat(value);
    }
    return prices;
}

async function doFetch() {
    const { eiaApiKey } = await chrome.storage.sync.get('eiaApiKey');
    if (!eiaApiKey) return;

    const { fuelPrices } = await chrome.storage.local.get('fuelPrices');
    const lastFetch = fuelPrices?.fetchedAt;
    if (lastFetch && Date.now() - new Date(lastFetch).getTime() < 24 * 60 * 60 * 1000) return;

    try {
        const prices = await fetchEiaPrices(eiaApiKey);
        if (Object.keys(prices).length > 0) {
            await chrome.storage.local.set({
                fuelPrices: { ...prices, fetchedAt: new Date().toISOString() }
            });
            console.log('TripCost: EIA prices updated', prices);
        }
    } catch (e) {
        console.warn('TripCost: EIA fetch failed', e);
    }
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'eiaFetch') doFetch();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('eiaFetch', { periodInMinutes: 24 * 60 });
    doFetch();
});

chrome.runtime.onStartup.addListener(doFetch);

// Re-fetch immediately when the user saves a new API key
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.eiaApiKey?.newValue) doFetch();
});
