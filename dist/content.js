// CONTENT.JS
// Run in the context of the webpage only after the DOM is fully loaded,
// as specified in manifest.json ()

var saved_mpg = -10000;
var dists = [];
var outer_key = "";

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

function calculateCost(distance) {
    console.log(`calculateCost() with distance as ${distance} and mpg as ${saved_mpg}`);
    if (saved_mpg < 0) {
        console.log("There was an error");
        throw "NegativeMPG"
    }
    var currentGasPrice = 4.0;
    var percent = distance / saved_mpg;
  
    return (percent * currentGasPrice).toFixed(2);
}

function clean(number_string){
    var res = "";
    for (const c of number_string){
        if (c === ","){
            continue;    
        }
        res += c;
    }
    return parseFloat(res);
}


function handleData(vehicle_info){
    saved_mpg = vehicle_info.mpg;
    if (dists.length === 0) {
        throw 'NoElementsFound';
    }
    var costs = [];
    var text = []
    for (const dist of dists) {
        text.push(dist.textContent);
        var d_int = dist.textContent.split(" ")[0];
        var cleaned = clean(d_int);
        costs.push(calculateCost(cleaned));
    }
    console.log(costs);
    for (idx in costs) {
        console.log(`${text[idx]} will cost ${costs[idx]}`);
        dists[idx].textContent = text[idx] + " ($" + costs[idx] + ")";
    }
}

function handleReject(err){
    console.log(err);
}


function handlePage() {

    dists = getDistance();
    const future_data = chrome.storage.sync.get('selected');

     future_data.then((data) => {

        if (data.selected === undefined){
            handleReject(data);
        }
        else {
            handleData(data.selected);
        }
        
        
    
    
    });


       //saved_mpg = await readLocalStorage('mpg');
    
        // the divs containing the trip cost take so long to load sometimes
        // my query on page load returns [] sometimes because they haven't been populated
        // USUALLY waiting a second and re-trying works, but on suuuuper slow connections, this will break
        // also - now that it has to wait for the MPG query that gives the page a little more time to load
        
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


chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      
      handlePage();
    }
  });
