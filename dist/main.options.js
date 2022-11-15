/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/vehicles.js":
/*!*************************!*\
  !*** ./src/vehicles.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vehicle": () => (/* binding */ Vehicle)
/* harmony export */ });
class Vehicle {
    constructor(make, model, mpg, id){
        this.make = make;
        this.model = model;
        this.mpg = mpg;
        this.id = id;
    }

    string(){
        return JSON.stringify(this);
    }

}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/options.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vehicles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vehicles */ "./src/vehicles.js");
// OPTIONS.JS
// handle form submissions, data saving, data changing
// all data should be passed to background.js upon save
// utilize chrome storage so all scripts can access data



// MEMORY SETTING/GETTING - move to new file
function memPush(k, v) {
  console.log(`Adding ${k} to memory as ${v}`);
  if (dev) {
    localStorage.setItem(k, v);
  } else {
    chrome.storage.sync.set({ k: v });
    console.log(`CHROME STORAGE SET ${k} ${v}`);
  }
}

function memPull(k) {
  if (dev) {
    return localStorage.getItem(k);
  } else {
    console.log(`CHROME STORAGE QUERYING ${k}`);
    chrome.storage.sync.get(k, function (res) {
      console.log(`CHROME STORAGE GOT: ${res}`);
      return res;
    });
  }
}



// =============================================
// GLOBALS =====================================
// DOM items
const vehicle_items = document.querySelectorAll(".vehicle_item");
const new_car_button = document.querySelector(".new_car_button");
const new_car_form = document.querySelector(".new_car_form");
const name_entry = document.querySelector("#name");
const welcome_message = document.querySelector("#form_header");
var fields = document.querySelectorAll(".inp");

// Script items
var cur_selected = {};
const dev = true;
var currently_authd = false;
const info_strings = ["make", "model", "mpg"];
const display_strings = ["Make", "Model", "MPG"];
const text_color = "#353839";
// =============================================

// POPUP WINDOW FUNCTIONS
function render() {
  // hide vehicles, show as needed
  for (let vehicle of vehicle_items) {
    vehicle.style.display = "none";
  }
  currently_authd = memPull("login");

  if (currently_authd === "true") {
    // populate user data
    var name = memPull("name");
    var n = parseInt(memPull("num"));
    if (n !== 0) {
      var sel_mpg = JSON.parse(memPull("sel")).mpg;
    }
    welcome_message.innerText = "Welcome back, " + name + "!";
    name_entry.placeholder = name;
    new_car_button.disabled = false;

    console.log(`There are ${n} car/s in memory`);
    document.querySelector("#num_vehicles").innerText = n;
    var tmp;
    for (var i = 0; i < n; i++) {
      vehicle_items[i].style.display = "grid";
      tmp = "v" + i;
      const cur_v = JSON.parse(memPull(tmp));
      vehicle_items[i].childNodes[2].innerText = cur_v.make + " " + cur_v.model + " (" + cur_v.mpg + " MPG)";
      if (JSON.parse(memPull("sel")).id === JSON.parse(memPull(tmp)).id) {
        vehicle_items[i].style.color = "red";
      } else {
        vehicle_items[i].style.color = text_color;
      }
    }
  } else {
    welcome_message.innerText = "Add your info";
    document.querySelector("#num_vehicles").innerText = 0;
    name_entry.placeholder = "Name";
    new_car_button.disabled = true;

    memPush("num", 0);
  }
}

function clearForm(){
  for (var i = 0; i < fields.length; i++){
    fields[i].value = "";
    fields[i].placeholder = display_strings[i];
  }
}

function handleSubmit(event) {
  event.preventDefault();

  var n = parseInt(memPull("num"));

  const new_vehicle = new _vehicles__WEBPACK_IMPORTED_MODULE_0__.Vehicle(fields[0].value, fields[1].value, fields[2].value, n);

  var v_name = "v" + n;
  memPush(v_name, new_vehicle.string());

  console.log("Selecting newest vehicle");
  cur_selected = new_vehicle;
  memPush("sel", new_vehicle.string());
  chrome.storage.sync.set({ selected: new_vehicle });
  n++;
  memPush("num", n);

  clearForm();

  render();
}



