// OPTIONS.JS
// handle form submissions, data saving, data changing
// all data should be passed to background.js upon save
// utilize chrome storage so all scripts can access data

const table = document.querySelector(".history_table");
const form = document.querySelector("#entry_form");
const info = document.querySelector(".general_info");
const name = document.querySelector("#name");
const mpg = document.querySelector("#mpg");
const fields = document.querySelectorAll("input");
var data = [];
const welcome_header = document.querySelector("#form_header");
const welcome_message = document.querySelector(".welcome_message");



// POPUP WINDOW FUNCTIONS
function init() {
    var saved_mpg = localStorage.getItem("mpg");
    var user_name = localStorage.getItem("name");
    var new_user;
    if (saved_mpg === null) {
        new_user = true;
        console.log("No data found in localStorage");
    } else {
        new_user = false;
        console.log(
        `Got value ${saved_mpg} mpg and name ${user_name} from localStorage`
        );
    }
    if (! new_user) {
        data.push(user_name);
        data.push(saved_mpg);
        console.log(data);
        showWelcomeMessage();
    } else {
        showNewUserMessage();
    }
}

function showNewUserMessage(){
    console.log("Showing new message");
    fields[0].setAttribute("placeholder", "Name");
    fields[1].setAttribute("placeholder", '');
    fields[2].setAttribute("placeholder", "Make");
    welcome_header.innerText = "Add your info";
    welcome_message.innerText = "";
}

function showWelcomeMessage() {
    console.log("Showing welcome message");
    console.log(data);
    for(let i = 0; i < 2; i++){
        fields[i].setAttribute("placeholder", data[i]);
    }
    welcome_header.innerText = "Welcome back, " + data[0]+ "!";
    welcome_message.innerText = "You are able to see your saved settings below and update them if necessary";
    console.log("End of welcome message");
}

function handleSubmit(event) {
  event.preventDefault();
  console.log(`Received ${name.value} and ${mpg.value} from form submission`);
  localStorage.setItem("mpg", mpg.value);
  localStorage.setItem("name", name.value);
  chrome.storage.sync.set({mpg:`${mpg.value}`});
  data[0] = name.value;
  data[1] = mpg.value;
   
    name.value = '';
    mpg.value = '';
    //chrome.storage.sync.set({name:`${name.value}`});
  showWelcomeMessage();
}

function calculateCost(distance) {
  var currentGasPrice = 4.5;
  var percent = distance / localStorage.getItem("mpg");

  return (percent * currentGasPrice).toFixed(2);
}

function reset(event) {
    event.preventDefault();
    console.log("Clearing localStorage");
    localStorage.clear();
    data = [];
    init();
}


// LISTEN FOR UPDATES FROM BACKGROUND.JS AND UPDATE ACCORDINGLY
function updateWelcomeMessage(sw){
  var banner = document.getElementById("maps_bool");
  banner.textConent = sw;
}

// RUN UPON EXTENSION INIT
form.addEventListener("submit", (e) => handleSubmit(e));
form.addEventListener("reset", (e) => reset(e));
form.addEventListener("close", (e) => {
    e.preventDefault();
    window.close();
});


init();
