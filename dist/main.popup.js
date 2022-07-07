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

// chrome.runtime.onMessage.addListener(
//   function(message, sender, sendResponse){
//     console.log(`Extension script got message: ${message.data}`);
//     var msg = message.data;
//     updateWelcomeMessage(msg);
//   }
// );

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(`Received ${request.data}`);
    let msg = calculateCost(request.data);
    sendResponse({cost:`${msg}`});
  });

init();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5wb3B1cC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVyxlQUFlLFdBQVc7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWSxNQUFNLFdBQVc7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRCxhQUFhO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsYUFBYTtBQUN6QztBQUNBLGtCQUFrQixRQUFRLElBQUksRUFBRTtBQUNoQyxHQUFHOztBQUVILE8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXBzLWV4dGVuc2lvbi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGlzdG9yeV90YWJsZVwiKTtcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VudHJ5X2Zvcm1cIik7XG5jb25zdCBpbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nZW5lcmFsX2luZm9cIik7XG5jb25zdCBuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuYW1lXCIpO1xuY29uc3QgbXBnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtcGdcIik7XG5jb25zdCBjbGVhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIik7XG5cbi8vIFBPUFVQIFdJTkRPVyBGVU5DVElPTlNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBzYXZlZF9tcGcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1wZ1wiKTtcbiAgdmFyIHVzZXJfbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmFtZVwiKTtcbiAgdmFyIG5ld191c2VyO1xuICBpZiAoc2F2ZWRfbXBnID09PSBudWxsKSB7XG4gICAgbmV3X3VzZXIgPSB0cnVlO1xuICAgIGNvbnNvbGUubG9nKFwiTm8gZGF0YSBmb3VuZCBpbiBsb2NhbFN0b3JhZ2VcIik7XG4gIH0gZWxzZSB7XG4gICAgbmV3X3VzZXIgPSBmYWxzZTtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBHb3QgdmFsdWUgJHtzYXZlZF9tcGd9IG1wZyBhbmQgbmFtZSAke3VzZXJfbmFtZX0gZnJvbSBsb2NhbFN0b3JhZ2VgXG4gICAgKTtcbiAgfVxuICBpZiAobmV3X3VzZXIpIHtcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH0gZWxzZSB7XG4gICAgc2hvd1dlbGNvbWVNZXNzYWdlKHVzZXJfbmFtZSwgc2F2ZWRfbXBnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG93V2VsY29tZU1lc3NhZ2UoKSB7XG4gIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBpbmZvLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2VsY29tZV9uYW1lXCIpLnRleHRDb250ZW50ID1cbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5hbWVcIikgKyBcIiFcIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWxjb21lX21wZ1wiKS50ZXh0Q29udGVudCA9XG4gICAgXCJZb3VyIHNhdmVkIE1QRyBpcyBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpICsgXCIgbWlsZXMgcGVyIGdhbGxvbi5cIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYW1wbGVfdHJpcFwiKS50ZXh0Q29udGVudCA9IFwiJFwiICsgY2FsY3VsYXRlQ29zdCgxMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgJHtuYW1lLnZhbHVlfSBhbmQgJHttcGcudmFsdWV9IGZyb20gZm9ybSBzdWJtaXNzaW9uYCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibXBnXCIsIG1wZy52YWx1ZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmFtZVwiLCBuYW1lLnZhbHVlKTtcbiAgc2hvd1dlbGNvbWVNZXNzYWdlKCk7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUNvc3QoZGlzdGFuY2UpIHtcbiAgdmFyIGN1cnJlbnRHYXNQcmljZSA9IDQuNTtcbiAgdmFyIHBlcmNlbnQgPSBkaXN0YW5jZSAvIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpO1xuXG4gIHJldHVybiAocGVyY2VudCAqIGN1cnJlbnRHYXNQcmljZSkudG9GaXhlZCgyKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc29sZS5sb2coXCJDbGVhcmluZyBsb2NhbFN0b3JhZ2VcIik7XG4gIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICBpbml0KCk7XG59XG5cblxuLy8gTElTVEVOIEZPUiBVUERBVEVTIEZST00gQkFDS0dST1VORC5KUyBBTkQgVVBEQVRFIEFDQ09SRElOR0xZXG5mdW5jdGlvbiB1cGRhdGVXZWxjb21lTWVzc2FnZShzdyl7XG4gIHZhciBiYW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcHNfYm9vbFwiKTtcbiAgLy9zdyA/IGJhbm5lci50ZXh0Q29udGVudCA9IFwiR09PR0xFIE1BUFNcIiA6IGJhbm5lci50ZXh0Q29udGVudCA9IFwiTk9UIEdPT0dMRSBNQVBTXCI7XG4gIC8vYmFubmVyLnRleHRDb250ZW50ID0gc3cgPyBcIkdPT0dMRSBNQVBTXCIgOiBcIk5PVCBHT09HTEUgTUFQU1wiO1xuICBiYW5uZXIudGV4dENvbmVudCA9IHN3O1xufVxuXG4vLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiBoYW5kbGVTdWJtaXQoZSkpO1xuY2xlYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiByZXNldChlKSk7XG5cbi8vIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbi8vICAgZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2Upe1xuLy8gICAgIGNvbnNvbGUubG9nKGBFeHRlbnNpb24gc2NyaXB0IGdvdCBtZXNzYWdlOiAke21lc3NhZ2UuZGF0YX1gKTtcbi8vICAgICB2YXIgbXNnID0gbWVzc2FnZS5kYXRhO1xuLy8gICAgIHVwZGF0ZVdlbGNvbWVNZXNzYWdlKG1zZyk7XG4vLyAgIH1cbi8vICk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhgUmVjZWl2ZWQgJHtyZXF1ZXN0LmRhdGF9YCk7XG4gICAgbGV0IG1zZyA9IGNhbGN1bGF0ZUNvc3QocmVxdWVzdC5kYXRhKTtcbiAgICBzZW5kUmVzcG9uc2Uoe2Nvc3Q6YCR7bXNnfWB9KTtcbiAgfSk7XG5cbmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=