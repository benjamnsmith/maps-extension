/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/options.js ***!
  \************************/
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

  chrome.runtime.sendMessage({data:`MPG ${localStorage.getItem("mpg")}`});

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
  banner.textConent = sw;
}

// RUN UPON EXTENSION INIT
form.addEventListener("submit", (e) => handleSubmit(e));
clear.addEventListener("click", (e) => reset(e));

init();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG1CQUFtQixXQUFXLGVBQWUsV0FBVztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCLFlBQVksNEJBQTRCLEVBQUU7O0FBRXhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVksTUFBTSxXQUFXO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsTyIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL29wdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhpc3RvcnlfdGFibGVcIik7XG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbnRyeV9mb3JtXCIpO1xuY29uc3QgaW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2VuZXJhbF9pbmZvXCIpO1xuY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKTtcbmNvbnN0IG1wZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpO1xuY29uc3QgY2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpO1xuXG4vLyBQT1BVUCBXSU5ET1cgRlVOQ1RJT05TXG5mdW5jdGlvbiBpbml0KCkge1xuICB2YXIgc2F2ZWRfbXBnID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIik7XG4gIHZhciB1c2VyX25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5hbWVcIik7XG4gIHZhciBuZXdfdXNlcjtcbiAgaWYgKHNhdmVkX21wZyA9PT0gbnVsbCkge1xuICAgIG5ld191c2VyID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGEgZm91bmQgaW4gbG9jYWxTdG9yYWdlXCIpO1xuICB9IGVsc2Uge1xuICAgIG5ld191c2VyID0gZmFsc2U7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgR290IHZhbHVlICR7c2F2ZWRfbXBnfSBtcGcgYW5kIG5hbWUgJHt1c2VyX25hbWV9IGZyb20gbG9jYWxTdG9yYWdlYFxuICAgICk7XG4gIH1cbiAgaWYgKG5ld191c2VyKSB7XG4gICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGluZm8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9IGVsc2Uge1xuICAgIHNob3dXZWxjb21lTWVzc2FnZSh1c2VyX25hbWUsIHNhdmVkX21wZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvd1dlbGNvbWVNZXNzYWdlKCkge1xuICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtkYXRhOmBNUEcgJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1wZ1wiKX1gfSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWxjb21lX25hbWVcIikudGV4dENvbnRlbnQgPVxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmFtZVwiKSArIFwiIVwiO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlbGNvbWVfbXBnXCIpLnRleHRDb250ZW50ID1cbiAgICBcIllvdXIgc2F2ZWQgTVBHIGlzIFwiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIikgKyBcIiBtaWxlcyBwZXIgZ2FsbG9uLlwiO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhbXBsZV90cmlwXCIpLnRleHRDb250ZW50ID0gXCIkXCIgKyBjYWxjdWxhdGVDb3N0KDEwKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnNvbGUubG9nKGBSZWNlaXZlZCAke25hbWUudmFsdWV9IGFuZCAke21wZy52YWx1ZX0gZnJvbSBmb3JtIHN1Ym1pc3Npb25gKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtcGdcIiwgbXBnLnZhbHVlKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuYW1lXCIsIG5hbWUudmFsdWUpO1xuICBzaG93V2VsY29tZU1lc3NhZ2UoKTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlQ29zdChkaXN0YW5jZSkge1xuICB2YXIgY3VycmVudEdhc1ByaWNlID0gNC41O1xuICB2YXIgcGVyY2VudCA9IGRpc3RhbmNlIC8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIik7XG5cbiAgcmV0dXJuIChwZXJjZW50ICogY3VycmVudEdhc1ByaWNlKS50b0ZpeGVkKDIpO1xufVxuXG5mdW5jdGlvbiByZXNldChldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhcIkNsZWFyaW5nIGxvY2FsU3RvcmFnZVwiKTtcbiAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gIGluaXQoKTtcbn1cblxuXG4vLyBMSVNURU4gRk9SIFVQREFURVMgRlJPTSBCQUNLR1JPVU5ELkpTIEFORCBVUERBVEUgQUNDT1JESU5HTFlcbmZ1bmN0aW9uIHVwZGF0ZVdlbGNvbWVNZXNzYWdlKHN3KXtcbiAgdmFyIGJhbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwc19ib29sXCIpO1xuICBiYW5uZXIudGV4dENvbmVudCA9IHN3O1xufVxuXG4vLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiBoYW5kbGVTdWJtaXQoZSkpO1xuY2xlYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiByZXNldChlKSk7XG5cbmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=