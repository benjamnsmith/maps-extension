var saved_mpg = -10000;

function calculateCost(distance) {
    var currentGasPrice = 4.5;
    var percent = distance / saved_mpg;
  
    console.log(`A trip of ${distance} will cost ${(percent * currentGasPrice).toFixed(2)}`)
    return (percent * currentGasPrice).toFixed(2);
  }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.data.includes("MPG")) {
            saved_mpg = parseFloat(request.data.slice(4));
            console.log(`Received MPG ${request.data} message`);
            console.log(`New saved_mpg is ${saved_mpg}`);
            return;
        }
      let ret_vals = [];
      var recvd = request.data.split(',');
      for (idx in recvd) {
        var val = ((recvd[idx]).split(' '))[0];
        ret_vals.push(calculateCost(val));
      }
      
      sendResponse({cost:`${ret_vals}`});
    });