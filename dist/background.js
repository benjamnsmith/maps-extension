var saved_mpg = -10000;

function calculateCost(distance) {
    var currentGasPrice = 4.5;
    //var percent = distance / localStorage.getItem("mpg");
  
    var percent = distance / 24; 
    console.log(`A trip of ${distance} will cost ${(percent * currentGasPrice).toFixed(2)}`)
    return (percent * currentGasPrice).toFixed(2);
  }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let ret_vals = [];
      var recvd = request.data.split(',');
      for (idx in recvd) {
        var val = ((recvd[idx]).split(' '))[0];
        ret_vals.push(calculateCost(val));
      }
      
      sendResponse({cost:`${ret_vals}`});
    });