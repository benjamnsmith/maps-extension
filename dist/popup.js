const button = document.querySelector(".icon");
const welc_message = document.querySelector(".welcome");
const year = document.querySelector(".year");
const make = document.querySelector(".make");
const model = document.querySelector(".model");
const mpg = document.querySelector(".mpg");

var validated;

const user = {
  "name": "Quincy",
  "mpg": 30,
  "make": "Volvo",
  "model": "v70",
  "year": "2003"
};

button.addEventListener("click", (e) => {
    chrome.runtime.openOptionsPage();
    //console.log("Opened options page");
});


function displayInfo(){
  // change greeting
  welc_message.innerText = "Hey there, " + user.name + "!";
  year.innerText = user.year;
  make.innerText = user.make;
  model.innerText = user.model;
  mpg.innerText = user.mpg;

}

function testLogin(){
  validated = true;
  chrome.storage.sync.get(['user'], function(res) {
    console.log(`init() retrieved ${res.mpg}`);
    saved_mpg = parseInt(res.mpg);
})
}

function hideInfo(){
 const info = document.querySelector(".info_text");
 info.style.display = "none";
 welc_message.innerText = "You're not logged in. Please enter your info to see your stats!";
}

function init(){
  testLogin();
  if (validated){
    displayInfo();
  } else {
    hideInfo();
  }
}

init();




// light ffa8af
// dark  ff000f