function handleUpdate(){
  var v_id = cur_selected.id;

  var new_vehicle = new _vehicles__WEBPACK_IMPORTED_MODULE_0__.Vehicle(
    fields[0].value ? fields[0].value : fields[0].placeholder,
    fields[1].value ? fields[1].value : fields[1].placeholder,
    fields[2].value ? fields[2].value : fields[2].placeholder.split(" ")[0],
    v_id
  );

  memPush("v" + v_id, new_vehicle.string());
  memPush("sel", new_vehicle.string());
  chrome.storage.sync.set({selected: new_vehicle});

  
  cur_selected = new_vehicle;
  hideInfo();
  showInfo();
  render();

}



function hideInfo(){

  clearForm();

  document.querySelector("h4").innerText = "New vehicle info";
  document.querySelector(".vehicle_delete").style.display = "none";
}

function showInfo(){
  console.log("selected:")
  console.log(cur_selected);
  


  document.querySelector("h4").innerText = "Vehicle Info";
  new_car_form.style.display = "grid";
  new_car_button.style.display = "none";
  document.querySelector(".vehicle_submit").style.display = "none";
  document.querySelector(".vehicle_cancel").style.display = "none";
  document.querySelector(".vehicle_update").style.display = "inline";
  document.querySelector(".cancel_update").style.display = "inline";
  document.querySelector(".vehicle_delete").style.display = "inline";


  for (var i = 0; i < fields.length; i++ ) {
    fields[i].placeholder = cur_selected[info_strings[i]];
    if (info_strings[i] === "mpg"){
      fields[i].placeholder += " MPG";
    }
  }

}




function vehicleClick(e) {
  console.log(e.target.className);
  if (!e.target.className.includes("vehicle_item")) {
    var v_id = e.target.parentNode.className.split(" ")[1];
  } else {
    var v_id = e.target.className.split(" ")[1];
  }

  const selected = JSON.parse(memPull(v_id));

  if (cur_selected.id === selected.id) {
    console.log("This vehicle is already selected");
  } else {
    memPush("sel", JSON.stringify(selected));

    console.log(`The new MPG used will be ${selected.mpg}`);
    chrome.storage.sync.set({ selected: selected });
    console.log("pushed selected?");
  }

    cur_selected = selected;

    showInfo();

    render();
}

function showHide(){
  if (new_car_form.style.display === ""){
    new_car_form.style.display = "none";
  }

  if (new_car_form.style.display !== "none"){
    console.log("Here")
    new_car_button.style.display = "inline";
    new_car_form.style.display = "none";

    document.querySelector(".cancel_update").style.display = "inline";
    document.querySelector(".vehicle_update").style.display = "inline";
  } else {
    new_car_form.style.display = "flex";
    new_car_button.style.display = "none";

    document.querySelector("#make").value = "";
    document.querySelector("#model").value = "";
    document.querySelector("#mpg").value = "";

    document.querySelector(".cancel_update").style.display = "none";
    document.querySelector(".vehicle_update").style.display = "none";
    document.querySelector(".vehicle_submit").style.display = "inline";
    document.querySelector(".vehicle_cancel").style.display = "inline";
  }
 
}

// RUN UPON EXTENSION INIT
render();

new_car_button.addEventListener("click", (e) => {
  e.preventDefault();
  showHide();
});

document.querySelector(".vehicle_submit").addEventListener("click", (e) => {
  e.preventDefault();
  handleSubmit(e);
  showHide();
});

document.querySelector(".vehicle_cancel").addEventListener("click", (e) => {
  e.preventDefault();

  hideInfo();
  showHide()
});

document.querySelector(".vehicle_update").addEventListener("click", (e) => {
  e.preventDefault();

  handleUpdate();

});

document.querySelector(".cancel_update").addEventListener("click", (e) => {
  e.preventDefault();

  hideInfo();
  showHide();
});

document.querySelector(".vehicle_delete").addEventListener("click", (e) => {
  window.alert("delete");
}); 


function allStorage() {

  var keys = Object.keys(localStorage),
      i = keys.length;

  while ( i-- ) {
      console.log(keys[i], localStorage.getItem(keys[i]) );
  }

}

document.querySelector(".mem_dump").addEventListener("click", (e) => {
  e.preventDefault();

  console.log("LOCAL STORAGE:");
  allStorage();

  const retrieved = chrome.storage.sync.get();

  retrieved.then( (data) => {
    console.log("CHROME:");
    console.log(data);
  });

});

name_entry.addEventListener("blur", (e) => {
  e.preventDefault();
  if (name_entry.value !== "") {
    memPush("name", name_entry.value);
    chrome.storage.sync.set({ user: `${name_entry.value}` });
    memPush("login", "true");
    render();
  }
});

name_entry.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    if (name_entry.value !== "") {
      memPush("name", name_entry.value);
      chrome.storage.sync.set({ user: `${name_entry.value}` });
      memPush("login", "true");
      render();
    }
  }
});

