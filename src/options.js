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
var cur_selected = {};
const dev = true;
var currently_authd = false;
const info_strings = ["make", "model", "mpg"];
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
  };

  var n = parseInt(memPull("num"));
  new_vehicle.id = n;
  var v_name = "v" + n;
  memPush(v_name, JSON.stringify(new_vehicle));

  console.log("Selecting newest vehicle");
  cur_selected = new_vehicle;
  memPush("sel", JSON.stringify(new_vehicle));
  chrome.storage.sync.set({ selected: new_vehicle });
  n++;
  memPush("num", n);

  render();
}



function handleUpdate(){
  var v_id = cur_selected.id;

  const fields = document.querySelectorAll(".inp");
  console.log(fields);

  var new_vehicle = {
    make: ( fields[0].value ? fields[0].value : fields[0].placeholder ),
    model: ( fields[1].value ? fields[1].value : fields[1].placeholder ),
    mpg: ( fields[2].value ? fields[2].value : fields[2].placeholder ),
  };

  new_vehicle.id = v_id;
  memPush("v" + v_id, JSON.stringify(new_vehicle));
  memPush("sel", JSON.stringify(new_vehicle));
  chrome.storage.sync.set({selected: new_vehicle});

  for (var i = 0; i < fields.length; i++){
    fields[i].value = "";
    fields[i].placeholder = new_vehicle[info_strings[i]];
    if (info_strings[i] === "mpg"){
      fields[i].placeholder += " MPG"
    }
  }
  render();

}



function hideInfo(){
  new_car_form.style.display = "none";
  new_car_button.style.display = "block";
  document.querySelector(".vehicle_update").style.display = "none";

  document.querySelector("#make").placeholder = "Make";
  document.querySelector("#model").placeholder = "Model";
  document.querySelector("#mpg").placeholder = "MPG";
  document.querySelector("#make").value = "";
  document.querySelector("#model").value = "";
  document.querySelector("#mpg").value = "";
  document.querySelector("h4").innerText = "New vehicle info";


}

function showInfo(){
  console.log("selected:")
  console.log(cur_selected);
  


  document.querySelector("h4").innerText = "Vehicle Info";
  new_car_form.style.display = "block";
  new_car_button.style.display = "none";
  document.querySelector(".vehicle_submit").style.display = "none";
  document.querySelector(".vehicle_cancel").style.display = "none";
  document.querySelector(".vehicle_update").style.display = "block";
  const fields = document.querySelectorAll(".inp");
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

    cur_selected = selected;

    showInfo();

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

document.querySelector(".vehicle_update").addEventListener("click", (e) => {
  e.preventDefault();

  handleUpdate();

});



function allStorage() {

  var values = [],
      keys = Object.keys(localStorage),
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

