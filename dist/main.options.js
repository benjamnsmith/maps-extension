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

init();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EscUJBQXFCLFdBQVcsZUFBZSxXQUFXO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVksTUFBTSxXQUFXO0FBQ3ZEO0FBQ0E7QUFDQSwyQkFBMkIsT0FBTyxVQUFVLEVBQUU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRLFdBQVcsRUFBRTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL29wdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gT1BUSU9OUy5KU1xuLy8gaGFuZGxlIGZvcm0gc3VibWlzc2lvbnMsIGRhdGEgc2F2aW5nLCBkYXRhIGNoYW5naW5nXG4vLyBhbGwgZGF0YSBzaG91bGQgYmUgcGFzc2VkIHRvIGJhY2tncm91bmQuanMgdXBvbiBzYXZlXG4vLyB1dGlsaXplIGNocm9tZSBzdG9yYWdlIHNvIGFsbCBzY3JpcHRzIGNhbiBhY2Nlc3MgZGF0YVxuXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGlzdG9yeV90YWJsZVwiKTtcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VudHJ5X2Zvcm1cIik7XG5jb25zdCBpbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nZW5lcmFsX2luZm9cIik7XG5jb25zdCBuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuYW1lXCIpO1xuY29uc3QgbXBnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtcGdcIik7XG5jb25zdCBmaWVsZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XG52YXIgZGF0YSA9IFtdO1xuY29uc3Qgd2VsY29tZV9oZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1faGVhZGVyXCIpO1xuY29uc3Qgd2VsY29tZV9tZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX21lc3NhZ2VcIik7XG5cblxuXG4vLyBQT1BVUCBXSU5ET1cgRlVOQ1RJT05TXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBzYXZlZF9tcGcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1wZ1wiKTtcbiAgICB2YXIgdXNlcl9uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuYW1lXCIpO1xuICAgIHZhciBuZXdfdXNlcjtcbiAgICBpZiAoc2F2ZWRfbXBnID09PSBudWxsKSB7XG4gICAgICAgIG5ld191c2VyID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBkYXRhIGZvdW5kIGluIGxvY2FsU3RvcmFnZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdfdXNlciA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYEdvdCB2YWx1ZSAke3NhdmVkX21wZ30gbXBnIGFuZCBuYW1lICR7dXNlcl9uYW1lfSBmcm9tIGxvY2FsU3RvcmFnZWBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCEgbmV3X3VzZXIpIHtcbiAgICAgICAgZGF0YS5wdXNoKHVzZXJfbmFtZSk7XG4gICAgICAgIGRhdGEucHVzaChzYXZlZF9tcGcpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgc2hvd1dlbGNvbWVNZXNzYWdlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd05ld1VzZXJNZXNzYWdlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93TmV3VXNlck1lc3NhZ2UoKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgbmV3IG1lc3NhZ2VcIik7XG4gICAgZmllbGRzWzBdLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiTmFtZVwiKTtcbiAgICBmaWVsZHNbMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgJycpO1xuICAgIGZpZWxkc1syXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBcIk1ha2VcIik7XG4gICAgd2VsY29tZV9oZWFkZXIuaW5uZXJUZXh0ID0gXCJBZGQgeW91ciBpbmZvXCI7XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHNob3dXZWxjb21lTWVzc2FnZSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgd2VsY29tZSBtZXNzYWdlXCIpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCAyOyBpKyspe1xuICAgICAgICBmaWVsZHNbaV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgZGF0YVtpXSk7XG4gICAgfVxuICAgIHdlbGNvbWVfaGVhZGVyLmlubmVyVGV4dCA9IFwiV2VsY29tZSBiYWNrLCBcIiArIGRhdGFbMF0rIFwiIVwiO1xuICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIllvdSBhcmUgYWJsZSB0byBzZWUgeW91ciBzYXZlZCBzZXR0aW5ncyBiZWxvdyBhbmQgdXBkYXRlIHRoZW0gaWYgbmVjZXNzYXJ5XCI7XG4gICAgY29uc29sZS5sb2coXCJFbmQgb2Ygd2VsY29tZSBtZXNzYWdlXCIpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7bmFtZS52YWx1ZX0gYW5kICR7bXBnLnZhbHVlfSBmcm9tIGZvcm0gc3VibWlzc2lvbmApO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1wZ1wiLCBtcGcudmFsdWUpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm5hbWVcIiwgbmFtZS52YWx1ZSk7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHttcGc6YCR7bXBnLnZhbHVlfWB9KTtcbiAgZGF0YVswXSA9IG5hbWUudmFsdWU7XG4gIGRhdGFbMV0gPSBtcGcudmFsdWU7XG4gICBcbiAgICBuYW1lLnZhbHVlID0gJyc7XG4gICAgbXBnLnZhbHVlID0gJyc7XG4gICAgLy9jaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7bmFtZTpgJHtuYW1lLnZhbHVlfWB9KTtcbiAgc2hvd1dlbGNvbWVNZXNzYWdlKCk7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUNvc3QoZGlzdGFuY2UpIHtcbiAgdmFyIGN1cnJlbnRHYXNQcmljZSA9IDQuNTtcbiAgdmFyIHBlcmNlbnQgPSBkaXN0YW5jZSAvIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXBnXCIpO1xuXG4gIHJldHVybiAocGVyY2VudCAqIGN1cnJlbnRHYXNQcmljZSkudG9GaXhlZCgyKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKFwiQ2xlYXJpbmcgbG9jYWxTdG9yYWdlXCIpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIGRhdGEgPSBbXTtcbiAgICBpbml0KCk7XG59XG5cblxuLy8gTElTVEVOIEZPUiBVUERBVEVTIEZST00gQkFDS0dST1VORC5KUyBBTkQgVVBEQVRFIEFDQ09SRElOR0xZXG5mdW5jdGlvbiB1cGRhdGVXZWxjb21lTWVzc2FnZShzdyl7XG4gIHZhciBiYW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcHNfYm9vbFwiKTtcbiAgYmFubmVyLnRleHRDb25lbnQgPSBzdztcbn1cblxuLy8gUlVOIFVQT04gRVhURU5TSU9OIElOSVRcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4gaGFuZGxlU3VibWl0KGUpKTtcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInJlc2V0XCIsIChlKSA9PiByZXNldChlKSk7XG5cbmluaXQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==