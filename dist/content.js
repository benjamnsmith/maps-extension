// CONTENT.JS
// Run in the context of the webpage only after the DOM is fully loaded,
// as specified in manifest.json ()

var saved_mpg = -10000;
var gas_price = 4.0;


// dom polling code based on code from so
const getDistances = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const tryQuery = () => {
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
        if (matches.length) resolve(results); // Found the element
        else if (Date.now() - startTime > timeout) resolve(null); // Give up eventually
        else setTimeout(tryQuery, 10); // check again every 10ms
      }
      tryQuery(); // Initial check
    });
  };


function calculateCost(distance) {
    console.log(`calculateCost() with distance as ${distance}, mpg as ${saved_mpg}, and gas price as ${gas_price}`);
    if (saved_mpg < 0) {
        console.log("There was an error");
        throw "NegativeMPG"
    }
    var percent = distance / saved_mpg;
  
    return (percent * gas_price).toFixed(2);
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


function handleData(vehicle_info, dists){
    saved_mpg = vehicle_info.mpg;

    var costs = [];
    var text = [];
    for (const dist of dists) {
        text.push(dist.textContent);
        var d_int = dist.textContent.split(" ")[0];
        var cleaned = clean(d_int);
        costs.push(calculateCost(cleaned));
    }
    for (idx in costs) {
        console.log(`${text[idx]} will cost ${costs[idx]}`);
        dists[idx].textContent = text[idx] + " ($" + costs[idx] + ")";
    }
}

function handleReject(err){
    console.log(err);
    throw err;
}


function handlePage() {
    const dist_prom = getDistances();

    dist_prom.then( (dists) => {
        console.log("getDistance got");
        console.log(dists);
        const future_data = chrome.storage.sync.get('selected');

        future_data.then((data) => {

            if (data.selected === undefined){
                handleReject(data);
            }
            else {
                handleData(data.selected, dists);
            }
    
        }, handleReject); 
    })

    

    
    

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
