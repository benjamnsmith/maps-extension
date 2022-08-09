/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/options.js ***!
  \************************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EscUJBQXFCLFdBQVcsZUFBZSxXQUFXO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVksTUFBTSxXQUFXO0FBQ3ZEO0FBQ0E7QUFDQSwyQkFBMkIsT0FBTyxVQUFVLEVBQUU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRLFdBQVcsRUFBRTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7OztBQUdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvb3B0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPUFRJT05TLkpTXG4vLyBoYW5kbGUgZm9ybSBzdWJtaXNzaW9ucywgZGF0YSBzYXZpbmcsIGRhdGEgY2hhbmdpbmdcbi8vIGFsbCBkYXRhIHNob3VsZCBiZSBwYXNzZWQgdG8gYmFja2dyb3VuZC5qcyB1cG9uIHNhdmVcbi8vIHV0aWxpemUgY2hyb21lIHN0b3JhZ2Ugc28gYWxsIHNjcmlwdHMgY2FuIGFjY2VzcyBkYXRhXG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaXN0b3J5X3RhYmxlXCIpO1xuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW50cnlfZm9ybVwiKTtcbmNvbnN0IGluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdlbmVyYWxfaW5mb1wiKTtcbmNvbnN0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG5jb25zdCBtcGcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21wZ1wiKTtcbmNvbnN0IGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcbnZhciBkYXRhID0gW107XG5jb25zdCB3ZWxjb21lX2hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9ybV9oZWFkZXJcIik7XG5jb25zdCB3ZWxjb21lX21lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlbGNvbWVfbWVzc2FnZVwiKTtcblxuXG5cbi8vIFBPUFVQIFdJTkRPVyBGVU5DVElPTlNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIHNhdmVkX21wZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpO1xuICAgIHZhciB1c2VyX25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5hbWVcIik7XG4gICAgdmFyIG5ld191c2VyO1xuICAgIGlmIChzYXZlZF9tcGcgPT09IG51bGwpIHtcbiAgICAgICAgbmV3X3VzZXIgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGEgZm91bmQgaW4gbG9jYWxTdG9yYWdlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld191c2VyID0gZmFsc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgR290IHZhbHVlICR7c2F2ZWRfbXBnfSBtcGcgYW5kIG5hbWUgJHt1c2VyX25hbWV9IGZyb20gbG9jYWxTdG9yYWdlYFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoISBuZXdfdXNlcikge1xuICAgICAgICBkYXRhLnB1c2godXNlcl9uYW1lKTtcbiAgICAgICAgZGF0YS5wdXNoKHNhdmVkX21wZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBzaG93V2VsY29tZU1lc3NhZ2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaG93TmV3VXNlck1lc3NhZ2UoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNob3dOZXdVc2VyTWVzc2FnZSgpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBuZXcgbWVzc2FnZVwiKTtcbiAgICBmaWVsZHNbMF0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJOYW1lXCIpO1xuICAgIGZpZWxkc1sxXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCAnJyk7XG4gICAgZmllbGRzWzJdLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiTWFrZVwiKTtcbiAgICB3ZWxjb21lX2hlYWRlci5pbm5lclRleHQgPSBcIkFkZCB5b3VyIGluZm9cIjtcbiAgICB3ZWxjb21lX21lc3NhZ2UuaW5uZXJUZXh0ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gc2hvd1dlbGNvbWVNZXNzYWdlKCkge1xuICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyB3ZWxjb21lIG1lc3NhZ2VcIik7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IDI7IGkrKyl7XG4gICAgICAgIGZpZWxkc1tpXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBkYXRhW2ldKTtcbiAgICB9XG4gICAgd2VsY29tZV9oZWFkZXIuaW5uZXJUZXh0ID0gXCJXZWxjb21lIGJhY2ssIFwiICsgZGF0YVswXSsgXCIhXCI7XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiWW91IGFyZSBhYmxlIHRvIHNlZSB5b3VyIHNhdmVkIHNldHRpbmdzIGJlbG93IGFuZCB1cGRhdGUgdGhlbSBpZiBuZWNlc3NhcnlcIjtcbiAgICBjb25zb2xlLmxvZyhcIkVuZCBvZiB3ZWxjb21lIG1lc3NhZ2VcIik7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgJHtuYW1lLnZhbHVlfSBhbmQgJHttcGcudmFsdWV9IGZyb20gZm9ybSBzdWJtaXNzaW9uYCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibXBnXCIsIG1wZy52YWx1ZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmFtZVwiLCBuYW1lLnZhbHVlKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe21wZzpgJHttcGcudmFsdWV9YH0pO1xuICBkYXRhWzBdID0gbmFtZS52YWx1ZTtcbiAgZGF0YVsxXSA9IG1wZy52YWx1ZTtcbiAgIFxuICAgIG5hbWUudmFsdWUgPSAnJztcbiAgICBtcGcudmFsdWUgPSAnJztcbiAgICAvL2Nocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHtuYW1lOmAke25hbWUudmFsdWV9YH0pO1xuICBzaG93V2VsY29tZU1lc3NhZ2UoKTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlQ29zdChkaXN0YW5jZSkge1xuICB2YXIgY3VycmVudEdhc1ByaWNlID0gNC41O1xuICB2YXIgcGVyY2VudCA9IGRpc3RhbmNlIC8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIik7XG5cbiAgcmV0dXJuIChwZXJjZW50ICogY3VycmVudEdhc1ByaWNlKS50b0ZpeGVkKDIpO1xufVxuXG5mdW5jdGlvbiByZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coXCJDbGVhcmluZyBsb2NhbFN0b3JhZ2VcIik7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgZGF0YSA9IFtdO1xuICAgIGluaXQoKTtcbn1cblxuXG4vLyBMSVNURU4gRk9SIFVQREFURVMgRlJPTSBCQUNLR1JPVU5ELkpTIEFORCBVUERBVEUgQUNDT1JESU5HTFlcbmZ1bmN0aW9uIHVwZGF0ZVdlbGNvbWVNZXNzYWdlKHN3KXtcbiAgdmFyIGJhbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwc19ib29sXCIpO1xuICBiYW5uZXIudGV4dENvbmVudCA9IHN3O1xufVxuXG4vLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiBoYW5kbGVTdWJtaXQoZSkpO1xuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwicmVzZXRcIiwgKGUpID0+IHJlc2V0KGUpKTtcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHdpbmRvdy5jbG9zZSgpO1xufSk7XG5cblxuaW5pdCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9