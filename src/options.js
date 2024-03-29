// OPTIONS.JS
// handle form submissions, data saving, data changing
// all data should be passed to background.js upon save
// utilize chrome storage so all scripts can access data

import { Vehicle } from "./vehicles";
import { Memory } from "./memory.js";


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


// Script items
var cur_selected = {};
const info_strings = ["make", "model", "mpg"];
const display_strings = ["Make", "Model", "MPG"];
const text_color = "#353839";
var controller = new Memory(false);
// =============================================

// POPUP WINDOW FUNCTIONS
function render() {
  // hide vehicles, show as needed
  for (let vehicle of vehicle_items) {
    vehicle.style.display = "none";
  }

  var login = controller.pull("login");

  var currently_authd = login ? login : false ;

  if (currently_authd) {
    // populate user data
    var name = controller.pull("name");
    var n = parseInt(controller.pull("num"));
    var price = controller.pull("price");

    welcome_message.innerText = "Welcome back, " + name + "!";
    name_entry.placeholder = name;
    gas_price.placeholder = price ? "$" + price + " per gallon": "Price per gallon";
    new_car_button.disabled = false;

    console.log(`There are ${n} car/s in memory`);
    document.querySelector("#num_vehicles").innerText = n;

    var tmp;
    for (var i = 0; i < n; i++) {
      vehicle_items[i].style.display = "grid";
      tmp = "v" + i;
      console.log(`pulling ${tmp}`);
      const cur_v = JSON.parse(controller.pull(tmp));
      vehicle_items[i].childNodes[2].innerText = cur_v.make + " " + cur_v.model + " (" + cur_v.mpg + " MPG)";
      if (JSON.parse(controller.pull("sel")).id === JSON.parse(controller.pull(tmp)).id) {
        vehicle_items[i].style.color = "red";
      } else {
        vehicle_items[i].style.color = text_color;
      }
    }

  } else {
    // show new user view
    welcome_message.innerText = "Add your info";
    document.querySelector("#num_vehicles").innerText = 0;
    name_entry.placeholder = "Name";
    new_car_button.disabled = true;

    controller.push("num", 0);
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

  var n = parseInt(controller.pull("num"));

  const new_vehicle = new Vehicle(fields[0].value, fields[1].value, fields[2].value, n);

  var v_name = "v" + n;
  controller.push(v_name, new_vehicle.string());

  console.log("Selecting newest vehicle");
  cur_selected = new_vehicle;
  controller.push("sel", new_vehicle.string());
  n++;
  controller.push("num", n);

  clearForm();

  render();
}


function deleteVehicle(event) {
  event.preventDefault();

  window.alert("delete");


}


function handleUpdate(){
  var v_id = cur_selected.id;

  var new_vehicle = new Vehicle(
    fields[0].value ? fields[0].value : fields[0].placeholder,
    fields[1].value ? fields[1].value : fields[1].placeholder,
    fields[2].value ? fields[2].value : fields[2].placeholder.split(" ")[0],
    v_id
  );

  controller.push("v" + v_id, new_vehicle.string());
  controller.push("sel", new_vehicle.string());
  controller.push(selected, new_vehicle);

  
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
  submit_vehicle.style.display = "none";
  vehicle_cancel.style.display = "none";
  update_button.style.display = "inline";
  cancel_update_button.style.display = "inline";
  document.querySelector(".vehicle_delete").style.display = "inline";


  for (var i = 0; i < fields.length; i++ ) {
    fields[i].value = "";
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

  const selected = JSON.parse(controller.pull(v_id));

  if (cur_selected.id === selected.id) {
    console.log("This vehicle is already selected");
  } else {
    controller.push("sel", JSON.stringify(selected));

    console.log(`The new MPG used will be ${selected.mpg}`);
    controller.push(selected, selected);
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

function allStorage() {

  var keys = Object.keys(localStorage),
      i = keys.length;

  while ( i-- ) {
      console.log(keys[i], localStorage.getItem(keys[i]) );
  }

}

// RUN UPON EXTENSION INIT
render();


// EVENT LISTENERS
// name entry submit handlers - enter key or blur
name_entry.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    if (name_entry.value !== "") {
      controller.push("name", name_entry.value);
      controller.push("login", "true");
      render();
    }
  }
});

name_entry.addEventListener("blur", (e) => {
  e.preventDefault();
  if (name_entry.value !== "") {
    controller.push("name", name_entry.value);
    controller.push("login", "true");
    render();
  }
});

// gas price submit handler - blur only, TODO : keypress
gas_price.addEventListener("blur", (e) => {
  e.preventDefault();
  if (gas_price.value !== "") {
    controller.push("price", gas_price.value);
    controller.push("price", `${gas_price.value}`);
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
  showHide()
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

  console.log("LOCAL STORAGE:");
  allStorage();

  const retrieved = chrome.storage.sync.get();

  retrieved.then( (data) => {
    console.log("CHROME:");
    console.log(data);
  });

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
      gas_price.placeholder = "Price per gallon"
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
