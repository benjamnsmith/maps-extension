/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const table = document.querySelector(".history_table");
const form = document.querySelector("#entry_form");
const info = document.querySelector(".general_info");
const name = document.querySelector("#name");
const mpg = document.querySelector("#mpg");
const clear = document.querySelector(".clear");

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
  if (new_user) {
    form.style.display = "block";
    info.style.display = "none";
  } else {
    showWelcomeMessage(user_name, saved_mpg);
  }
}

function showWelcomeMessage() {
  form.style.display = "none";
  info.style.display = "block";
  document.getElementById("welcome_name").textContent =
    localStorage.getItem("name") + "!";
  document.getElementById("welcome_mpg").textContent =
    "Your saved MPG is " + localStorage.getItem("mpg") + " miles per gallon.";
  document.getElementById("sample_trip").textContent = "$" + calculateCost(10);
}

function handleSubmit(event) {
  event.preventDefault();
  console.log(`Received ${name.value} and ${mpg.value} from form submission`);
  localStorage.setItem("mpg", mpg.value);
  localStorage.setItem("name", name.value);
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
  init();
}


// LISTEN FOR UPDATES FROM BACKGROUND.JS AND UPDATE ACCORDINGLY
function updateWelcomeMessage(sw){
  var banner = document.getElementById("maps_bool");
  //sw ? banner.textContent = "GOOGLE MAPS" : banner.textContent = "NOT GOOGLE MAPS";
  //banner.textContent = sw ? "GOOGLE MAPS" : "NOT GOOGLE MAPS";
  banner.textConent = sw;
}

// RUN UPON EXTENSION INIT
form.addEventListener("submit", (e) => handleSubmit(e));
clear.addEventListener("click", (e) => reset(e));
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse){
    var msg = message.url;
    updateWelcomeMessage(msg);
  }
);

init();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5wb3B1cC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVyxlQUFlLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWSxNQUFNLFdBQVc7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTyIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaXN0b3J5X3RhYmxlXCIpO1xuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW50cnlfZm9ybVwiKTtcbmNvbnN0IGluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdlbmVyYWxfaW5mb1wiKTtcbmNvbnN0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG5jb25zdCBtcGcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21wZ1wiKTtcbmNvbnN0IGNsZWFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKTtcblxuLy8gUE9QVVAgV0lORE9XIEZVTkNUSU9OU1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHNhdmVkX21wZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpO1xuICB2YXIgdXNlcl9uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuYW1lXCIpO1xuICB2YXIgbmV3X3VzZXI7XG4gIGlmIChzYXZlZF9tcGcgPT09IG51bGwpIHtcbiAgICBuZXdfdXNlciA9IHRydWU7XG4gICAgY29uc29sZS5sb2coXCJObyBkYXRhIGZvdW5kIGluIGxvY2FsU3RvcmFnZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdfdXNlciA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYEdvdCB2YWx1ZSAke3NhdmVkX21wZ30gbXBnIGFuZCBuYW1lICR7dXNlcl9uYW1lfSBmcm9tIGxvY2FsU3RvcmFnZWBcbiAgICApO1xuICB9XG4gIGlmIChuZXdfdXNlcikge1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfSBlbHNlIHtcbiAgICBzaG93V2VsY29tZU1lc3NhZ2UodXNlcl9uYW1lLCBzYXZlZF9tcGcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNob3dXZWxjb21lTWVzc2FnZSgpIHtcbiAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGluZm8uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWxjb21lX25hbWVcIikudGV4dENvbnRlbnQgPVxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmFtZVwiKSArIFwiIVwiO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlbGNvbWVfbXBnXCIpLnRleHRDb250ZW50ID1cbiAgICBcIllvdXIgc2F2ZWQgTVBHIGlzIFwiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIikgKyBcIiBtaWxlcyBwZXIgZ2FsbG9uLlwiO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhbXBsZV90cmlwXCIpLnRleHRDb250ZW50ID0gXCIkXCIgKyBjYWxjdWxhdGVDb3N0KDEwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnNvbGUubG9nKGBSZWNlaXZlZCAke25hbWUudmFsdWV9IGFuZCAke21wZy52YWx1ZX0gZnJvbSBmb3JtIHN1Ym1pc3Npb25gKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtcGdcIiwgbXBnLnZhbHVlKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuYW1lXCIsIG5hbWUudmFsdWUpO1xuICBzaG93V2VsY29tZU1lc3NhZ2UoKTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlQ29zdChkaXN0YW5jZSkge1xuICB2YXIgY3VycmVudEdhc1ByaWNlID0gNC41O1xuICB2YXIgcGVyY2VudCA9IGRpc3RhbmNlIC8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIik7XG5cbiAgcmV0dXJuIChwZXJjZW50ICogY3VycmVudEdhc1ByaWNlKS50b0ZpeGVkKDIpO1xufVxuXG5mdW5jdGlvbiByZXNldChldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhcIkNsZWFyaW5nIGxvY2FsU3RvcmFnZVwiKTtcbiAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gIGluaXQoKTtcbn1cblxuXG4vLyBMSVNURU4gRk9SIFVQREFURVMgRlJPTSBCQUNLR1JPVU5ELkpTIEFORCBVUERBVEUgQUNDT1JESU5HTFlcbmZ1bmN0aW9uIHVwZGF0ZVdlbGNvbWVNZXNzYWdlKHN3KXtcbiAgdmFyIGJhbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwc19ib29sXCIpO1xuICAvL3N3ID8gYmFubmVyLnRleHRDb250ZW50ID0gXCJHT09HTEUgTUFQU1wiIDogYmFubmVyLnRleHRDb250ZW50ID0gXCJOT1QgR09PR0xFIE1BUFNcIjtcbiAgLy9iYW5uZXIudGV4dENvbnRlbnQgPSBzdyA/IFwiR09PR0xFIE1BUFNcIiA6IFwiTk9UIEdPT0dMRSBNQVBTXCI7XG4gIGJhbm5lci50ZXh0Q29uZW50ID0gc3c7XG59XG5cbi8vIFJVTiBVUE9OIEVYVEVOU0lPTiBJTklUXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IGhhbmRsZVN1Ym1pdChlKSk7XG5jbGVhci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHJlc2V0KGUpKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2Upe1xuICAgIHZhciBtc2cgPSBtZXNzYWdlLnVybDtcbiAgICB1cGRhdGVXZWxjb21lTWVzc2FnZShtc2cpO1xuICB9XG4pO1xuXG5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9