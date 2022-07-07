async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab !== undefined) {
        console.log(`Queried tabs, got ${tab.url}`)
    } else {
        console.log("Queried tabs, got null");
    }
    return tab.url;
  }


async function handlePage() {
    let url;
    try {
        url = await getCurrentTab();
    } catch(e) {
        console.log(e);
        return;
    }
    
    if (url === null) {
        console.log("handlePage() received null url")
    }
    url = url.toString();
    if (url.includes("google.com/maps/dir")) {
        console.log("Page should be changed");
    } else {
        console.log("Page should not be altered")
    }
    try {
        chrome.runtime.sendMessage({data:`${url}`});
    } catch (e) {
        console.log(e);
        return;
    }
    
}

chrome.webNavigation.onCompleted.addListener(handlePage);

