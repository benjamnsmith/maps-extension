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
      chrome.storage.sync.get(k, function(res) {
        console.log(`CHROME STORAGE GOT: ${res}`);
      return res;
    })
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
      if (n !== 0){
        var sel_mpg = JSON.parse(memPull("sel")).mpg;
      }
      welcome_message.innerText = "Welcome back, " + name + "! (" +sel_mpg+")";
      name_entry.placeholder = name;
      new_car_button.disabled = false;
  
    
      console.log(`There are ${n} car/s in memory`);
      document.querySelector("#num_vehicles").innerText = n;
      var tmp;
      for (var i = 0; i < n; i++) {
        vehicle_items[i].style.display = "block";
        tmp = "v" + i;
        const cur_v = JSON.parse(memPull(tmp));
        vehicle_items[i].innerText =
          cur_v.make + " " + cur_v.id + "\n(" + cur_v.mpg + " MPG)";
        if (JSON.parse(memPull("sel")).model === JSON.parse(memPull(tmp)).model) {
          vehicle_items[i].style.border = "solid red";
        } else {
          vehicle_items[i].style.border = "solid black";
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
  
    const new_vehicle = {};
  
    new_vehicle.make = fields[0].value;
    new_vehicle.model = fields[1].value;
    new_vehicle.mpg = fields[2].value;
    new_vehicle.selected = true;
  
    var n = parseInt(memPull("num"));
    new_vehicle.id = n;
    var v_name = "v" + n;
    memPush(v_name, JSON.stringify(new_vehicle));
    console.log("Selecting newest vehicle");
    memPush("sel", JSON.stringify(new_vehicle));
    n++;
    memPush("num", n);
  
    render();
  }
  
  function vehicleClick(e) {
    var v_id = e.target.className.split(" ")[1];
  
    const selected = JSON.parse(memPull(v_id));
    const cur = JSON.parse(memPull("sel"));
  
    if (cur.model === selected.model) {
      console.log("This vehicle is already selected");
    } else {
      memPush("sel", JSON.stringify(selected));
  
      console.log(`The new MPG used will be ${selected.mpg}`);
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
      memPush("login", "true");
      render();
    }
  });

  name_entry.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
        if (name_entry.value !== "") {
            memPush("name", name_entry.value);
            memPush("login", "true");
            render();
          }
    }
    
  });
  
  document.querySelector(".clear").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Cleared");
    localStorage.clear();
    name_entry.value = "";
    render();
  });
  
  for (vehicle of vehicle_items) {
    vehicle.addEventListener("click", (e) => vehicleClick(e));
  }

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixHQUFHLGVBQWUsRUFBRTtBQUM5QztBQUNBO0FBQ0EsTUFBTTtBQUNOLGdDQUFnQyxNQUFNO0FBQ3RDLHdDQUF3QyxHQUFHLEVBQUUsRUFBRTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sK0NBQStDLEVBQUU7QUFDakQ7QUFDQSwyQ0FBMkMsSUFBSTtBQUMvQztBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsR0FBRztBQUNsQztBQUNBO0FBQ0Esc0JBQXNCLE9BQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLDhDQUE4QyxhQUFhO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL29wdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gT1BUSU9OUy5KU1xuLy8gaGFuZGxlIGZvcm0gc3VibWlzc2lvbnMsIGRhdGEgc2F2aW5nLCBkYXRhIGNoYW5naW5nXG4vLyBhbGwgZGF0YSBzaG91bGQgYmUgcGFzc2VkIHRvIGJhY2tncm91bmQuanMgdXBvbiBzYXZlXG4vLyB1dGlsaXplIGNocm9tZSBzdG9yYWdlIHNvIGFsbCBzY3JpcHRzIGNhbiBhY2Nlc3MgZGF0YVxuXG4vLyBNRU1PUlkgU0VUVElORy9HRVRUSU5HIC0gbW92ZSB0byBuZXcgZmlsZVxuZnVuY3Rpb24gbWVtUHVzaChrLCB2KSB7XG4gICAgY29uc29sZS5sb2coYEFkZGluZyAke2t9IHRvIG1lbW9yeSBhcyAke3Z9YCk7XG4gICAgaWYgKGRldikge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oaywgdik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgazogdiB9KTtcbiAgICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBTRVQgJHtrfSAke3Z9YCk7XG4gICAgfVxuICB9XG4gIFxuICBmdW5jdGlvbiBtZW1QdWxsKGspIHtcbiAgICBpZiAoZGV2KSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIFFVRVJZSU5HICR7a31gKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KGssIGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgR09UOiAke3Jlc31gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gR0xPQkFMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIERPTSBpdGVtc1xuICBjb25zdCB2ZWhpY2xlX2l0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52ZWhpY2xlX2l0ZW1cIik7XG4gIGNvbnN0IG5ld19jYXJfYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXdfY2FyX2J1dHRvblwiKTtcbiAgY29uc3QgbmV3X2Nhcl9mb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXdfY2FyX2Zvcm1cIik7XG4gIGNvbnN0IG5hbWVfZW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIik7XG4gIGNvbnN0IHdlbGNvbWVfbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9ybV9oZWFkZXJcIik7XG4gIFxuICAvLyBTY3JpcHQgaXRlbXNcbiAgY29uc3QgdXNlciA9IHt9O1xuICBjb25zdCBkZXYgPSB0cnVlO1xuICB2YXIgY3VycmVudGx5X2F1dGhkID0gZmFsc2U7XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBcbiAgLy8gUE9QVVAgV0lORE9XIEZVTkNUSU9OU1xuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gaGlkZSB2ZWhpY2xlcywgc2hvdyBhcyBuZWVkZWRcbiAgICBmb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICAgICAgdmVoaWNsZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIGN1cnJlbnRseV9hdXRoZCA9IG1lbVB1bGwoXCJsb2dpblwiKTtcbiAgXG4gICAgaWYgKGN1cnJlbnRseV9hdXRoZCA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIC8vIHBvcHVsYXRlIHVzZXIgZGF0YVxuICAgICAgdmFyIG5hbWUgPSBtZW1QdWxsKFwibmFtZVwiKTtcbiAgICAgIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gICAgICBpZiAobiAhPT0gMCl7XG4gICAgICAgIHZhciBzZWxfbXBnID0gSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5tcGc7XG4gICAgICB9XG4gICAgICB3ZWxjb21lX21lc3NhZ2UuaW5uZXJUZXh0ID0gXCJXZWxjb21lIGJhY2ssIFwiICsgbmFtZSArIFwiISAoXCIgK3NlbF9tcGcrXCIpXCI7XG4gICAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gbmFtZTtcbiAgICAgIG5ld19jYXJfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIFxuICAgIFxuICAgICAgY29uc29sZS5sb2coYFRoZXJlIGFyZSAke259IGNhci9zIGluIG1lbW9yeWApO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNudW1fdmVoaWNsZXNcIikuaW5uZXJUZXh0ID0gbjtcbiAgICAgIHZhciB0bXA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICB2ZWhpY2xlX2l0ZW1zW2ldLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRtcCA9IFwidlwiICsgaTtcbiAgICAgICAgY29uc3QgY3VyX3YgPSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSk7XG4gICAgICAgIHZlaGljbGVfaXRlbXNbaV0uaW5uZXJUZXh0ID1cbiAgICAgICAgICBjdXJfdi5tYWtlICsgXCIgXCIgKyBjdXJfdi5pZCArIFwiXFxuKFwiICsgY3VyX3YubXBnICsgXCIgTVBHKVwiO1xuICAgICAgICBpZiAoSlNPTi5wYXJzZShtZW1QdWxsKFwic2VsXCIpKS5tb2RlbCA9PT0gSlNPTi5wYXJzZShtZW1QdWxsKHRtcCkpLm1vZGVsKSB7XG4gICAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5zdHlsZS5ib3JkZXIgPSBcInNvbGlkIHJlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuYm9yZGVyID0gXCJzb2xpZCBibGFja1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIkFkZCB5b3VyIGluZm9cIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IDA7XG4gICAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gXCJOYW1lXCI7XG4gICAgICBuZXdfY2FyX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIFxuICAgICAgbWVtUHVzaChcIm51bVwiLCAwKTtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIFxuICAgIGNvbnN0IGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5wXCIpO1xuICBcbiAgICBjb25zdCBuZXdfdmVoaWNsZSA9IHt9O1xuICBcbiAgICBuZXdfdmVoaWNsZS5tYWtlID0gZmllbGRzWzBdLnZhbHVlO1xuICAgIG5ld192ZWhpY2xlLm1vZGVsID0gZmllbGRzWzFdLnZhbHVlO1xuICAgIG5ld192ZWhpY2xlLm1wZyA9IGZpZWxkc1syXS52YWx1ZTtcbiAgICBuZXdfdmVoaWNsZS5zZWxlY3RlZCA9IHRydWU7XG4gIFxuICAgIHZhciBuID0gcGFyc2VJbnQobWVtUHVsbChcIm51bVwiKSk7XG4gICAgbmV3X3ZlaGljbGUuaWQgPSBuO1xuICAgIHZhciB2X25hbWUgPSBcInZcIiArIG47XG4gICAgbWVtUHVzaCh2X25hbWUsIEpTT04uc3RyaW5naWZ5KG5ld192ZWhpY2xlKSk7XG4gICAgY29uc29sZS5sb2coXCJTZWxlY3RpbmcgbmV3ZXN0IHZlaGljbGVcIik7XG4gICAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuICAgIG4rKztcbiAgICBtZW1QdXNoKFwibnVtXCIsIG4pO1xuICBcbiAgICByZW5kZXIoKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gdmVoaWNsZUNsaWNrKGUpIHtcbiAgICB2YXIgdl9pZCA9IGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdChcIiBcIilbMV07XG4gIFxuICAgIGNvbnN0IHNlbGVjdGVkID0gSlNPTi5wYXJzZShtZW1QdWxsKHZfaWQpKTtcbiAgICBjb25zdCBjdXIgPSBKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpO1xuICBcbiAgICBpZiAoY3VyLm1vZGVsID09PSBzZWxlY3RlZC5tb2RlbCkge1xuICAgICAgY29uc29sZS5sb2coXCJUaGlzIHZlaGljbGUgaXMgYWxyZWFkeSBzZWxlY3RlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShzZWxlY3RlZCkpO1xuICBcbiAgICAgIGNvbnNvbGUubG9nKGBUaGUgbmV3IE1QRyB1c2VkIHdpbGwgYmUgJHtzZWxlY3RlZC5tcGd9YCk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9XG4gIH1cbiAgXG4gIC8vIExJU1RFTiBGT1IgVVBEQVRFUyBGUk9NIEJBQ0tHUk9VTkQuSlMgQU5EIFVQREFURSBBQ0NPUkRJTkdMWVxuICAvLyBnb2luZyB0byBlbmQgbXkgbGlmZSBJIGNhbid0IGJlbGlldmUgSSBqdXN0IHVzZWQgYSBjbG9zdXJlIGluIHRoZSB3aWxkXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVG9nZ2xlcigpIHtcbiAgICB2YXIgdCA9IDA7XG4gICAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgICAgc3dpdGNoICh0KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21ha2VcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgdCA9IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2dnbGU7XG4gIH1cbiAgXG4gIGNvbnN0IHRvZ19mdW5jID0gZ2VuZXJhdGVUb2dnbGVyKCk7XG4gIFxuICAvLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxuICByZW5kZXIoKTtcbiAgXG4gIG5ld19jYXJfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0b2dfZnVuYygpO1xuICB9KTtcbiAgXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGhhbmRsZVN1Ym1pdChlKTtcbiAgICB0b2dfZnVuYygpO1xuICB9KTtcbiAgXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvZ19mdW5jKCk7XG4gIH0pO1xuICBcbiAgbmFtZV9lbnRyeS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgbWVtUHVzaChcIm5hbWVcIiwgbmFtZV9lbnRyeS52YWx1ZSk7XG4gICAgICBtZW1QdXNoKFwibG9naW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuICB9KTtcblxuICBuYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIGlmIChuYW1lX2VudHJ5LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICAgICAgICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICB9XG4gICAgfVxuICAgIFxuICB9KTtcbiAgXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKFwiQ2xlYXJlZFwiKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICBuYW1lX2VudHJ5LnZhbHVlID0gXCJcIjtcbiAgICByZW5kZXIoKTtcbiAgfSk7XG4gIFxuICBmb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICAgIHZlaGljbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB2ZWhpY2xlQ2xpY2soZSkpO1xuICB9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=