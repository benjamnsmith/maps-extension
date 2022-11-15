// OPTIONS.JS
// handle form submissions, data saving, data changing
// all data should be passed to background.js upon save
// utilize chrome storage so all scripts can access data

import { Vehicle } from "./vehicles"

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

  const new_vehicle = new Vehicle(fields[0].value, fields[1].value, fields[2].value, n);

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

  var new_vehicle = new Vehicle(
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

