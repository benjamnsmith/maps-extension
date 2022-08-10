var saved_mpg = -10000;

function calculateCost(distance) {
    console.log(`calculateCost() with distance as ${distance} and mpg as ${saved_mpg}`);
    if (saved_mpg < 0) {
        console.log("There was an error");
        throw "NegativeMPG"
    }
    var currentGasPrice = 4.5;
    var percent = distance / saved_mpg;
  
    return (percent * currentGasPrice).toFixed(2);
}

function getMPG() {
    chrome.storage.sync.get(['mpg'], function(res) {
        console.log(`getMPG() retrieved ${res.mpg}`);
        saved_mpg = parseInt(res.mpg);
    })
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // TODO need to wait on getMPG before calling calculate cost
    //getMPG();
    let recvd = [];
    let calculated = [];
    recvd = message.data.split(",");
    try {
        for (const val of recvd) {
            var dist = val.split(" ")[0];
            dist = parseFloat(dist);
            let c = calculateCost(dist);
            calculated.push(c);
        }
        console.log(calculated);
        sendResponse({cost:`${calculated}`});
    } catch (error) {
        console.log(error);
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (key === "mpg"){
        saved_mpg = parseInt(newValue);
      }
      
    }
  });