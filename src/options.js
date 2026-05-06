// OPTIONS.JS
// handle form submissions, data saving, data changing
// all data should be passed to background.js upon save
// utilize chrome storage so all scripts can access data

import { Vehicle } from "./vehicles";

// =============================================
// GLOBALS =====================================
// DOM items
const vehicle_items = document.querySelectorAll(".vehicle_item");
const new_car_button = document.querySelector(".new_car_button");
const new_car_form = document.querySelector(".new_car_form");
const name_entry = document.querySelector("#name");
const welcome_message = document.querySelector("#form_header");
var fields = document.querySelectorAll(".inp");
const update_button = document.querySelector(".vehicle_update");
const cancel_update_button = document.querySelector(".cancel_update");
const submit_vehicle = document.querySelector(".vehicle_submit");
const vehicle_cancel = document.querySelector(".vehicle_cancel");
const gas_price = document.querySelector("#gas_price");

// Local state (mirrors Chrome storage, updated on write, loaded on init)
var state = {
  name: null,
  price: null,
  num: 0,
  sel: null,
  vehicles: []
};

var cur_selected = {};
const info_strings = ["make", "model", "mpg"];
const display_strings = ["Make", "Model", "MPG"];
const text_color = "#353839";
// =============================================


// Load all state from Chrome storage, then render
function init() {
  chrome.storage.sync.get(null).then((data) => {
    state.name = data.name || null;
    state.price = data.price || null;
    state.num = parseInt(data.num) || 0;
    state.sel = data.sel ? JSON.parse(data.sel) : null;

    state.vehicles = [];
    for (let i = 0; i < state.num; i++) {
      if (data["v" + i]) {
        state.vehicles[i] = JSON.parse(data["v" + i]);
      }
    }

    if (state.sel) {
      cur_selected = state.sel;
    }

    render();
  });
}


// POPUP WINDOW FUNCTIONS
function render() {
  for (let vehicle of vehicle_items) {
    vehicle.style.display = "none";
  }

  if (state.name && state.price) {
    welcome_message.innerText = "Welcome back, " + state.name + "!";
    name_entry.placeholder = state.name;
    gas_price.placeholder = "$" + state.price + " per gallon";
    new_car_button.disabled = false;

    console.log(`There are ${state.num} car/s in memory`);
    document.querySelector("#num_vehicles").innerText = state.num;

    for (var i = 0; i < state.num; i++) {
      vehicle_items[i].style.display = "grid";
      const v = state.vehicles[i];
      vehicle_items[i].childNodes[2].innerText = v.make + " " + v.model + " (" + v.mpg + " MPG)";
      if (state.sel && state.sel.id === v.id) {
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
    chrome.storage.sync.set({ num: 0 });
  }
}

function clearForm() {
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
    fields[i].placeholder = display_strings[i];
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const new_vehicle = new Vehicle(fields[0].value, fields[1].value, fields[2].value, state.num);
  const key = "v" + state.num;

  chrome.storage.sync.set({ [key]: JSON.stringify(new_vehicle) });
  chrome.storage.sync.set({ sel: JSON.stringify(new_vehicle) });

  state.vehicles[state.num] = new_vehicle;
  state.num++;
  state.sel = new_vehicle;
  cur_selected = new_vehicle;

  chrome.storage.sync.set({ num: state.num });

  clearForm();
  render();
}


function deleteVehicle(event) {
  event.preventDefault();

  const del_id = cur_selected.id;

  // Remove from local array and compact
  state.vehicles.splice(del_id, 1);
  state.num--;

  // Rebuild vehicle keys with updated ids
  const updates = { num: state.num };
  for (let i = 0; i < state.vehicles.length; i++) {
    state.vehicles[i].id = i;
    updates["v" + i] = JSON.stringify(state.vehicles[i]);
  }
  // Remove the now-extra last key
  chrome.storage.sync.remove("v" + state.num);

  // Update selected vehicle
  if (state.sel && state.sel.id === del_id) {
    if (state.vehicles.length > 0) {
      state.sel = state.vehicles[0];
      cur_selected = state.sel;
      updates.sel = JSON.stringify(state.sel);
    } else {
      state.sel = null;
      cur_selected = {};
      chrome.storage.sync.remove("sel");
    }
  }

  chrome.storage.sync.set(updates);

  hideInfo();
  render();
}


function handleUpdate() {
  var v_id = cur_selected.id;

  var new_vehicle = new Vehicle(
    fields[0].value ? fields[0].value : fields[0].placeholder,
    fields[1].value ? fields[1].value : fields[1].placeholder,
    fields[2].value ? fields[2].value : fields[2].placeholder.split(" ")[0],
    v_id
  );

  const key = "v" + v_id;
  chrome.storage.sync.set({ [key]: JSON.stringify(new_vehicle) });
  chrome.storage.sync.set({ sel: JSON.stringify(new_vehicle) });

  state.vehicles[v_id] = new_vehicle;
  state.sel = new_vehicle;
  cur_selected = new_vehicle;

  hideInfo();
  showInfo();
  render();
}


function hideInfo() {
  clearForm();
  document.querySelector("h4").innerText = "New vehicle info";
  document.querySelector(".vehicle_delete").style.display = "none";
}

function showInfo() {
  console.log("selected:", cur_selected);

  document.querySelector("h4").innerText = "Vehicle Info";
  new_car_form.style.display = "grid";
  new_car_button.style.display = "none";
  submit_vehicle.style.display = "none";
  vehicle_cancel.style.display = "none";
  update_button.style.display = "inline";
  cancel_update_button.style.display = "inline";
  document.querySelector(".vehicle_delete").style.display = "inline";

  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
    fields[i].placeholder = cur_selected[info_strings[i]];
    if (info_strings[i] === "mpg") {
      fields[i].placeholder += " MPG";
    }
  }
}


function vehicleClick(e) {
  var v_id;
  if (!e.target.className.includes("vehicle_item")) {
    v_id = e.target.parentNode.className.split(" ")[1];
  } else {
    v_id = e.target.className.split(" ")[1];
  }

  const idx = parseInt(v_id.replace("v", ""));
  const selected = state.vehicles[idx];

  if (cur_selected.id !== selected.id) {
    chrome.storage.sync.set({ sel: JSON.stringify(selected) });
    state.sel = selected;
    console.log(`The new MPG used will be ${selected.mpg}`);
  }

  cur_selected = selected;
  showInfo();
  render();
}

function showHide() {
  if (new_car_form.style.display === "") {
    new_car_form.style.display = "none";
  }

  if (new_car_form.style.display !== "none") {
    new_car_button.style.display = "inline";
    new_car_form.style.display = "none";
    cancel_update_button.style.display = "inline";
    update_button.style.display = "inline";
  } else {
    new_car_form.style.display = "flex";
    new_car_button.style.display = "none";
    document.querySelector("#make").value = "";
    document.querySelector("#model").value = "";
    document.querySelector("#mpg").value = "";
    cancel_update_button.style.display = "none";
    update_button.style.display = "none";
    submit_vehicle.style.display = "inline";
    vehicle_cancel.style.display = "inline";
  }
}


// RUN UPON EXTENSION INIT
init();


// EVENT LISTENERS
// name entry submit handlers - enter key or blur
name_entry.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && name_entry.value !== "") {
    chrome.storage.sync.set({ name: name_entry.value });
    state.name = name_entry.value;
    render();
  }
});

