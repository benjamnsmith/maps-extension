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
