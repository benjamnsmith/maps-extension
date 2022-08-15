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

  clearForm();

  render();
}



function handleUpdate(){
  var v_id = cur_selected.id;

  var new_vehicle = {
    make: ( fields[0].value ? fields[0].value : fields[0].placeholder ),
    model: ( fields[1].value ? fields[1].value : fields[1].placeholder ),
    mpg: ( fields[2].value ? fields[2].value : fields[2].placeholder.split(" ")[0] ),
  };

  new_vehicle.id = v_id;
  memPush("v" + v_id, JSON.stringify(new_vehicle));
  memPush("sel", JSON.stringify(new_vehicle));
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
  new_car_form.style.display = "flex";
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


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXBzLWV4dGVuc2lvbi8uL3NyYy9vcHRpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE9QVElPTlMuSlNcbi8vIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb25zLCBkYXRhIHNhdmluZywgZGF0YSBjaGFuZ2luZ1xuLy8gYWxsIGRhdGEgc2hvdWxkIGJlIHBhc3NlZCB0byBiYWNrZ3JvdW5kLmpzIHVwb24gc2F2ZVxuLy8gdXRpbGl6ZSBjaHJvbWUgc3RvcmFnZSBzbyBhbGwgc2NyaXB0cyBjYW4gYWNjZXNzIGRhdGFcblxuLy8gTUVNT1JZIFNFVFRJTkcvR0VUVElORyAtIG1vdmUgdG8gbmV3IGZpbGVcbmZ1bmN0aW9uIG1lbVB1c2goaywgdikge1xuICBjb25zb2xlLmxvZyhgQWRkaW5nICR7a30gdG8gbWVtb3J5IGFzICR7dn1gKTtcbiAgaWYgKGRldikge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGssIHYpO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgazogdiB9KTtcbiAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgU0VUICR7a30gJHt2fWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lbVB1bGwoaykge1xuICBpZiAoZGV2KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGspO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBRVUVSWUlORyAke2t9YCk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoaywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIEdPVDogJHtyZXN9YCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdMT0JBTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRE9NIGl0ZW1zXG5jb25zdCB2ZWhpY2xlX2l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52ZWhpY2xlX2l0ZW1cIik7XG5jb25zdCBuZXdfY2FyX2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3X2Nhcl9idXR0b25cIik7XG5jb25zdCBuZXdfY2FyX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfZm9ybVwiKTtcbmNvbnN0IG5hbWVfZW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG5jb25zdCB3ZWxjb21lX21lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1faGVhZGVyXCIpO1xudmFyIGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5wXCIpO1xuXG4vLyBTY3JpcHQgaXRlbXNcbnZhciBjdXJfc2VsZWN0ZWQgPSB7fTtcbmNvbnN0IGRldiA9IHRydWU7XG52YXIgY3VycmVudGx5X2F1dGhkID0gZmFsc2U7XG5jb25zdCBpbmZvX3N0cmluZ3MgPSBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJtcGdcIl07XG5jb25zdCBkaXNwbGF5X3N0cmluZ3MgPSBbXCJNYWtlXCIsIFwiTW9kZWxcIiwgXCJNUEdcIl07XG5jb25zdCB0ZXh0X2NvbG9yID0gXCIjMzUzODM5XCI7XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gUE9QVVAgV0lORE9XIEZVTkNUSU9OU1xuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAvLyBoaWRlIHZlaGljbGVzLCBzaG93IGFzIG5lZWRlZFxuICBmb3IgKGxldCB2ZWhpY2xlIG9mIHZlaGljbGVfaXRlbXMpIHtcbiAgICB2ZWhpY2xlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuICBjdXJyZW50bHlfYXV0aGQgPSBtZW1QdWxsKFwibG9naW5cIik7XG5cbiAgaWYgKGN1cnJlbnRseV9hdXRoZCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAvLyBwb3B1bGF0ZSB1c2VyIGRhdGFcbiAgICB2YXIgbmFtZSA9IG1lbVB1bGwoXCJuYW1lXCIpO1xuICAgIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gICAgaWYgKG4gIT09IDApIHtcbiAgICAgIHZhciBzZWxfbXBnID0gSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5tcGc7XG4gICAgfVxuICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIldlbGNvbWUgYmFjaywgXCIgKyBuYW1lICsgXCIhXCI7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IG5hbWU7XG4gICAgbmV3X2Nhcl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnNvbGUubG9nKGBUaGVyZSBhcmUgJHtufSBjYXIvcyBpbiBtZW1vcnlgKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bV92ZWhpY2xlc1wiKS5pbm5lclRleHQgPSBuO1xuICAgIHZhciB0bXA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xuICAgICAgdG1wID0gXCJ2XCIgKyBpO1xuICAgICAgY29uc3QgY3VyX3YgPSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSk7XG4gICAgICB2ZWhpY2xlX2l0ZW1zW2ldLmNoaWxkTm9kZXNbMl0uaW5uZXJUZXh0ID0gY3VyX3YubWFrZSArIFwiIFwiICsgY3VyX3YubW9kZWwgKyBcIiAoXCIgKyBjdXJfdi5tcGcgKyBcIiBNUEcpXCI7XG4gICAgICBpZiAoSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5pZCA9PT0gSlNPTi5wYXJzZShtZW1QdWxsKHRtcCkpLmlkKSB7XG4gICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5jb2xvciA9IHRleHRfY29sb3I7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIkFkZCB5b3VyIGluZm9cIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bV92ZWhpY2xlc1wiKS5pbm5lclRleHQgPSAwO1xuICAgIG5hbWVfZW50cnkucGxhY2Vob2xkZXIgPSBcIk5hbWVcIjtcbiAgICBuZXdfY2FyX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBtZW1QdXNoKFwibnVtXCIsIDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyRm9ybSgpe1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKyl7XG4gICAgZmllbGRzW2ldLnZhbHVlID0gXCJcIjtcbiAgICBmaWVsZHNbaV0ucGxhY2Vob2xkZXIgPSBkaXNwbGF5X3N0cmluZ3NbaV07XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblxuICBjb25zdCBuZXdfdmVoaWNsZSA9IHtcbiAgICBtYWtlOiBmaWVsZHNbMF0udmFsdWUsXG4gICAgbW9kZWw6IGZpZWxkc1sxXS52YWx1ZSxcbiAgICBtcGc6IGZpZWxkc1syXS52YWx1ZSxcbiAgfTtcblxuXG5cbiAgdmFyIG4gPSBwYXJzZUludChtZW1QdWxsKFwibnVtXCIpKTtcbiAgbmV3X3ZlaGljbGUuaWQgPSBuO1xuICB2YXIgdl9uYW1lID0gXCJ2XCIgKyBuO1xuICBtZW1QdXNoKHZfbmFtZSwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcblxuICBjb25zb2xlLmxvZyhcIlNlbGVjdGluZyBuZXdlc3QgdmVoaWNsZVwiKTtcbiAgY3VyX3NlbGVjdGVkID0gbmV3X3ZlaGljbGU7XG4gIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzZWxlY3RlZDogbmV3X3ZlaGljbGUgfSk7XG4gIG4rKztcbiAgbWVtUHVzaChcIm51bVwiLCBuKTtcblxuICBjbGVhckZvcm0oKTtcblxuICByZW5kZXIoKTtcbn1cblxuXG5cbmZ1bmN0aW9uIGhhbmRsZVVwZGF0ZSgpe1xuICB2YXIgdl9pZCA9IGN1cl9zZWxlY3RlZC5pZDtcblxuICB2YXIgbmV3X3ZlaGljbGUgPSB7XG4gICAgbWFrZTogKCBmaWVsZHNbMF0udmFsdWUgPyBmaWVsZHNbMF0udmFsdWUgOiBmaWVsZHNbMF0ucGxhY2Vob2xkZXIgKSxcbiAgICBtb2RlbDogKCBmaWVsZHNbMV0udmFsdWUgPyBmaWVsZHNbMV0udmFsdWUgOiBmaWVsZHNbMV0ucGxhY2Vob2xkZXIgKSxcbiAgICBtcGc6ICggZmllbGRzWzJdLnZhbHVlID8gZmllbGRzWzJdLnZhbHVlIDogZmllbGRzWzJdLnBsYWNlaG9sZGVyLnNwbGl0KFwiIFwiKVswXSApLFxuICB9O1xuXG4gIG5ld192ZWhpY2xlLmlkID0gdl9pZDtcbiAgbWVtUHVzaChcInZcIiArIHZfaWQsIEpTT04uc3RyaW5naWZ5KG5ld192ZWhpY2xlKSk7XG4gIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe3NlbGVjdGVkOiBuZXdfdmVoaWNsZX0pO1xuXG4gIFxuICBjdXJfc2VsZWN0ZWQgPSBuZXdfdmVoaWNsZTtcbiAgaGlkZUluZm8oKTtcbiAgc2hvd0luZm8oKTtcbiAgcmVuZGVyKCk7XG5cbn1cblxuXG5cbmZ1bmN0aW9uIGhpZGVJbmZvKCl7XG5cbiAgY2xlYXJGb3JtKCk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImg0XCIpLmlubmVyVGV4dCA9IFwiTmV3IHZlaGljbGUgaW5mb1wiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfZGVsZXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuZnVuY3Rpb24gc2hvd0luZm8oKXtcbiAgY29uc29sZS5sb2coXCJzZWxlY3RlZDpcIilcbiAgY29uc29sZS5sb2coY3VyX3NlbGVjdGVkKTtcbiAgXG5cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDRcIikuaW5uZXJUZXh0ID0gXCJWZWhpY2xlIEluZm9cIjtcbiAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgbmV3X2Nhcl9idXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfc3VibWl0XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX2NhbmNlbFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV91cGRhdGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX2RlbGV0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrICkge1xuICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciA9IGN1cl9zZWxlY3RlZFtpbmZvX3N0cmluZ3NbaV1dO1xuICAgIGlmIChpbmZvX3N0cmluZ3NbaV0gPT09IFwibXBnXCIpe1xuICAgICAgZmllbGRzW2ldLnBsYWNlaG9sZGVyICs9IFwiIE1QR1wiO1xuICAgIH1cbiAgfVxuXG59XG5cblxuXG5cbmZ1bmN0aW9uIHZlaGljbGVDbGljayhlKSB7XG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0LmNsYXNzTmFtZSk7XG4gIGlmICghZS50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwidmVoaWNsZV9pdGVtXCIpKSB7XG4gICAgdmFyIHZfaWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTmFtZS5zcGxpdChcIiBcIilbMV07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHZfaWQgPSBlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpWzFdO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWQgPSBKU09OLnBhcnNlKG1lbVB1bGwodl9pZCkpO1xuXG4gIGlmIChjdXJfc2VsZWN0ZWQuaWQgPT09IHNlbGVjdGVkLmlkKSB7XG4gICAgY29uc29sZS5sb2coXCJUaGlzIHZlaGljbGUgaXMgYWxyZWFkeSBzZWxlY3RlZFwiKTtcbiAgfSBlbHNlIHtcbiAgICBtZW1QdXNoKFwic2VsXCIsIEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkKSk7XG5cbiAgICBjb25zb2xlLmxvZyhgVGhlIG5ldyBNUEcgdXNlZCB3aWxsIGJlICR7c2VsZWN0ZWQubXBnfWApO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2VsZWN0ZWQ6IHNlbGVjdGVkIH0pO1xuICAgIGNvbnNvbGUubG9nKFwicHVzaGVkIHNlbGVjdGVkP1wiKTtcbiAgfVxuXG4gICAgY3VyX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBzaG93SW5mbygpO1xuXG4gICAgcmVuZGVyKCk7XG59XG5cbmZ1bmN0aW9uIHNob3dIaWRlKCl7XG4gIGlmIChuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIil7XG4gICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuXG4gIGlmIChuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCIpe1xuICAgIGNvbnNvbGUubG9nKFwiSGVyZVwiKVxuICAgIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbF91cGRhdGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgfSBlbHNlIHtcbiAgICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFrZVwiKS52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb2RlbFwiKS52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtcGdcIikudmFsdWUgPSBcIlwiO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfc3VibWl0XCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIH1cbiBcbn1cblxuLy8gUlVOIFVQT04gRVhURU5TSU9OIElOSVRcbnJlbmRlcigpO1xuXG5uZXdfY2FyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzaG93SGlkZSgpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaGFuZGxlU3VibWl0KGUpO1xuICBzaG93SGlkZSgpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBoaWRlSW5mbygpO1xuICBzaG93SGlkZSgpXG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3VwZGF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGhhbmRsZVVwZGF0ZSgpO1xuXG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaGlkZUluZm8oKTtcbiAgc2hvd0hpZGUoKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfZGVsZXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICB3aW5kb3cuYWxlcnQoXCJkZWxldGVcIik7XG59KTsgXG5cblxuZnVuY3Rpb24gYWxsU3RvcmFnZSgpIHtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSksXG4gICAgICBpID0ga2V5cy5sZW5ndGg7XG5cbiAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICBjb25zb2xlLmxvZyhrZXlzW2ldLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXlzW2ldKSApO1xuICB9XG5cbn1cblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1fZHVtcFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGNvbnNvbGUubG9nKFwiTE9DQUwgU1RPUkFHRTpcIik7XG4gIGFsbFN0b3JhZ2UoKTtcblxuICBjb25zdCByZXRyaWV2ZWQgPSBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgpO1xuXG4gIHJldHJpZXZlZC50aGVuKCAoZGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiQ0hST01FOlwiKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSk7XG5cbn0pO1xuXG5uYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaWYgKG5hbWVfZW50cnkudmFsdWUgIT09IFwiXCIpIHtcbiAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHVzZXI6IGAke25hbWVfZW50cnkudmFsdWV9YCB9KTtcbiAgICBtZW1QdXNoKFwibG9naW5cIiwgXCJ0cnVlXCIpO1xuICAgIHJlbmRlcigpO1xuICB9XG59KTtcblxubmFtZV9lbnRyeS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHtcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgbWVtUHVzaChcIm5hbWVcIiwgbmFtZV9lbnRyeS52YWx1ZSk7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHVzZXI6IGAke25hbWVfZW50cnkudmFsdWV9YCB9KTtcbiAgICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgICByZW5kZXIoKTtcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgZG91YmxlX2NoZWNrID0gMDtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2ggKGRvdWJsZV9jaGVjaykge1xuICAgIGNhc2UgMDpcbiAgICAgIGNvbnNvbGUubG9nKGRvdWJsZV9jaGVjayk7XG4gICAgICBkb3VibGVfY2hlY2sgPSAxO1xuICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIlllcyBJJ20gc3VyZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpLnRleHRDb250ZW50ID0gXCJDYW5jZWxcIjtcbiAgICAgIGNvbnNvbGUubG9nKFwid2FybmluZyFcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBjb25zb2xlLmxvZyhkb3VibGVfY2hlY2spO1xuICAgICAgZG91YmxlX2NoZWNrID0gMDtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbGVhciBkYXRhXCI7XG4gICAgICBjb25zb2xlLmxvZyhcIkNsZWFyZWRcIik7XG4gICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuY2xlYXIoKTtcbiAgICAgIG5hbWVfZW50cnkudmFsdWUgPSBcIlwiO1xuICAgICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICAgIHJlbmRlcigpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHN3aXRjaCAoZG91YmxlX2NoZWNrKSB7XG4gICAgY2FzZSAxOlxuICAgICAgZG91YmxlX2NoZWNrID0gMDtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS50ZXh0Q29udGVudCA9IFwiQ2xlYXIgZGF0YVwiO1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIkNsb3NlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDA6XG4gICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSk7XG5cbmZvciAobGV0IHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICB2ZWhpY2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdmVoaWNsZUNsaWNrKGUpKTtcbn1cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9