name_entry.addEventListener("blur", (e) => {
  e.preventDefault();
  if (name_entry.value !== "") {
    chrome.storage.sync.set({ name: name_entry.value });
    state.name = name_entry.value;
    render();
  }
});

// gas price submit handlers - enter key or blur
gas_price.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 && gas_price.value !== "") {
    chrome.storage.sync.set({ price: gas_price.value });
    state.price = gas_price.value;
    gas_price.value = "";
    render();
  }
});

gas_price.addEventListener("blur", (e) => {
  e.preventDefault();
  if (gas_price.value !== "") {
    chrome.storage.sync.set({ price: gas_price.value });
    state.price = gas_price.value;
    gas_price.value = "";
    render();
  }
});

// add vehicle button
new_car_button.addEventListener("click", (e) => {
  e.preventDefault();
  showHide();
});

// submit new vehicle button
submit_vehicle.addEventListener("click", (e) => {
  e.preventDefault();
  handleSubmit(e);
  showHide();
});

// cancel vehicle add button
vehicle_cancel.addEventListener("click", (e) => {
  e.preventDefault();
  hideInfo();
  showHide();
});

update_button.addEventListener("click", (e) => {
  e.preventDefault();
  handleUpdate();
});

cancel_update_button.addEventListener("click", (e) => {
  e.preventDefault();
  hideInfo();
  showHide();
});

document.querySelector(".vehicle_delete").addEventListener("click", (e) => {
  deleteVehicle(e);
});

document.querySelector(".mem_dump").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.storage.sync.get(null).then((data) => {
    console.log("CHROME STORAGE:", data);
  });
});


var double_check = 0;

document.querySelector(".clear").addEventListener("click", (e) => {
  e.preventDefault();
  switch (double_check) {
    case 0:
      double_check = 1;
      e.target.style.color = "red";
      e.target.textContent = "Yes I'm sure";
      document.querySelector(".warning").style.display = "block";
      document.querySelector(".close").textContent = "Cancel";
      break;
    case 1:
      double_check = 0;
      document.querySelector(".warning").style.display = "none";
      e.target.style.color = "black";
      e.target.textContent = "Clear data";
      chrome.storage.sync.clear();
      state = { name: null, price: null, num: 0, sel: null, vehicles: [] };
      cur_selected = {};
      name_entry.value = "";
      gas_price.placeholder = "Price per gallon";
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
