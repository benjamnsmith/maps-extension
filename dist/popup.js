const button = document.querySelector(".icon");
const welc_message = document.querySelector(".welcome");
const year = document.querySelector(".year");
const make = document.querySelector(".make");
const model = document.querySelector(".model");
const mpg = document.querySelector(".mpg");

var user_g = "";

button.addEventListener("click", (e) => {
    chrome.runtime.openOptionsPage();
    //console.log("Opened options page");
});


function displayInfo(user_data){
  // change greeting
  console.log(user_data);

  welc_message.innerText = "Hey there, " + user_g + "!";

  year.innerText = user_data.year;
  make.innerText = user_data.make;
  model.innerText = user_data.model;
  mpg.innerText = user_data.mpg;

}



function hideInfo(){
 const info = document.querySelector(".info_text");
 info.style.display = "none";
 //welc_message.innerText = "You're not logged in. Please enter your info to see your stats!";
}

function displayName(n){
  user_g = n;
  welc_message.innerText = "Hey there, " + n + "!\nAdd your info to see your stats here!";
}



 function render(){


    const all_data = chrome.storage.sync.get();

    all_data.then( (data) => {
      console.log(data);
    });

    const user = chrome.storage.sync.get("user");
    
    // User is logged in or not
    user.then( (data) => {
      console.log(data.user);
      if (data.user === undefined){
        hideInfo();
      } else {
        displayName(data.user);
      }
    }).then( (d) => {
      const data =  chrome.storage.sync.get("selected");


      // User has saved data or not
      data.then( (vehicle_obj) => {
        console.log(vehicle_obj.selected);
        if (vehicle_obj.selected === undefined){
          hideInfo();
        } else {
          displayInfo(vehicle_obj.selected);
        }
      });
    });

    
  
}

render();

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log("Storage change");
  render();
});




// light ffa8af
// dark  ff000f
