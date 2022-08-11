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


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL29wdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gT1BUSU9OUy5KU1xuLy8gaGFuZGxlIGZvcm0gc3VibWlzc2lvbnMsIGRhdGEgc2F2aW5nLCBkYXRhIGNoYW5naW5nXG4vLyBhbGwgZGF0YSBzaG91bGQgYmUgcGFzc2VkIHRvIGJhY2tncm91bmQuanMgdXBvbiBzYXZlXG4vLyB1dGlsaXplIGNocm9tZSBzdG9yYWdlIHNvIGFsbCBzY3JpcHRzIGNhbiBhY2Nlc3MgZGF0YVxuXG4vLyBNRU1PUlkgU0VUVElORy9HRVRUSU5HIC0gbW92ZSB0byBuZXcgZmlsZVxuZnVuY3Rpb24gbWVtUHVzaChrLCB2KSB7XG4gIGNvbnNvbGUubG9nKGBBZGRpbmcgJHtrfSB0byBtZW1vcnkgYXMgJHt2fWApO1xuICBpZiAoZGV2KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaywgdik7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBrOiB2IH0pO1xuICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBTRVQgJHtrfSAke3Z9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWVtUHVsbChrKSB7XG4gIGlmIChkZXYpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oayk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIFFVRVJZSU5HICR7a31gKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChrLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgR09UOiAke3Jlc31gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHTE9CQUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERPTSBpdGVtc1xuY29uc3QgdmVoaWNsZV9pdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudmVoaWNsZV9pdGVtXCIpO1xuY29uc3QgbmV3X2Nhcl9idXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfYnV0dG9uXCIpO1xuY29uc3QgbmV3X2Nhcl9mb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXdfY2FyX2Zvcm1cIik7XG5jb25zdCBuYW1lX2VudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuYW1lXCIpO1xuY29uc3Qgd2VsY29tZV9tZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb3JtX2hlYWRlclwiKTtcblxuLy8gU2NyaXB0IGl0ZW1zXG52YXIgY3VyX3NlbGVjdGVkID0ge307XG5jb25zdCBkZXYgPSB0cnVlO1xudmFyIGN1cnJlbnRseV9hdXRoZCA9IGZhbHNlO1xuY29uc3QgaW5mb19zdHJpbmdzID0gW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwibXBnXCJdO1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIFBPUFVQIFdJTkRPVyBGVU5DVElPTlNcbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgLy8gaGlkZSB2ZWhpY2xlcywgc2hvdyBhcyBuZWVkZWRcbiAgZm9yICh2ZWhpY2xlIG9mIHZlaGljbGVfaXRlbXMpIHtcbiAgICB2ZWhpY2xlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuICBjdXJyZW50bHlfYXV0aGQgPSBtZW1QdWxsKFwibG9naW5cIik7XG5cbiAgaWYgKGN1cnJlbnRseV9hdXRoZCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAvLyBwb3B1bGF0ZSB1c2VyIGRhdGFcbiAgICB2YXIgbmFtZSA9IG1lbVB1bGwoXCJuYW1lXCIpO1xuICAgIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gICAgaWYgKG4gIT09IDApIHtcbiAgICAgIHZhciBzZWxfbXBnID0gSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5tcGc7XG4gICAgfVxuICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIldlbGNvbWUgYmFjaywgXCIgKyBuYW1lICsgXCIhXCI7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IG5hbWU7XG4gICAgbmV3X2Nhcl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnNvbGUubG9nKGBUaGVyZSBhcmUgJHtufSBjYXIvcyBpbiBtZW1vcnlgKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bV92ZWhpY2xlc1wiKS5pbm5lclRleHQgPSBuO1xuICAgIHZhciB0bXA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xuICAgICAgdG1wID0gXCJ2XCIgKyBpO1xuICAgICAgY29uc3QgY3VyX3YgPSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSk7XG4gICAgICB2ZWhpY2xlX2l0ZW1zW2ldLmNoaWxkTm9kZXNbMl0uaW5uZXJUZXh0ID0gY3VyX3YubWFrZSArIFwiIFwiICsgY3VyX3YubW9kZWwgKyBcIiAoXCIgKyBjdXJfdi5tcGcgKyBcIiBNUEcpXCI7XG4gICAgICBpZiAoSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5pZCA9PT0gSlNPTi5wYXJzZShtZW1QdWxsKHRtcCkpLmlkKSB7XG4gICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2VsY29tZV9tZXNzYWdlLmlubmVyVGV4dCA9IFwiQWRkIHlvdXIgaW5mb1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IDA7XG4gICAgbmFtZV9lbnRyeS5wbGFjZWhvbGRlciA9IFwiTmFtZVwiO1xuICAgIG5ld19jYXJfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIG1lbVB1c2goXCJudW1cIiwgMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc3QgZmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnBcIik7XG5cbiAgY29uc3QgbmV3X3ZlaGljbGUgPSB7XG4gICAgbWFrZTogZmllbGRzWzBdLnZhbHVlLFxuICAgIG1vZGVsOiBmaWVsZHNbMV0udmFsdWUsXG4gICAgbXBnOiBmaWVsZHNbMl0udmFsdWUsXG4gIH07XG5cbiAgdmFyIG4gPSBwYXJzZUludChtZW1QdWxsKFwibnVtXCIpKTtcbiAgbmV3X3ZlaGljbGUuaWQgPSBuO1xuICB2YXIgdl9uYW1lID0gXCJ2XCIgKyBuO1xuICBtZW1QdXNoKHZfbmFtZSwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcblxuICBjb25zb2xlLmxvZyhcIlNlbGVjdGluZyBuZXdlc3QgdmVoaWNsZVwiKTtcbiAgY3VyX3NlbGVjdGVkID0gbmV3X3ZlaGljbGU7XG4gIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzZWxlY3RlZDogbmV3X3ZlaGljbGUgfSk7XG4gIG4rKztcbiAgbWVtUHVzaChcIm51bVwiLCBuKTtcblxuICByZW5kZXIoKTtcbn1cblxuXG5cbmZ1bmN0aW9uIGhhbmRsZVVwZGF0ZSgpe1xuICB2YXIgdl9pZCA9IGN1cl9zZWxlY3RlZC5pZDtcblxuICBjb25zdCBmaWVsZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmlucFwiKTtcbiAgY29uc29sZS5sb2coZmllbGRzKTtcblxuICB2YXIgbmV3X3ZlaGljbGUgPSB7XG4gICAgbWFrZTogKCBmaWVsZHNbMF0udmFsdWUgPyBmaWVsZHNbMF0udmFsdWUgOiBmaWVsZHNbMF0ucGxhY2Vob2xkZXIgKSxcbiAgICBtb2RlbDogKCBmaWVsZHNbMV0udmFsdWUgPyBmaWVsZHNbMV0udmFsdWUgOiBmaWVsZHNbMV0ucGxhY2Vob2xkZXIgKSxcbiAgICBtcGc6ICggZmllbGRzWzJdLnZhbHVlID8gZmllbGRzWzJdLnZhbHVlIDogZmllbGRzWzJdLnBsYWNlaG9sZGVyICksXG4gIH07XG5cbiAgbmV3X3ZlaGljbGUuaWQgPSB2X2lkO1xuICBtZW1QdXNoKFwidlwiICsgdl9pZCwgSlNPTi5zdHJpbmdpZnkobmV3X3ZlaGljbGUpKTtcbiAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7c2VsZWN0ZWQ6IG5ld192ZWhpY2xlfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspe1xuICAgIGZpZWxkc1tpXS52YWx1ZSA9IFwiXCI7XG4gICAgZmllbGRzW2ldLnBsYWNlaG9sZGVyID0gbmV3X3ZlaGljbGVbaW5mb19zdHJpbmdzW2ldXTtcbiAgICBpZiAoaW5mb19zdHJpbmdzW2ldID09PSBcIm1wZ1wiKXtcbiAgICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciArPSBcIiBNUEdcIlxuICAgIH1cbiAgfVxuICByZW5kZXIoKTtcblxufVxuXG5cblxuZnVuY3Rpb24gaGlkZUluZm8oKXtcbiAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgbmV3X2Nhcl9idXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3VwZGF0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWtlXCIpLnBsYWNlaG9sZGVyID0gXCJNYWtlXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikucGxhY2Vob2xkZXIgPSBcIk1vZGVsXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpLnBsYWNlaG9sZGVyID0gXCJNUEdcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWtlXCIpLnZhbHVlID0gXCJcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb2RlbFwiKS52YWx1ZSA9IFwiXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpLnZhbHVlID0gXCJcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImg0XCIpLmlubmVyVGV4dCA9IFwiTmV3IHZlaGljbGUgaW5mb1wiO1xuXG5cbn1cblxuZnVuY3Rpb24gc2hvd0luZm8oKXtcbiAgY29uc29sZS5sb2coXCJzZWxlY3RlZDpcIilcbiAgY29uc29sZS5sb2coY3VyX3NlbGVjdGVkKTtcbiAgXG5cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDRcIikuaW5uZXJUZXh0ID0gXCJWZWhpY2xlIEluZm9cIjtcbiAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52ZWhpY2xlX3N1Ym1pdFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGNvbnN0IGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5wXCIpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKyApIHtcbiAgICBmaWVsZHNbaV0ucGxhY2Vob2xkZXIgPSBjdXJfc2VsZWN0ZWRbaW5mb19zdHJpbmdzW2ldXTtcbiAgICBpZiAoaW5mb19zdHJpbmdzW2ldID09PSBcIm1wZ1wiKXtcbiAgICAgIGZpZWxkc1tpXS5wbGFjZWhvbGRlciArPSBcIiBNUEdcIjtcbiAgICB9XG4gIH1cbn1cblxuXG5cblxuZnVuY3Rpb24gdmVoaWNsZUNsaWNrKGUpIHtcbiAgY29uc29sZS5sb2coZS50YXJnZXQuY2xhc3NOYW1lKTtcbiAgaWYgKCFlLnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoXCJ2ZWhpY2xlX2l0ZW1cIikpIHtcbiAgICB2YXIgdl9pZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKVsxXTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdl9pZCA9IGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdChcIiBcIilbMV07XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZCA9IEpTT04ucGFyc2UobWVtUHVsbCh2X2lkKSk7XG5cbiAgaWYgKGN1cl9zZWxlY3RlZC5pZCA9PT0gc2VsZWN0ZWQuaWQpIHtcbiAgICBjb25zb2xlLmxvZyhcIlRoaXMgdmVoaWNsZSBpcyBhbHJlYWR5IHNlbGVjdGVkXCIpO1xuICB9IGVsc2Uge1xuICAgIG1lbVB1c2goXCJzZWxcIiwgSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWQpKTtcblxuICAgIGNvbnNvbGUubG9nKGBUaGUgbmV3IE1QRyB1c2VkIHdpbGwgYmUgJHtzZWxlY3RlZC5tcGd9YCk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzZWxlY3RlZDogc2VsZWN0ZWQgfSk7XG4gICAgY29uc29sZS5sb2coXCJwdXNoZWQgc2VsZWN0ZWQ/XCIpO1xuXG4gICAgY3VyX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBzaG93SW5mbygpO1xuXG4gICAgcmVuZGVyKCk7XG4gIH1cbn1cblxuLy8gTElTVEVOIEZPUiBVUERBVEVTIEZST00gQkFDS0dST1VORC5KUyBBTkQgVVBEQVRFIEFDQ09SRElOR0xZXG4vLyBnb2luZyB0byBlbmQgbXkgbGlmZSBJIGNhbid0IGJlbGlldmUgSSBqdXN0IHVzZWQgYSBjbG9zdXJlIGluIHRoZSB3aWxkXG5mdW5jdGlvbiBnZW5lcmF0ZVRvZ2dsZXIoKSB7XG4gIHZhciB0ID0gMDtcbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgIHN3aXRjaCAodCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB0ID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFrZVwiKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21wZ1wiKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIG5ld19jYXJfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHQgPSAwO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvZ2dsZTtcbn1cblxuY29uc3QgdG9nX2Z1bmMgPSBnZW5lcmF0ZVRvZ2dsZXIoKTtcblxuLy8gUlVOIFVQT04gRVhURU5TSU9OIElOSVRcbnJlbmRlcigpO1xuXG5uZXdfY2FyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB0b2dfZnVuYygpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaGFuZGxlU3VibWl0KGUpO1xuICB0b2dfZnVuYygpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgdG9nX2Z1bmMoKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlaGljbGVfdXBkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaGFuZGxlVXBkYXRlKCk7XG5cbn0pO1xuXG5cblxuZnVuY3Rpb24gYWxsU3RvcmFnZSgpIHtcblxuICB2YXIgdmFsdWVzID0gW10sXG4gICAgICBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKSxcbiAgICAgIGkgPSBrZXlzLmxlbmd0aDtcblxuICB3aGlsZSAoIGktLSApIHtcbiAgICAgIGNvbnNvbGUubG9nKGtleXNbaV0sIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleXNbaV0pICk7XG4gIH1cblxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbV9kdW1wXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgY29uc29sZS5sb2coXCJMT0NBTCBTVE9SQUdFOlwiKTtcbiAgYWxsU3RvcmFnZSgpO1xuXG4gIGNvbnN0IHJldHJpZXZlZCA9IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCk7XG5cbiAgcmV0cmlldmVkLnRoZW4oIChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJDSFJPTUU6XCIpO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICB9KTtcblxufSk7XG5cbm5hbWVfZW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgIG1lbVB1c2goXCJuYW1lXCIsIG5hbWVfZW50cnkudmFsdWUpO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgdXNlcjogYCR7bmFtZV9lbnRyeS52YWx1ZX1gIH0pO1xuICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgcmVuZGVyKCk7XG4gIH1cbn0pO1xuXG5uYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4ge1xuICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgIGlmIChuYW1lX2VudHJ5LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgdXNlcjogYCR7bmFtZV9lbnRyeS52YWx1ZX1gIH0pO1xuICAgICAgbWVtUHVzaChcImxvZ2luXCIsIFwidHJ1ZVwiKTtcbiAgICAgIHJlbmRlcigpO1xuICAgIH1cbiAgfVxufSk7XG5cbnZhciBkb3VibGVfY2hlY2sgPSAwO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsZWFyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHN3aXRjaCAoZG91YmxlX2NoZWNrKSB7XG4gICAgY2FzZSAwOlxuICAgICAgY29uc29sZS5sb2coZG91YmxlX2NoZWNrKTtcbiAgICAgIGRvdWJsZV9jaGVjayA9IDE7XG4gICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9IFwiWWVzIEknbSBzdXJlXCI7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikudGV4dENvbnRlbnQgPSBcIkNhbmNlbFwiO1xuICAgICAgY29uc29sZS5sb2coXCJ3YXJuaW5nIVwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIGNvbnNvbGUubG9nKGRvdWJsZV9jaGVjayk7XG4gICAgICBkb3VibGVfY2hlY2sgPSAwO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2xlYXJlZFwiKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5jbGVhcigpO1xuICAgICAgbmFtZV9lbnRyeS52YWx1ZSA9IFwiXCI7XG4gICAgICBuZXdfY2FyX2Zvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICByZW5kZXIoKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2ggKGRvdWJsZV9jaGVjaykge1xuICAgIGNhc2UgMTpcbiAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbG9zZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAwOlxuICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuXG5mb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICB2ZWhpY2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdmVoaWNsZUNsaWNrKGUpKTtcbn1cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9