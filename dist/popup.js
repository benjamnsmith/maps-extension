// DOM ELEMENTS
const button = document.querySelector(".icon");
const welc_message = document.querySelector(".welcome");
const year = document.querySelector(".year");
const make = document.querySelector(".make");
const model = document.querySelector(".model");
const mpg = document.querySelector(".mpg");

// GLOBAL SCRIPT VARIABLES
var user_g = "";


// User is not logged in
function hideInfo(){
  const info = document.querySelector(".info_text");
  info.style.display = "none";
}

// User is logged in and does not have a selected vehicle (or it hasn't been checked yet)
function displayName(n){
  user_g = n;
  welc_message.innerText = "Hey there, " + n + "!\nAdd your info to see your stats here!";
}

// User is logged in and has a selected vehicle
function displayInfo(user_data){
  welc_message.innerText = "Hey there, " + user_g + "!";

  make.innerText = user_data.make;
  model.innerText = user_data.model;
  mpg.innerText = user_data.mpg;
}


/* there are TWO conditions that must be checked: 
1) Whether or not the user is logged in (has a name saved)
2) Whether or not the user has any vehicles saved (and thus has one selected) */
 function render(){

    chrome.storage.sync.get(["name", "sel"]).then((data) => {
      if (data.name === undefined) {
        hideInfo();
        return;
      }

      displayName(data.name);

      if (data.sel === undefined) {
        hideInfo();
      } else {
        displayInfo(JSON.parse(data.sel));
      }
    });
}

render();

button.addEventListener("click", (e) => {
  chrome.runtime.openOptionsPage();
});

/*If the selected vehicle is updated in storage while the popup is displayed, we
 want to immediately propogate these updates to the displayed popup */
 
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log("Storage change");
  render();
});


// light ffa8af
// dark  ff000f
