/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/options.js ***!
  \************************/
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

// Script items
const user = {};
const dev = true;
var currently_authd = false;
// =============================================

// POPUP WINDOW FUNCTIONS
function render() {
  // hide vehicles, show as needed
  for (vehicle of vehicle_items) {
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
        vehicle_items[i].style.color = "black";
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

function handleSubmit(event) {
  event.preventDefault();

  const fields = document.querySelectorAll(".inp");

  const new_vehicle = {
    make: fields[0].value,
    model: fields[1].value,
    mpg: fields[2].value,
    selected: true
  };

  var n = parseInt(memPull("num"));
  new_vehicle.id = n;
  var v_name = "v" + n;
  memPush(v_name, JSON.stringify(new_vehicle));

  console.log("Selecting newest vehicle");
  memPush("sel", JSON.stringify(new_vehicle));
  chrome.storage.sync.set({ selected: new_vehicle });
  n++;
  memPush("num", n);

  render();
}

function vehicleClick(e) {
  console.log(e.target.className);
  if (!e.target.className.includes("vehicle_item")) {
    var v_id = e.target.parentNode.className.split(" ")[1];
  } else {
    var v_id = e.target.className.split(" ")[1];
  }

  const selected = JSON.parse(memPull(v_id));
  const cur = JSON.parse(memPull("sel"));

  if (cur.id === selected.id) {
    console.log("This vehicle is already selected");
  } else {
    memPush("sel", JSON.stringify(selected));

    console.log(`The new MPG used will be ${selected.mpg}`);
    chrome.storage.sync.set({ selected: selected });
    console.log("pushed selected?");

    render();
  }
}

// LISTEN FOR UPDATES FROM BACKGROUND.JS AND UPDATE ACCORDINGLY
// going to end my life I can't believe I just used a closure in the wild
function generateToggler() {
  var t = 0;
  function toggle() {
    switch (t) {
      case 0:
        new_car_button.style.display = "none";
        new_car_form.style.display = "block";
        t = 1;
        break;
      case 1:
        document.querySelector("#make").value = "";
        document.querySelector("#model").value = "";
        document.querySelector("#mpg").value = "";
        new_car_button.style.display = "block";
        new_car_form.style.display = "none";
        t = 0;
        break;
    }
  }
  return toggle;
}

const tog_func = generateToggler();

// RUN UPON EXTENSION INIT
render();

new_car_button.addEventListener("click", (e) => {
  e.preventDefault();
  tog_func();
});

document.querySelector(".vehicle_submit").addEventListener("click", (e) => {
  e.preventDefault();
  handleSubmit(e);
  tog_func();
});

document.querySelector(".vehicle_cancel").addEventListener("click", (e) => {
  e.preventDefault();
  tog_func();
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

for (vehicle of vehicle_items) {
  vehicle.addEventListener("click", (e) => vehicleClick(e));
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixHQUFHLGVBQWUsRUFBRTtBQUM1QztBQUNBO0FBQ0EsSUFBSTtBQUNKLDhCQUE4QixNQUFNO0FBQ3BDLHNDQUFzQyxHQUFHLEVBQUUsRUFBRTtBQUM3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSiwyQ0FBMkMsRUFBRTtBQUM3QztBQUNBLHlDQUF5QyxJQUFJO0FBQzdDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixHQUFHO0FBQ2hDO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCLHVCQUF1QjtBQUNuRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUEsNENBQTRDLGFBQWE7QUFDekQsOEJBQThCLG9CQUFvQjtBQUNsRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUyxpQkFBaUIsR0FBRztBQUMzRDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFNBQVMsaUJBQWlCLEdBQUc7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvb3B0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPUFRJT05TLkpTXG4vLyBoYW5kbGUgZm9ybSBzdWJtaXNzaW9ucywgZGF0YSBzYXZpbmcsIGRhdGEgY2hhbmdpbmdcbi8vIGFsbCBkYXRhIHNob3VsZCBiZSBwYXNzZWQgdG8gYmFja2dyb3VuZC5qcyB1cG9uIHNhdmVcbi8vIHV0aWxpemUgY2hyb21lIHN0b3JhZ2Ugc28gYWxsIHNjcmlwdHMgY2FuIGFjY2VzcyBkYXRhXG5cbi8vIE1FTU9SWSBTRVRUSU5HL0dFVFRJTkcgLSBtb3ZlIHRvIG5ldyBmaWxlXG5mdW5jdGlvbiBtZW1QdXNoKGssIHYpIHtcbiAgY29uc29sZS5sb2coYEFkZGluZyAke2t9IHRvIG1lbW9yeSBhcyAke3Z9YCk7XG4gIGlmIChkZXYpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrLCB2KTtcbiAgfSBlbHNlIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGs6IHYgfSk7XG4gICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIFNFVCAke2t9ICR7dn1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZW1QdWxsKGspIHtcbiAgaWYgKGRldikge1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgUVVFUllJTkcgJHtrfWApO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KGssIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBHT1Q6ICR7cmVzfWApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcbiAgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdMT0JBTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRE9NIGl0ZW1zXG5jb25zdCB2ZWhpY2xlX2l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52ZWhpY2xlX2l0ZW1cIik7XG5jb25zdCBuZXdfY2FyX2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3X2Nhcl9idXR0b25cIik7XG5jb25zdCBuZXdfY2FyX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfZm9ybVwiKTtcbmNvbnN0IG5hbWVfZW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG5jb25zdCB3ZWxjb21lX21lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1faGVhZGVyXCIpO1xuXG4vLyBTY3JpcHQgaXRlbXNcbmNvbnN0IHVzZXIgPSB7fTtcbmNvbnN0IGRldiA9IHRydWU7XG52YXIgY3VycmVudGx5X2F1dGhkID0gZmFsc2U7XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gUE9QVVAgV0lORE9XIEZVTkNUSU9OU1xuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAvLyBoaWRlIHZlaGljbGVzLCBzaG93IGFzIG5lZWRlZFxuICBmb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICAgIHZlaGljbGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG4gIGN1cnJlbnRseV9hdXRoZCA9IG1lbVB1bGwoXCJsb2dpblwiKTtcblxuICBpZiAoY3VycmVudGx5X2F1dGhkID09PSBcInRydWVcIikge1xuICAgIC8vIHBvcHVsYXRlIHVzZXIgZGF0YVxuICAgIHZhciBuYW1lID0gbWVtUHVsbChcIm5hbWVcIik7XG4gICAgdmFyIG4gPSBwYXJzZUludChtZW1QdWxsKFwibnVtXCIpKTtcbiAgICBpZiAobiAhPT0gMCkge1xuICAgICAgdmFyIHNlbF9tcGcgPSBKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLm1wZztcbiAgICB9XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiV2VsY29tZSBiYWNrLCBcIiArIG5hbWUgKyBcIiFcIjtcbiAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gbmFtZTtcbiAgICBuZXdfY2FyX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgY29uc29sZS5sb2coYFRoZXJlIGFyZSAke259IGNhci9zIGluIG1lbW9yeWApO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IG47XG4gICAgdmFyIHRtcDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gICAgICB0bXAgPSBcInZcIiArIGk7XG4gICAgICBjb25zdCBjdXJfdiA9IEpTT04ucGFyc2UobWVtUHVsbCh0bXApKTtcbiAgICAgIHZlaGljbGVfaXRlbXNbaV0uY2hpbGROb2Rlc1syXS5pbm5lclRleHQgPSBjdXJfdi5tYWtlICsgXCIgXCIgKyBjdXJfdi5tb2RlbCArIFwiIChcIiArIGN1cl92Lm1wZyArIFwiIE1QRylcIjtcbiAgICAgIGlmIChKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLmlkID09PSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSkuaWQpIHtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2ZWhpY2xlX2l0ZW1zW2ldLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3ZWxjb21lX21lc3NhZ2UuaW5uZXJUZXh0ID0gXCJBZGQgeW91ciBpbmZvXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNudW1fdmVoaWNsZXNcIikuaW5uZXJUZXh0ID0gMDtcbiAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gXCJOYW1lXCI7XG4gICAgbmV3X2Nhcl9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgbWVtUHVzaChcIm51bVwiLCAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICBjb25zdCBmaWVsZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmlucFwiKTtcblxuICBjb25zdCBuZXdfdmVoaWNsZSA9IHtcbiAgICBtYWtlOiBmaWVsZHNbMF0udmFsdWUsXG4gICAgbW9kZWw6IGZpZWxkc1sxXS52YWx1ZSxcbiAgICBtcGc6IGZpZWxkc1syXS52YWx1ZSxcbiAgICBzZWxlY3RlZDogdHJ1ZVxuICB9O1xuXG4gIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gIG5ld192ZWhpY2xlLmlkID0gbjtcbiAgdmFyIHZfbmFtZSA9IFwidlwiICsgbjtcbiAgbWVtUHVzaCh2X25hbWUsIEpTT04uc3RyaW5naWZ5KG5ld192ZWhpY2xlKSk7XG5cbiAgY29uc29sZS5sb2coXCJTZWxlY3RpbmcgbmV3ZXN0IHZlaGljbGVcIik7XG4gIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzZWxlY3RlZDogbmV3X3ZlaGljbGUgfSk7XG4gIG4rKztcbiAgbWVtUHVzaChcIm51bVwiLCBuKTtcblxuICByZW5kZXIoKTtcbn1cblxuZnVuY3Rpb24gdmVoaWNsZUNsaWNrKGUpIHtcbiAgY29uc29sZS5sb2coZS50YXJnZXQuY2xhc3NOYW1lKTtcbiAgaWYgKCFlLnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoXCJ2ZWhpY2xlX2l0ZW1cIikpIHtcbiAgICB2YXIgdl9pZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKVsxXTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdl9pZCA9IGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdChcIiBcIilbMV07XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZCA9IEpTT04ucGFyc2UobWVtUHVsbCh2X2lkKSk7XG4gIGNvbnN0IGN1ciA9IEpTT04ucGFyc2UobWVtUHVsbChcInNlbFwiKSk7XG5cbiAgaWYgKGN1ci5pZCA9PT0gc2VsZWN0ZWQuaWQpIHtcbiAgICBjb25zb2xlLmxvZyhcIlRoaXMgdmVoaWNsZSBpcyBhbHJlYWR5IHNlbGVjdGVkXCIpO1xuICB9IGVsc2Uge1xuICAgIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWQpKTtcblxuICAgIGNvbnNvbGUubG9nKGBUaGUgbmV3IE1QRyB1c2VkIHdpbGwgYmUgJHtzZWxlY3RlZC5tcGd9YCk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzZWxlY3RlZDogc2VsZWN0ZWQgfSk7XG4gICAgY29uc29sZS5sb2coXCJwdXNoZWQgc2VsZWN0ZWQ/XCIpO1xuXG4gICAgcmVuZGVyKCk7XG4gIH1cbn1cblxuLy8gTElTVEVOIEZPUiBVUERBVEVTIEZST00gQkFDS0dST1VORC5KUyBBTkQgVVBEQVRFIEFDQ09SRElOR0xZXG4vLyBnb2luZyB0byBlbmQgbXkgbGlmZSBJIGNhbid0IGJlbGlldmUgSSBqdXN0IHVzZWQgYSBjbG9zdXJlIGluIHRoZSB3aWxkXG5mdW5jdGlvbiBnZW5lcmF0ZVRvZ2dsZXIoKSB7XG4gIHZhciB0ID0gMDtcbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgIHN3aXRjaCAodCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB0ID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFrZVwiKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21wZ1wiKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHQgPSAwO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvZ2dsZTtcbn1cblxuY29uc3QgdG9nX2Z1bmMgPSBnZW5lcmF0ZVRvZ2dsZXIoKTtcblxuLy8gUlVOIFVQT04gRVhURU5TSU9OIElOSVRcbnJlbmRlcigpO1xuXG5uZXdfY2FyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB0b2dfZnVuYygpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaGFuZGxlU3VibWl0KGUpO1xuICB0b2dfZnVuYygpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgdG9nX2Z1bmMoKTtcbn0pO1xuXG5uYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaWYgKG5hbWVfZW50cnkudmFsdWUgIT09IFwiXCIpIHtcbiAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHVzZXI6IGAke25hbWVfZW50cnkudmFsdWV9YCB9KTtcbiAgICBtZW1QdXNoKFwibG9naW5cIiwgXCJ0cnVlXCIpO1xuICAgIHJlbmRlcigpO1xuICB9XG59KTtcblxubmFtZV9lbnRyeS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHtcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgbWVtUHVzaChcIm5hbWVcIiwgbmFtZV9lbnRyeS52YWx1ZSk7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHVzZXI6IGAke25hbWVfZW50cnkudmFsdWV9YCB9KTtcbiAgICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgICByZW5kZXIoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgZG91YmxlX2NoZWNrID0gMDtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2ggKGRvdWJsZV9jaGVjaykge1xuICAgIGNhc2UgMDpcbiAgICAgIGNvbnNvbGUubG9nKGRvdWJsZV9jaGVjayk7XG4gICAgICBkb3VibGVfY2hlY2sgPSAxO1xuICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIlllcyBJJ20gc3VyZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpLnRleHRDb250ZW50ID0gXCJDYW5jZWxcIjtcbiAgICAgIGNvbnNvbGUubG9nKFwid2FybmluZyFcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBjb25zb2xlLmxvZyhkb3VibGVfY2hlY2spO1xuICAgICAgZG91YmxlX2NoZWNrID0gMDtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbGVhciBkYXRhXCI7XG4gICAgICBjb25zb2xlLmxvZyhcIkNsZWFyZWRcIik7XG4gICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuY2xlYXIoKTtcbiAgICAgIG5hbWVfZW50cnkudmFsdWUgPSBcIlwiO1xuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2ggKGRvdWJsZV9jaGVjaykge1xuICAgIGNhc2UgMTpcbiAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbG9zZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAwOlxuICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuXG5mb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICB2ZWhpY2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdmVoaWNsZUNsaWNrKGUpKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==