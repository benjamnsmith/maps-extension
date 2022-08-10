// CONTENT.JS
// Run in the context of the webpage only after the DOM is fully loaded,
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



function handlePage() {
    console.log("Page should be changed");

    let dists = getDistance();

    // the divs containing the trip cost take so long to load sometimes
    // my query on page load returns [] sometimes because they haven't been populated
    // USUALLY waiting a second and re-trying works, but on suuuuper slow connections, this will break
    if (dists.length === 0) {
        throw 'NoElementsFound';
    }
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
    try{
        handlePage();
    } catch(error) {
        console.log("Error, trying again in 1s");
        setTimeout(handlePage, 1000);
    }
});