var double_check = 0;

document.querySelector(".clear").addEventListener("click", (e) => {
  e.preventDefault();
  switch (double_check) {
    case 0:
      console.log(double_check);
      double_check = 1;
      e.target.style.color = "red";
      e.target.textContent = "Yes I'm sure";
      document.querySelector(".warning").style.display = "block";
      document.querySelector(".close").textContent = "Cancel";
      console.log("warning!");
      break;
    case 1:
      console.log(double_check);
      double_check = 0;
      document.querySelector(".warning").style.display = "none";
      e.target.style.color = "black";
      e.target.textContent = "Clear data";
      console.log("Cleared");
      localStorage.clear();
      chrome.storage.sync.clear();
      name_entry.value = "";
      new_car_form.style.display = "none";
      new_car_button.style.display = "block";

      render();
      break;
  }
});

document.querySelector(".close").addEventListener("click", (e) => {
  e.preventDefault();
  switch (double_check) {
    case 1:
      double_check = 0;
      document.querySelector(".warning").style.display = "none";
      document.querySelector(".clear").style.color = "black";
      document.querySelector(".clear").textContent = "Clear data";
      e.target.textContent = "Close";
      break;
    case 0:
      window.close();
      return false;
  }
});

for (let vehicle of vehicle_items) {
  vehicle.addEventListener("click", (e) => vehicleClick(e));
}


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLENBQUM7OztBQUdEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUyxpQkFBaUIsR0FBRztBQUMzRDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFNBQVMsaUJBQWlCLEdBQUc7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL3ZlaGljbGVzLmpzIiwid2VicGFjazovL21hcHMtZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hcHMtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tYXBzLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21hcHMtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvb3B0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBWZWhpY2xlIHtcbiAgICBjb25zdHJ1Y3RvcihtYWtlLCBtb2RlbCwgbXBnLCBpZCl7XG4gICAgICAgIHRoaXMubWFrZSA9IG1ha2U7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5tcGcgPSBtcGc7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9XG5cbiAgICBzdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH1cblxufVxuXG5leHBvcnQge1ZlaGljbGV9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gT1BUSU9OUy5KU1xuLy8gaGFuZGxlIGZvcm0gc3VibWlzc2lvbnMsIGRhdGEgc2F2aW5nLCBkYXRhIGNoYW5naW5nXG4vLyBhbGwgZGF0YSBzaG91bGQgYmUgcGFzc2VkIHRvIGJhY2tncm91bmQuanMgdXBvbiBzYXZlXG4vLyB1dGlsaXplIGNocm9tZSBzdG9yYWdlIHNvIGFsbCBzY3JpcHRzIGNhbiBhY2Nlc3MgZGF0YVxuXG5pbXBvcnQgeyBWZWhpY2xlIH0gZnJvbSBcIi4vdmVoaWNsZXNcIlxuXG4vLyBNRU1PUlkgU0VUVElORy9HRVRUSU5HIC0gbW92ZSB0byBuZXcgZmlsZVxuZnVuY3Rpb24gbWVtUHVzaChrLCB2KSB7XG4gIGNvbnNvbGUubG9nKGBBZGRpbmcgJHtrfSB0byBtZW1vcnkgYXMgJHt2fWApO1xuICBpZiAoZGV2KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaywgdik7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBrOiB2IH0pO1xuICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBTRVQgJHtrfSAke3Z9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVtUHVsbChrKSB7XG4gIGlmIChkZXYpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oayk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIFFVRVJZSU5HICR7a31gKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChrLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgR09UOiAke3Jlc31gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gR0xPQkFMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBET00gaXRlbXNcbmNvbnN0IHZlaGljbGVfaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnZlaGljbGVfaXRlbVwiKTtcbmNvbnN0IG5ld19jYXJfYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXdfY2FyX2J1dHRvblwiKTtcbmNvbnN0IG5ld19jYXJfZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3X2Nhcl9mb3JtXCIpO1xuY29uc3QgbmFtZV9lbnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKTtcbmNvbnN0IHdlbGNvbWVfbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9ybV9oZWFkZXJcIik7XG52YXIgZmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnBcIik7XG5cbi8vIFNjcmlwdCBpdGVtc1xudmFyIGN1cl9zZWxlY3RlZCA9IHt9O1xuY29uc3QgZGV2ID0gdHJ1ZTtcbnZhciBjdXJyZW50bHlfYXV0aGQgPSBmYWxzZTtcbmNvbnN0IGluZm9fc3RyaW5ncyA9IFtcIm1ha2VcIiwgXCJtb2RlbFwiLCBcIm1wZ1wiXTtcbmNvbnN0IGRpc3BsYXlfc3RyaW5ncyA9IFtcIk1ha2VcIiwgXCJNb2RlbFwiLCBcIk1QR1wiXTtcbmNvbnN0IHRleHRfY29sb3IgPSBcIiMzNTM4MzlcIjtcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBQT1BVUCBXSU5ET1cgRlVOQ1RJT05TXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIC8vIGhpZGUgdmVoaWNsZXMsIHNob3cgYXMgbmVlZGVkXG4gIGZvciAobGV0IHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICAgIHZlaGljbGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG4gIGN1cnJlbnRseV9hdXRoZCA9IG1lbVB1bGwoXCJsb2dpblwiKTtcblxuICBpZiAoY3VycmVudGx5X2F1dGhkID09PSBcInRydWVcIikge1xuICAgIC8vIHBvcHVsYXRlIHVzZXIgZGF0YVxuICAgIHZhciBuYW1lID0gbWVtUHVsbChcIm5hbWVcIik7XG4gICAgdmFyIG4gPSBwYXJzZUludChtZW1QdWxsKFwibnVtXCIpKTtcbiAgICBpZiAobiAhPT0gMCkge1xuICAgICAgdmFyIHNlbF9tcGcgPSBKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLm1wZztcbiAgICB9XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiV2VsY29tZSBiYWNrLCBcIiArIG5hbWUgKyBcIiFcIjtcbiAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gbmFtZTtcbiAgICBuZXdfY2FyX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgY29uc29sZS5sb2coYFRoZXJlIGFyZSAke259IGNhci9zIGluIG1lbW9yeWApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IG47XG4gICAgdmFyIHRtcDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gICAgICB0bXAgPSBcInZcIiArIGk7XG4gICAgICBjb25zdCBjdXJfdiA9IEpTT04ucGFyc2UobWVtUHVsbCh0bXApKTtcbiAgICAgIHZlaGljbGVfaXRlbXNbaV0uY2hpbGROb2Rlc1syXS5pbm5lclRleHQgPSBjdXJfdi5tYWtlICsgXCIgXCIgKyBjdXJfdi5tb2RlbCArIFwiIChcIiArIGN1cl92Lm1wZyArIFwiIE1QRylcIjtcbiAgICAgIGlmIChKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLmlkID09PSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSkuaWQpIHtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2ZWhpY2xlX2l0ZW1zW2ldLnN0eWxlLmNvbG9yID0gdGV4dF9jb2xvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiQWRkIHlvdXIgaW5mb1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IDA7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IFwiTmFtZVwiO1xuICAgIG5ld19jYXJfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIG1lbVB1c2goXCJudW1cIiwgMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJGb3JtKCl7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKXtcbiAgICBmaWVsZHNbaV0udmFsdWUgPSBcIlwiO1xuICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciA9IGRpc3BsYXlfc3RyaW5nc1tpXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgbiA9IHBhcnNlSW50KG1lbVB1bGwoXCJudW1cIikpO1xuXG4gIGNvbnN0IG5ld192ZWhpY2xlID0gbmV3IFZlaGljbGUoZmllbGRzWzBdLnZhbHVlLCBmaWVsZHNbMV0udmFsdWUsIGZpZWxkc1syXS52YWx1ZSwgbik7XG5cbiAgdmFyIHZfbmFtZSA9IFwidlwiICsgbjtcbiAgbWVtUHVzaCh2X25hbWUsIG5ld192ZWhpY2xlLnN0cmluZygpKTtcblxuICBjb25zb2xlLmxvZyhcIlNlbGVjdGluZyBuZXdlc3QgdmVoaWNsZVwiKTtcbiAgY3VyX3NlbGVjdGVkID0gbmV3X3ZlaGljbGU7XG4gIG1lbVB1c2goXCJzZWxcIiwgbmV3X3ZlaGljbGUuc3RyaW5nKCkpO1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNlbGVjdGVkOiBuZXdfdmVoaWNsZSB9KTtcbiAgbisrO1xuICBtZW1QdXNoKFwibnVtXCIsIG4pO1xuXG4gIGNsZWFyRm9ybSgpO1xuXG4gIHJlbmRlcigpO1xufVxuXG5cblxuZnVuY3Rpb24gaGFuZGxlVXBkYXRlKCl7XG4gIHZhciB2X2lkID0gY3VyX3NlbGVjdGVkLmlkO1xuXG4gIHZhciBuZXdfdmVoaWNsZSA9IG5ldyBWZWhpY2xlKFxuICAgIGZpZWxkc1swXS52YWx1ZSA/IGZpZWxkc1swXS52YWx1ZSA6IGZpZWxkc1swXS5wbGFjZWhvbGRlcixcbiAgICBmaWVsZHNbMV0udmFsdWUgPyBmaWVsZHNbMV0udmFsdWUgOiBmaWVsZHNbMV0ucGxhY2Vob2xkZXIsXG4gICAgZmllbGRzWzJdLnZhbHVlID8gZmllbGRzWzJdLnZhbHVlIDogZmllbGRzWzJdLnBsYWNlaG9sZGVyLnNwbGl0KFwiIFwiKVswXSxcbiAgICB2X2lkXG4gICk7XG5cbiAgbWVtUHVzaChcInZcIiArIHZfaWQsIG5ld192ZWhpY2xlLnN0cmluZygpKTtcbiAgbWVtUHVzaChcInNlbFwiLCBuZXdfdmVoaWNsZS5zdHJpbmcoKSk7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHtzZWxlY3RlZDogbmV3X3ZlaGljbGV9KTtcblxuICBcbiAgY3VyX3NlbGVjdGVkID0gbmV3X3ZlaGljbGU7XG4gIGhpZGVJbmZvKCk7XG4gIHNob3dJbmZvKCk7XG4gIHJlbmRlcigpO1xuXG59XG5cblxuXG5mdW5jdGlvbiBoaWRlSW5mbygpe1xuXG4gIGNsZWFyRm9ybSgpO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoNFwiKS5pbm5lclRleHQgPSBcIk5ldyB2ZWhpY2xlIGluZm9cIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX2RlbGV0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cbmZ1bmN0aW9uIHNob3dJbmZvKCl7XG4gIGNvbnNvbGUubG9nKFwic2VsZWN0ZWQ6XCIpXG4gIGNvbnNvbGUubG9nKGN1cl9zZWxlY3RlZCk7XG4gIFxuXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImg0XCIpLmlubmVyVGV4dCA9IFwiVmVoaWNsZSBJbmZvXCI7XG4gIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3N1Ym1pdFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbF91cGRhdGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9kZWxldGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKyApIHtcbiAgICBmaWVsZHNbaV0ucGxhY2Vob2xkZXIgPSBjdXJfc2VsZWN0ZWRbaW5mb19zdHJpbmdzW2ldXTtcbiAgICBpZiAoaW5mb19zdHJpbmdzW2ldID09PSBcIm1wZ1wiKXtcbiAgICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciArPSBcIiBNUEdcIjtcbiAgICB9XG4gIH1cblxufVxuXG5cblxuXG5mdW5jdGlvbiB2ZWhpY2xlQ2xpY2soZSkge1xuICBjb25zb2xlLmxvZyhlLnRhcmdldC5jbGFzc05hbWUpO1xuICBpZiAoIWUudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcInZlaGljbGVfaXRlbVwiKSkge1xuICAgIHZhciB2X2lkID0gZS50YXJnZXQucGFyZW50Tm9kZS5jbGFzc05hbWUuc3BsaXQoXCIgXCIpWzFdO1xuICB9IGVsc2Uge1xuICAgIHZhciB2X2lkID0gZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKVsxXTtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkID0gSlNPTi5wYXJzZShtZW1QdWxsKHZfaWQpKTtcblxuICBpZiAoY3VyX3NlbGVjdGVkLmlkID09PSBzZWxlY3RlZC5pZCkge1xuICAgIGNvbnNvbGUubG9nKFwiVGhpcyB2ZWhpY2xlIGlzIGFscmVhZHkgc2VsZWN0ZWRcIik7XG4gIH0gZWxzZSB7XG4gICAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShzZWxlY3RlZCkpO1xuXG4gICAgY29uc29sZS5sb2coYFRoZSBuZXcgTVBHIHVzZWQgd2lsbCBiZSAke3NlbGVjdGVkLm1wZ31gKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNlbGVjdGVkOiBzZWxlY3RlZCB9KTtcbiAgICBjb25zb2xlLmxvZyhcInB1c2hlZCBzZWxlY3RlZD9cIik7XG4gIH1cblxuICAgIGN1cl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXG4gICAgc2hvd0luZm8oKTtcblxuICAgIHJlbmRlcigpO1xufVxuXG5mdW5jdGlvbiBzaG93SGlkZSgpe1xuICBpZiAobmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwiXCIpe1xuICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICBpZiAobmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKXtcbiAgICBjb25zb2xlLmxvZyhcIkhlcmVcIilcbiAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV91cGRhdGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIH0gZWxzZSB7XG4gICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21ha2VcIikudmFsdWUgPSBcIlwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikudmFsdWUgPSBcIlwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpLnZhbHVlID0gXCJcIjtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3N1Ym1pdFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfY2FuY2VsXCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICB9XG4gXG59XG5cbi8vIFJVTiBVUE9OIEVYVEVOU0lPTiBJTklUXG5yZW5kZXIoKTtcblxubmV3X2Nhcl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgc2hvd0hpZGUoKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfc3VibWl0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGhhbmRsZVN1Ym1pdChlKTtcbiAgc2hvd0hpZGUoKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfY2FuY2VsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaGlkZUluZm8oKTtcbiAgc2hvd0hpZGUoKVxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV91cGRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBoYW5kbGVVcGRhdGUoKTtcblxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsX3VwZGF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGhpZGVJbmZvKCk7XG4gIHNob3dIaWRlKCk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX2RlbGV0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgd2luZG93LmFsZXJ0KFwiZGVsZXRlXCIpO1xufSk7IFxuXG5cbmZ1bmN0aW9uIGFsbFN0b3JhZ2UoKSB7XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpLFxuICAgICAgaSA9IGtleXMubGVuZ3RoO1xuXG4gIHdoaWxlICggaS0tICkge1xuICAgICAgY29uc29sZS5sb2coa2V5c1tpXSwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5c1tpXSkgKTtcbiAgfVxuXG59XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtX2R1bXBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBjb25zb2xlLmxvZyhcIkxPQ0FMIFNUT1JBR0U6XCIpO1xuICBhbGxTdG9yYWdlKCk7XG5cbiAgY29uc3QgcmV0cmlldmVkID0gY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoKTtcblxuICByZXRyaWV2ZWQudGhlbiggKGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkNIUk9NRTpcIik7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gIH0pO1xuXG59KTtcblxubmFtZV9lbnRyeS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGlmIChuYW1lX2VudHJ5LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgbWVtUHVzaChcIm5hbWVcIiwgbmFtZV9lbnRyeS52YWx1ZSk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyB1c2VyOiBgJHtuYW1lX2VudHJ5LnZhbHVlfWAgfSk7XG4gICAgbWVtUHVzaChcImxvZ2luXCIsIFwidHJ1ZVwiKTtcbiAgICByZW5kZXIoKTtcbiAgfVxufSk7XG5cbm5hbWVfZW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChlKSA9PiB7XG4gIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgaWYgKG5hbWVfZW50cnkudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgIG1lbVB1c2goXCJuYW1lXCIsIG5hbWVfZW50cnkudmFsdWUpO1xuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyB1c2VyOiBgJHtuYW1lX2VudHJ5LnZhbHVlfWAgfSk7XG4gICAgICBtZW1QdXNoKFwibG9naW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuICB9XG59KTtcblxudmFyIGRvdWJsZV9jaGVjayA9IDA7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgc3dpdGNoIChkb3VibGVfY2hlY2spIHtcbiAgICBjYXNlIDA6XG4gICAgICBjb25zb2xlLmxvZyhkb3VibGVfY2hlY2spO1xuICAgICAgZG91YmxlX2NoZWNrID0gMTtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJZZXMgSSdtIHN1cmVcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKS50ZXh0Q29udGVudCA9IFwiQ2FuY2VsXCI7XG4gICAgICBjb25zb2xlLmxvZyhcIndhcm5pbmchXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc29sZS5sb2coZG91YmxlX2NoZWNrKTtcbiAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9IFwiQ2xlYXIgZGF0YVwiO1xuICAgICAgY29uc29sZS5sb2coXCJDbGVhcmVkXCIpO1xuICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmNsZWFyKCk7XG4gICAgICBuYW1lX2VudHJ5LnZhbHVlID0gXCJcIjtcbiAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2ggKGRvdWJsZV9jaGVjaykge1xuICAgIGNhc2UgMTpcbiAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbG9zZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAwOlxuICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuXG5mb3IgKGxldCB2ZWhpY2xlIG9mIHZlaGljbGVfaXRlbXMpIHtcbiAgdmVoaWNsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHZlaGljbGVDbGljayhlKSk7XG59XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==