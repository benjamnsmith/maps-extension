// CONTENT.JS
// Run in the contect of the webpage only after the DOM is fully loaded,
// as specified in manifest.json ()

function getDistance(){
    // retrieve all DOM elements that include the phrase "miles" in their text content
    let matches = [];
    for(const div of document.querySelectorAll('div')){
        if (div.textContent.includes("miles")) {
            matches.push(div);
        }
    }

    const pattern = /\d+ miles$/;

    let results = []

    // of the retrieved divs, only get the ones that match the pattern above (the ones we want to change)
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
    // TODO: remove this check, only have content run on <https://google.com/maps/dir/*>
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
            console.log(`Received ${response.cost}`);
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


/* 
Wait until all of the objects of the DOM have loaded before trying to access them
Flow of execution: 
* readystate: interactive (document event)
* DOMContentLoaded (document event)
* readystate: complete (document event)
* load (window event)
*/

window.addEventListener('load', (event) => {
    handlePage();
});
