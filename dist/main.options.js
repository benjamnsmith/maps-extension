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
  chrome.storage.sync.set({mpg:`${mpg.value}`});
  chrome.storage.sync.set({name:`${name.value}`});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG1CQUFtQixXQUFXLGVBQWUsV0FBVztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWSxNQUFNLFdBQVc7QUFDdkQ7QUFDQTtBQUNBLDJCQUEyQixPQUFPLFVBQVUsRUFBRTtBQUM5QywyQkFBMkIsUUFBUSxXQUFXLEVBQUU7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXBzLWV4dGVuc2lvbi8uL3NyYy9vcHRpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE9QVElPTlMuSlNcbi8vIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb25zLCBkYXRhIHNhdmluZywgZGF0YSBjaGFuZ2luZ1xuLy8gYWxsIGRhdGEgc2hvdWxkIGJlIHBhc3NlZCB0byBiYWNrZ3JvdW5kLmpzIHVwb24gc2F2ZVxuLy8gdXRpbGl6ZSBjaHJvbWUgc3RvcmFnZSBzbyBhbGwgc2NyaXB0cyBjYW4gYWNjZXNzIGRhdGFcblxuY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhpc3RvcnlfdGFibGVcIik7XG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbnRyeV9mb3JtXCIpO1xuY29uc3QgaW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2VuZXJhbF9pbmZvXCIpO1xuY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKTtcbmNvbnN0IG1wZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpO1xuY29uc3QgY2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpO1xuXG4vLyBQT1BVUCBXSU5ET1cgRlVOQ1RJT05TXG5mdW5jdGlvbiBpbml0KCkge1xuICB2YXIgc2F2ZWRfbXBnID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtcGdcIik7XG4gIHZhciB1c2VyX25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5hbWVcIik7XG4gIHZhciBuZXdfdXNlcjtcbiAgaWYgKHNhdmVkX21wZyA9PT0gbnVsbCkge1xuICAgIG5ld191c2VyID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGEgZm91bmQgaW4gbG9jYWxTdG9yYWdlXCIpO1xuICB9IGVsc2Uge1xuICAgIG5ld191c2VyID0gZmFsc2U7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgR290IHZhbHVlICR7c2F2ZWRfbXBnfSBtcGcgYW5kIG5hbWUgJHt1c2VyX25hbWV9IGZyb20gbG9jYWxTdG9yYWdlYFxuICAgICk7XG4gIH1cbiAgaWYgKG5ld191c2VyKSB7XG4gICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGluZm8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9IGVsc2Uge1xuICAgIHNob3dXZWxjb21lTWVzc2FnZSh1c2VyX25hbWUsIHNhdmVkX21wZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvd1dlbGNvbWVNZXNzYWdlKCkge1xuICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2VsY29tZV9uYW1lXCIpLnRleHRDb250ZW50ID1cbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5hbWVcIikgKyBcIiFcIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWxjb21lX21wZ1wiKS50ZXh0Q29udGVudCA9XG4gICAgXCJZb3VyIHNhdmVkIE1QRyBpcyBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpICsgXCIgbWlsZXMgcGVyIGdhbGxvbi5cIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYW1wbGVfdHJpcFwiKS50ZXh0Q29udGVudCA9IFwiJFwiICsgY2FsY3VsYXRlQ29zdCgxMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgJHtuYW1lLnZhbHVlfSBhbmQgJHttcGcudmFsdWV9IGZyb20gZm9ybSBzdWJtaXNzaW9uYCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibXBnXCIsIG1wZy52YWx1ZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmFtZVwiLCBuYW1lLnZhbHVlKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe21wZzpgJHttcGcudmFsdWV9YH0pO1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7bmFtZTpgJHtuYW1lLnZhbHVlfWB9KTtcbiAgc2hvd1dlbGNvbWVNZXNzYWdlKCk7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUNvc3QoZGlzdGFuY2UpIHtcbiAgdmFyIGN1cnJlbnRHYXNQcmljZSA9IDQuNTtcbiAgdmFyIHBlcmNlbnQgPSBkaXN0YW5jZSAvIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpO1xuXG4gIHJldHVybiAocGVyY2VudCAqIGN1cnJlbnRHYXNQcmljZSkudG9GaXhlZCgyKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc29sZS5sb2coXCJDbGVhcmluZyBsb2NhbFN0b3JhZ2VcIik7XG4gIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICBpbml0KCk7XG59XG5cblxuLy8gTElTVEVOIEZPUiBVUERBVEVTIEZST00gQkFDS0dST1VORC5KUyBBTkQgVVBEQVRFIEFDQ09SRElOR0xZXG5mdW5jdGlvbiB1cGRhdGVXZWxjb21lTWVzc2FnZShzdyl7XG4gIHZhciBiYW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcHNfYm9vbFwiKTtcbiAgYmFubmVyLnRleHRDb25lbnQgPSBzdztcbn1cblxuLy8gUlVOIFVQT04gRVhURU5TSU9OIElOSVRcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4gaGFuZGxlU3VibWl0KGUpKTtcbmNsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gcmVzZXQoZSkpO1xuXG5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9