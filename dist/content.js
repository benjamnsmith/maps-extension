function getDistance(){
    let matches = [];
    for(const div of document.querySelectorAll('div')){
        if (div.textContent.includes("miles")) {
            matches.push(div);
        }
    }
    const pattern = /\d+ miles$/;

    let results = []

    for (const match of matches) {
        if (pattern.test(match.textContent)) {
            results.push(match);
        }
    }
    return results;
}

function getCurrentTab() {
    return window.location.href;
}

function handlePage() {
    let url = getCurrentTab();
    if (url === null) {
        console.log("handlePage() received null url");
    }
    url = url.toString();
    console.log(`content script got URL: ${url}`);
    if (url.includes("google.com/maps/dir")) {
        console.log("Page should be changed");

        // LOCATE TRIP DISTANCE AND PASS TO EXTENSION
        let dists = getDistance();
        var text = [];
        for (const dist of dists) {
            text.push(dist.textContent);
        }
        console.log(text);
        chrome.runtime.sendMessage({data:`${text}`}, function(response) {
            if (response.cost.slice(0,1) === "-"){
                console.log("No saved_mpg");
                return;
            }
            let resps = response.cost.split(',');
            for (idx in resps) {
                console.log(`${text[idx]} will cost ${resps[idx]}`);
                dists[idx].textContent = text[idx] + " ($" + resps[idx] + ")";
            }

        });
    } else {
        console.log("Page should not be altered");
    }
}

handlePage();