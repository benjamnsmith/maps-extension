var saved_mpg = -10000;

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

const getMPG = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
    
          reject();
        } else {

          resolve(result[key]);
        }
      });
    });
  };


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //saved_mpg = getMPG("mpg");
    //saved_mpg = parseInt(saved_mpg);
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
      if (key.toString() === "mpg"){
        saved_mpg = parseInt(newValue);
      }
      
    }
  });