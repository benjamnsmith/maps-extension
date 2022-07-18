var saved_mpg = -10000;
var name = "";

function calculateCost(distance) {
    console.log(`calculateCost() with distance as ${distance} and mpg as ${saved_mpg}`)
    var currentGasPrice = 4.5;
    var percent = distance / saved_mpg;
  
    return (percent * currentGasPrice).toFixed(2);
  }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let recvd = [];
    let calculated = [];
    recvd = message.data.split(",");
    for (const val of recvd) {
        var dist = val.split(" ")[0];
        dist = parseFloat(dist);
        let c = calculateCost(dist);
        calculated.push(c);
    }
    console.log(calculated);
    sendResponse({cost:`${calculated}`});
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'sync' && changes.mpg?.newValue) {
        console.log("Detected change in chrome storage values");
        console.log(`Updated storage mpg from ${changes.mpg.oldValue} to ${changes.mpg.newValue}`);
        saved_mpg = changes.mpg.newValue;
        console.log(`The saved_mpg is now ${saved_mpg}`);
    }
});

function init() {
    chrome.storage.sync.get(['mpg'], function(res) {
        console.log(`init() retrieved ${res.mpg}`);
        saved_mpg = parseInt(res.mpg);
    })
}

init();
