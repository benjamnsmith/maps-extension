var saved_mpg = -10000;
var name = "";

function calculateCost(distance) {
    var saved_mpg = -100;
    chrome.storage.sync.get(['mpg'], function(result) {
        console.log(`retrieved value ${result.mpg} from storage`);
        saved_mpg = result.mpg;
    });
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
    sendResponse(calculated);
});