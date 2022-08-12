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

  var new_vehicle = {
    make: ( fields[0].value ? fields[0].value : fields[0].placeholder ),
    model: ( fields[1].value ? fields[1].value : fields[1].placeholder ),
    mpg: ( fields[2].value ? fields[2].value : fields[2].placeholder.split(" ")[0] ),
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

  const vals = ["Make", "Model", "MPG"];

  for(var i = 0; i < fields.length; i++){
    fields[i].placeholder = vals[i];
    fields[i].value = ""
  }

  document.querySelector("h4").innerText = "New vehicle info";
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

function showHide(){
  // show
  if (new_car_form.style.display === "none"){
    new_car_form.style.display = "flex";
    new_car_button.style.display = "none";

    

    document.querySelector("#make").value = "";
    document.querySelector("#model").value = "";
    document.querySelector("#mpg").value = "";

    document.querySelector(".cancel_update").style.display = "none";
    document.querySelector(".vehicle_update").style.display = "none";
    document.querySelector(".vehicle_submit").style.display = "inline";
    document.querySelector(".vehicle_cancel").style.display = "inline";
  } else { // hide
    new_car_button.style.display = "inline";
    new_car_form.style.display = "none";

    document.querySelector(".cancel_update").style.display = "inline";
    document.querySelector(".vehicle_update").style.display = "inline";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXBzLWV4dGVuc2lvbi8uL3NyYy9vcHRpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE9QVElPTlMuSlNcbi8vIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb25zLCBkYXRhIHNhdmluZywgZGF0YSBjaGFuZ2luZ1xuLy8gYWxsIGRhdGEgc2hvdWxkIGJlIHBhc3NlZCB0byBiYWNrZ3JvdW5kLmpzIHVwb24gc2F2ZVxuLy8gdXRpbGl6ZSBjaHJvbWUgc3RvcmFnZSBzbyBhbGwgc2NyaXB0cyBjYW4gYWNjZXNzIGRhdGFcblxuLy8gTUVNT1JZIFNFVFRJTkcvR0VUVElORyAtIG1vdmUgdG8gbmV3IGZpbGVcbmZ1bmN0aW9uIG1lbVB1c2goaywgdikge1xuICBjb25zb2xlLmxvZyhgQWRkaW5nICR7a30gdG8gbWVtb3J5IGFzICR7dn1gKTtcbiAgaWYgKGRldikge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGssIHYpO1xuICB9IGVsc2Uge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgazogdiB9KTtcbiAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgU0VUICR7a30gJHt2fWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lbVB1bGwoaykge1xuICBpZiAoZGV2KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGspO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBRVUVSWUlORyAke2t9YCk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoaywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIEdPVDogJHtyZXN9YCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdMT0JBTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRE9NIGl0ZW1zXG5jb25zdCB2ZWhpY2xlX2l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52ZWhpY2xlX2l0ZW1cIik7XG5jb25zdCBuZXdfY2FyX2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3X2Nhcl9idXR0b25cIik7XG5jb25zdCBuZXdfY2FyX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfZm9ybVwiKTtcbmNvbnN0IG5hbWVfZW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG5jb25zdCB3ZWxjb21lX21lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1faGVhZGVyXCIpO1xudmFyIGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5wXCIpO1xuXG4vLyBTY3JpcHQgaXRlbXNcbnZhciBjdXJfc2VsZWN0ZWQgPSB7fTtcbmNvbnN0IGRldiA9IHRydWU7XG52YXIgY3VycmVudGx5X2F1dGhkID0gZmFsc2U7XG5jb25zdCBpbmZvX3N0cmluZ3MgPSBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJtcGdcIl07XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gUE9QVVAgV0lORE9XIEZVTkNUSU9OU1xuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAvLyBoaWRlIHZlaGljbGVzLCBzaG93IGFzIG5lZWRlZFxuICBmb3IgKGxldCB2ZWhpY2xlIG9mIHZlaGljbGVfaXRlbXMpIHtcbiAgICB2ZWhpY2xlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuICBjdXJyZW50bHlfYXV0aGQgPSBtZW1QdWxsKFwibG9naW5cIik7XG5cbiAgaWYgKGN1cnJlbnRseV9hdXRoZCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAvLyBwb3B1bGF0ZSB1c2VyIGRhdGFcbiAgICB2YXIgbmFtZSA9IG1lbVB1bGwoXCJuYW1lXCIpO1xuICAgIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gICAgaWYgKG4gIT09IDApIHtcbiAgICAgIHZhciBzZWxfbXBnID0gSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5tcGc7XG4gICAgfVxuICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIldlbGNvbWUgYmFjaywgXCIgKyBuYW1lICsgXCIhXCI7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IG5hbWU7XG4gICAgbmV3X2Nhcl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnNvbGUubG9nKGBUaGVyZSBhcmUgJHtufSBjYXIvcyBpbiBtZW1vcnlgKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bV92ZWhpY2xlc1wiKS5pbm5lclRleHQgPSBuO1xuICAgIHZhciB0bXA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xuICAgICAgdG1wID0gXCJ2XCIgKyBpO1xuICAgICAgY29uc3QgY3VyX3YgPSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSk7XG4gICAgICB2ZWhpY2xlX2l0ZW1zW2ldLmNoaWxkTm9kZXNbMl0uaW5uZXJUZXh0ID0gY3VyX3YubWFrZSArIFwiIFwiICsgY3VyX3YubW9kZWwgKyBcIiAoXCIgKyBjdXJfdi5tcGcgKyBcIiBNUEcpXCI7XG4gICAgICBpZiAoSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5pZCA9PT0gSlNPTi5wYXJzZShtZW1QdWxsKHRtcCkpLmlkKSB7XG4gICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiQWRkIHlvdXIgaW5mb1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IDA7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IFwiTmFtZVwiO1xuICAgIG5ld19jYXJfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIG1lbVB1c2goXCJudW1cIiwgMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblxuICBjb25zdCBuZXdfdmVoaWNsZSA9IHtcbiAgICBtYWtlOiBmaWVsZHNbMF0udmFsdWUsXG4gICAgbW9kZWw6IGZpZWxkc1sxXS52YWx1ZSxcbiAgICBtcGc6IGZpZWxkc1syXS52YWx1ZSxcbiAgfTtcblxuICB2YXIgbiA9IHBhcnNlSW50KG1lbVB1bGwoXCJudW1cIikpO1xuICBuZXdfdmVoaWNsZS5pZCA9IG47XG4gIHZhciB2X25hbWUgPSBcInZcIiArIG47XG4gIG1lbVB1c2godl9uYW1lLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuXG4gIGNvbnNvbGUubG9nKFwiU2VsZWN0aW5nIG5ld2VzdCB2ZWhpY2xlXCIpO1xuICBjdXJfc2VsZWN0ZWQgPSBuZXdfdmVoaWNsZTtcbiAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHNlbGVjdGVkOiBuZXdfdmVoaWNsZSB9KTtcbiAgbisrO1xuICBtZW1QdXNoKFwibnVtXCIsIG4pO1xuXG4gIHJlbmRlcigpO1xufVxuXG5cblxuZnVuY3Rpb24gaGFuZGxlVXBkYXRlKCl7XG4gIHZhciB2X2lkID0gY3VyX3NlbGVjdGVkLmlkO1xuXG4gIHZhciBuZXdfdmVoaWNsZSA9IHtcbiAgICBtYWtlOiAoIGZpZWxkc1swXS52YWx1ZSA/IGZpZWxkc1swXS52YWx1ZSA6IGZpZWxkc1swXS5wbGFjZWhvbGRlciApLFxuICAgIG1vZGVsOiAoIGZpZWxkc1sxXS52YWx1ZSA/IGZpZWxkc1sxXS52YWx1ZSA6IGZpZWxkc1sxXS5wbGFjZWhvbGRlciApLFxuICAgIG1wZzogKCBmaWVsZHNbMl0udmFsdWUgPyBmaWVsZHNbMl0udmFsdWUgOiBmaWVsZHNbMl0ucGxhY2Vob2xkZXIuc3BsaXQoXCIgXCIpWzBdICksXG4gIH07XG5cbiAgbmV3X3ZlaGljbGUuaWQgPSB2X2lkO1xuICBtZW1QdXNoKFwidlwiICsgdl9pZCwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7c2VsZWN0ZWQ6IG5ld192ZWhpY2xlfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspe1xuICAgIGZpZWxkc1tpXS52YWx1ZSA9IFwiXCI7XG4gICAgZmllbGRzW2ldLnBsYWNlaG9sZGVyID0gbmV3X3ZlaGljbGVbaW5mb19zdHJpbmdzW2ldXTtcbiAgICBpZiAoaW5mb19zdHJpbmdzW2ldID09PSBcIm1wZ1wiKXtcbiAgICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciArPSBcIiBNUEdcIlxuICAgIH1cbiAgfVxuICByZW5kZXIoKTtcblxufVxuXG5cblxuZnVuY3Rpb24gaGlkZUluZm8oKXtcblxuICBjb25zdCB2YWxzID0gW1wiTWFrZVwiLCBcIk1vZGVsXCIsIFwiTVBHXCJdO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspe1xuICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciA9IHZhbHNbaV07XG4gICAgZmllbGRzW2ldLnZhbHVlID0gXCJcIlxuICB9XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImg0XCIpLmlubmVyVGV4dCA9IFwiTmV3IHZlaGljbGUgaW5mb1wiO1xufVxuXG5mdW5jdGlvbiBzaG93SW5mbygpe1xuICBjb25zb2xlLmxvZyhcInNlbGVjdGVkOlwiKVxuICBjb25zb2xlLmxvZyhjdXJfc2VsZWN0ZWQpO1xuICBcblxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoNFwiKS5pbm5lclRleHQgPSBcIlZlaGljbGUgSW5mb1wiO1xuICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfY2FuY2VsXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKysgKSB7XG4gICAgZmllbGRzW2ldLnBsYWNlaG9sZGVyID0gY3VyX3NlbGVjdGVkW2luZm9fc3RyaW5nc1tpXV07XG4gICAgaWYgKGluZm9fc3RyaW5nc1tpXSA9PT0gXCJtcGdcIil7XG4gICAgICBmaWVsZHNbaV0ucGxhY2Vob2xkZXIgKz0gXCIgTVBHXCI7XG4gICAgfVxuICB9XG59XG5cblxuXG5cbmZ1bmN0aW9uIHZlaGljbGVDbGljayhlKSB7XG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0LmNsYXNzTmFtZSk7XG4gIGlmICghZS50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwidmVoaWNsZV9pdGVtXCIpKSB7XG4gICAgdmFyIHZfaWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmNsYXNzTmFtZS5zcGxpdChcIiBcIilbMV07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHZfaWQgPSBlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoXCIgXCIpWzFdO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWQgPSBKU09OLnBhcnNlKG1lbVB1bGwodl9pZCkpO1xuXG4gIGlmIChjdXJfc2VsZWN0ZWQuaWQgPT09IHNlbGVjdGVkLmlkKSB7XG4gICAgY29uc29sZS5sb2coXCJUaGlzIHZlaGljbGUgaXMgYWxyZWFkeSBzZWxlY3RlZFwiKTtcbiAgfSBlbHNlIHtcbiAgICBtZW1QdXNoKFwic2VsXCIsIEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkKSk7XG5cbiAgICBjb25zb2xlLmxvZyhgVGhlIG5ldyBNUEcgdXNlZCB3aWxsIGJlICR7c2VsZWN0ZWQubXBnfWApO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2VsZWN0ZWQ6IHNlbGVjdGVkIH0pO1xuICAgIGNvbnNvbGUubG9nKFwicHVzaGVkIHNlbGVjdGVkP1wiKTtcblxuICAgIGN1cl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuXG4gICAgc2hvd0luZm8oKTtcblxuICAgIHJlbmRlcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNob3dIaWRlKCl7XG4gIC8vIHNob3dcbiAgaWYgKG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIil7XG4gICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICBcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFrZVwiKS52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb2RlbFwiKS52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtcGdcIikudmFsdWUgPSBcIlwiO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfc3VibWl0XCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIH0gZWxzZSB7IC8vIGhpZGVcbiAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcbiAgICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYW5jZWxfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV91cGRhdGVcIikuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XG4gIH1cblxufVxuXG4vLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxucmVuZGVyKCk7XG5cbm5ld19jYXJfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHNob3dIaWRlKCk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3N1Ym1pdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBoYW5kbGVTdWJtaXQoZSk7XG4gIHNob3dIaWRlKCk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX2NhbmNlbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGhpZGVJbmZvKCk7XG4gIHNob3dIaWRlKClcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaGFuZGxlVXBkYXRlKCk7XG5cbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbF91cGRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBoaWRlSW5mbygpO1xuICBzaG93SGlkZSgpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9kZWxldGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIHdpbmRvdy5hbGVydChcImRlbGV0ZVwiKTtcbn0pOyBcblxuXG5mdW5jdGlvbiBhbGxTdG9yYWdlKCkge1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKSxcbiAgICAgIGkgPSBrZXlzLmxlbmd0aDtcblxuICB3aGlsZSAoIGktLSApIHtcbiAgICAgIGNvbnNvbGUubG9nKGtleXNbaV0sIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleXNbaV0pICk7XG4gIH1cblxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbV9kdW1wXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc29sZS5sb2coXCJMT0NBTCBTVE9SQUdFOlwiKTtcbiAgYWxsU3RvcmFnZSgpO1xuXG4gIGNvbnN0IHJldHJpZXZlZCA9IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCk7XG5cbiAgcmV0cmlldmVkLnRoZW4oIChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDSFJPTUU6XCIpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICB9KTtcblxufSk7XG5cbm5hbWVfZW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgIG1lbVB1c2goXCJuYW1lXCIsIG5hbWVfZW50cnkudmFsdWUpO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgdXNlcjogYCR7bmFtZV9lbnRyeS52YWx1ZX1gIH0pO1xuICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgcmVuZGVyKCk7XG4gIH1cbn0pO1xuXG5uYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4ge1xuICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgIGlmIChuYW1lX2VudHJ5LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgdXNlcjogYCR7bmFtZV9lbnRyeS52YWx1ZX1gIH0pO1xuICAgICAgbWVtUHVzaChcImxvZ2luXCIsIFwidHJ1ZVwiKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH1cbiAgfVxufSk7XG5cbnZhciBkb3VibGVfY2hlY2sgPSAwO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHN3aXRjaCAoZG91YmxlX2NoZWNrKSB7XG4gICAgY2FzZSAwOlxuICAgICAgY29uc29sZS5sb2coZG91YmxlX2NoZWNrKTtcbiAgICAgIGRvdWJsZV9jaGVjayA9IDE7XG4gICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9IFwiWWVzIEknbSBzdXJlXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikudGV4dENvbnRlbnQgPSBcIkNhbmNlbFwiO1xuICAgICAgY29uc29sZS5sb2coXCJ3YXJuaW5nIVwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnNvbGUubG9nKGRvdWJsZV9jaGVjayk7XG4gICAgICBkb3VibGVfY2hlY2sgPSAwO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2xlYXJlZFwiKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5jbGVhcigpO1xuICAgICAgbmFtZV9lbnRyeS52YWx1ZSA9IFwiXCI7XG4gICAgICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgbmV3X2Nhcl9idXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgcmVuZGVyKCk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgc3dpdGNoIChkb3VibGVfY2hlY2spIHtcbiAgICBjYXNlIDE6XG4gICAgICBkb3VibGVfY2hlY2sgPSAwO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpLnRleHRDb250ZW50ID0gXCJDbGVhciBkYXRhXCI7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9IFwiQ2xvc2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMDpcbiAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KTtcblxuZm9yIChsZXQgdmVoaWNsZSBvZiB2ZWhpY2xlX2l0ZW1zKSB7XG4gIHZlaGljbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB2ZWhpY2xlQ2xpY2soZSkpO1xufVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=