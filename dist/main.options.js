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
          cur_v.make + " " + cur_v.model + "\n(" + cur_v.mpg + " MPG)";
        if (JSON.parse(memPull("sel")).id === JSON.parse(memPull(tmp)).id) {
          vehicle_items[i].style.border = "5px solid red";
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
    chrome.storage.sync.set({'mpg': `${new_vehicle.mpg}` });
    n++;
    memPush("num", n);
  
    render();
  }
  
  function vehicleClick(e) {
    var v_id = e.target.className.split(" ")[1];
  
    const selected = JSON.parse(memPull(v_id));
    const cur = JSON.parse(memPull("sel"));
  
    if (cur.id === selected.id) {
      console.log("This vehicle is already selected");
    } else {
      memPush("sel", JSON.stringify(selected));
  
      console.log(`The new MPG used will be ${selected.mpg}`);
      chrome.storage.sync.set({'mpg': `${selected.mpg}` });
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
      chrome.storage.sync.set({'user': `${name_entry.value}` });
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
  })

  for (vehicle of vehicle_items) {
    vehicle.addEventListener("click", (e) => vehicleClick(e));
  }

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixHQUFHLGVBQWUsRUFBRTtBQUM5QztBQUNBO0FBQ0EsTUFBTTtBQUNOLGdDQUFnQyxNQUFNO0FBQ3RDLHdDQUF3QyxHQUFHLEVBQUUsRUFBRTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sK0NBQStDLEVBQUU7QUFDakQ7QUFDQSwyQ0FBMkMsSUFBSTtBQUMvQztBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsR0FBRztBQUNsQztBQUNBO0FBQ0Esc0JBQXNCLE9BQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixVQUFVLGdCQUFnQixHQUFHO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLDhDQUE4QyxhQUFhO0FBQzNELCtCQUErQixVQUFVLGFBQWEsR0FBRztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVcsaUJBQWlCLEdBQUc7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvb3B0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPUFRJT05TLkpTXG4vLyBoYW5kbGUgZm9ybSBzdWJtaXNzaW9ucywgZGF0YSBzYXZpbmcsIGRhdGEgY2hhbmdpbmdcbi8vIGFsbCBkYXRhIHNob3VsZCBiZSBwYXNzZWQgdG8gYmFja2dyb3VuZC5qcyB1cG9uIHNhdmVcbi8vIHV0aWxpemUgY2hyb21lIHN0b3JhZ2Ugc28gYWxsIHNjcmlwdHMgY2FuIGFjY2VzcyBkYXRhXG5cbi8vIE1FTU9SWSBTRVRUSU5HL0dFVFRJTkcgLSBtb3ZlIHRvIG5ldyBmaWxlXG5mdW5jdGlvbiBtZW1QdXNoKGssIHYpIHtcbiAgICBjb25zb2xlLmxvZyhgQWRkaW5nICR7a30gdG8gbWVtb3J5IGFzICR7dn1gKTtcbiAgICBpZiAoZGV2KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrLCB2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBrOiB2IH0pO1xuICAgICAgY29uc29sZS5sb2coYENIUk9NRSBTVE9SQUdFIFNFVCAke2t9ICR7dn1gKTtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIG1lbVB1bGwoaykge1xuICAgIGlmIChkZXYpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgQ0hST01FIFNUT1JBR0UgUVVFUllJTkcgJHtrfWApO1xuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoaywgZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBDSFJPTUUgU1RPUkFHRSBHT1Q6ICR7cmVzfWApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBHTE9CQUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRE9NIGl0ZW1zXG4gIGNvbnN0IHZlaGljbGVfaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnZlaGljbGVfaXRlbVwiKTtcbiAgY29uc3QgbmV3X2Nhcl9idXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfYnV0dG9uXCIpO1xuICBjb25zdCBuZXdfY2FyX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld19jYXJfZm9ybVwiKTtcbiAgY29uc3QgbmFtZV9lbnRyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKTtcbiAgY29uc3Qgd2VsY29tZV9tZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb3JtX2hlYWRlclwiKTtcbiAgXG4gIC8vIFNjcmlwdCBpdGVtc1xuICBjb25zdCB1c2VyID0ge307XG4gIGNvbnN0IGRldiA9IHRydWU7XG4gIHZhciBjdXJyZW50bHlfYXV0aGQgPSBmYWxzZTtcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIFxuICAvLyBQT1BVUCBXSU5ET1cgRlVOQ1RJT05TXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyBoaWRlIHZlaGljbGVzLCBzaG93IGFzIG5lZWRlZFxuICAgIGZvciAodmVoaWNsZSBvZiB2ZWhpY2xlX2l0ZW1zKSB7XG4gICAgICB2ZWhpY2xlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgY3VycmVudGx5X2F1dGhkID0gbWVtUHVsbChcImxvZ2luXCIpO1xuICBcbiAgICBpZiAoY3VycmVudGx5X2F1dGhkID09PSBcInRydWVcIikge1xuICAgICAgLy8gcG9wdWxhdGUgdXNlciBkYXRhXG4gICAgICB2YXIgbmFtZSA9IG1lbVB1bGwoXCJuYW1lXCIpO1xuICAgICAgdmFyIG4gPSBwYXJzZUludChtZW1QdWxsKFwibnVtXCIpKTtcbiAgICAgIGlmIChuICE9PSAwKXtcbiAgICAgICAgdmFyIHNlbF9tcGcgPSBKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLm1wZztcbiAgICAgIH1cbiAgICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIldlbGNvbWUgYmFjaywgXCIgKyBuYW1lICsgXCIhIChcIiArc2VsX21wZytcIilcIjtcbiAgICAgIG5hbWVfZW50cnkucGxhY2Vob2xkZXIgPSBuYW1lO1xuICAgICAgbmV3X2Nhcl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgXG4gICAgXG4gICAgICBjb25zb2xlLmxvZyhgVGhlcmUgYXJlICR7bn0gY2FyL3MgaW4gbWVtb3J5YCk7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bV92ZWhpY2xlc1wiKS5pbm5lclRleHQgPSBuO1xuICAgICAgdmFyIHRtcDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG1wID0gXCJ2XCIgKyBpO1xuICAgICAgICBjb25zdCBjdXJfdiA9IEpTT04ucGFyc2UobWVtUHVsbCh0bXApKTtcbiAgICAgICAgdmVoaWNsZV9pdGVtc1tpXS5pbm5lclRleHQgPVxuICAgICAgICAgIGN1cl92Lm1ha2UgKyBcIiBcIiArIGN1cl92Lm1vZGVsICsgXCJcXG4oXCIgKyBjdXJfdi5tcGcgKyBcIiBNUEcpXCI7XG4gICAgICAgIGlmIChKU09OLnBhcnNlKG1lbVB1bGwoXCJzZWxcIikpLmlkID09PSBKU09OLnBhcnNlKG1lbVB1bGwodG1wKSkuaWQpIHtcbiAgICAgICAgICB2ZWhpY2xlX2l0ZW1zW2ldLnN0eWxlLmJvcmRlciA9IFwiNXB4IHNvbGlkIHJlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZlaGljbGVfaXRlbXNbaV0uc3R5bGUuYm9yZGVyID0gXCJzb2xpZCBibGFja1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdlbGNvbWVfbWVzc2FnZS5pbm5lclRleHQgPSBcIkFkZCB5b3VyIGluZm9cIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbnVtX3ZlaGljbGVzXCIpLmlubmVyVGV4dCA9IDA7XG4gICAgICBuYW1lX2VudHJ5LnBsYWNlaG9sZGVyID0gXCJOYW1lXCI7XG4gICAgICBuZXdfY2FyX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIFxuICAgICAgbWVtUHVzaChcIm51bVwiLCAwKTtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIFxuICAgIGNvbnN0IGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5wXCIpO1xuICBcbiAgICBjb25zdCBuZXdfdmVoaWNsZSA9IHtcbiAgICAgICAgbWFrZTogZmllbGRzWzBdLnZhbHVlLFxuICAgICAgICBtb2RlbDogZmllbGRzWzFdLnZhbHVlLFxuICAgICAgICBtcGc6IGZpZWxkc1syXS52YWx1ZSxcbiAgICAgICAgc2VsZWN0ZWQ6IHRydWVcbiAgICB9O1xuICBcbiAgICBcbiAgICB2YXIgbiA9IHBhcnNlSW50KG1lbVB1bGwoXCJudW1cIikpO1xuICAgIG5ld192ZWhpY2xlLmlkID0gbjtcbiAgICB2YXIgdl9uYW1lID0gXCJ2XCIgKyBuO1xuICAgIG1lbVB1c2godl9uYW1lLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuXG4gICAgY29uc29sZS5sb2coXCJTZWxlY3RpbmcgbmV3ZXN0IHZlaGljbGVcIik7XG4gICAgbWVtUHVzaChcInNlbFwiLCBKU09OLnN0cmluZ2lmeShuZXdfdmVoaWNsZSkpO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsnbXBnJzogYCR7bmV3X3ZlaGljbGUubXBnfWAgfSk7XG4gICAgbisrO1xuICAgIG1lbVB1c2goXCJudW1cIiwgbik7XG4gIFxuICAgIHJlbmRlcigpO1xuICB9XG4gIFxuICBmdW5jdGlvbiB2ZWhpY2xlQ2xpY2soZSkge1xuICAgIHZhciB2X2lkID0gZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKVsxXTtcbiAgXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBKU09OLnBhcnNlKG1lbVB1bGwodl9pZCkpO1xuICAgIGNvbnN0IGN1ciA9IEpTT04ucGFyc2UobWVtUHVsbChcInNlbFwiKSk7XG4gIFxuICAgIGlmIChjdXIuaWQgPT09IHNlbGVjdGVkLmlkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlRoaXMgdmVoaWNsZSBpcyBhbHJlYWR5IHNlbGVjdGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1QdXNoKFwic2VsXCIsIEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkKSk7XG4gIFxuICAgICAgY29uc29sZS5sb2coYFRoZSBuZXcgTVBHIHVzZWQgd2lsbCBiZSAke3NlbGVjdGVkLm1wZ31gKTtcbiAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsnbXBnJzogYCR7c2VsZWN0ZWQubXBnfWAgfSk7XG4gICAgICByZW5kZXIoKTtcbiAgICB9XG4gIH1cbiAgXG4gIC8vIExJU1RFTiBGT1IgVVBEQVRFUyBGUk9NIEJBQ0tHUk9VTkQuSlMgQU5EIFVQREFURSBBQ0NPUkRJTkdMWVxuICAvLyBnb2luZyB0byBlbmQgbXkgbGlmZSBJIGNhbid0IGJlbGlldmUgSSBqdXN0IHVzZWQgYSBjbG9zdXJlIGluIHRoZSB3aWxkXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVG9nZ2xlcigpIHtcbiAgICB2YXIgdCA9IDA7XG4gICAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgICAgc3dpdGNoICh0KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgbmV3X2Nhcl9mb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgdCA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21ha2VcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kZWxcIikudmFsdWUgPSBcIlwiO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXBnXCIpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICBuZXdfY2FyX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgIG5ld19jYXJfZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgdCA9IDA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2dnbGU7XG4gIH1cbiAgXG4gIGNvbnN0IHRvZ19mdW5jID0gZ2VuZXJhdGVUb2dnbGVyKCk7XG4gIFxuICAvLyBSVU4gVVBPTiBFWFRFTlNJT04gSU5JVFxuICByZW5kZXIoKTtcbiAgXG4gIG5ld19jYXJfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0b2dfZnVuYygpO1xuICB9KTtcbiAgXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9zdWJtaXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGhhbmRsZVN1Ym1pdChlKTtcbiAgICB0b2dfZnVuYygpO1xuICB9KTtcbiAgXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudmVoaWNsZV9jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvZ19mdW5jKCk7XG4gIH0pO1xuICBcbiAgbmFtZV9lbnRyeS5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAobmFtZV9lbnRyeS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgbWVtUHVzaChcIm5hbWVcIiwgbmFtZV9lbnRyeS52YWx1ZSk7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7J3VzZXInOiBgJHtuYW1lX2VudHJ5LnZhbHVlfWAgfSk7XG4gICAgICBtZW1QdXNoKFwibG9naW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuICB9KTtcblxuICBuYW1lX2VudHJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIGlmIChuYW1lX2VudHJ5LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBtZW1QdXNoKFwibmFtZVwiLCBuYW1lX2VudHJ5LnZhbHVlKTtcbiAgICAgICAgICAgIG1lbVB1c2goXCJsb2dpblwiLCBcInRydWVcIik7XG4gICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICB9XG4gICAgfVxuICAgIFxuICB9KTtcbiAgXG4gIHZhciBkb3VibGVfY2hlY2sgPSAwO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHN3aXRjaCAoZG91YmxlX2NoZWNrKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRvdWJsZV9jaGVjayk7XG4gICAgICAgICAgICBkb3VibGVfY2hlY2sgPSAxO1xuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgICAgICAgZS50YXJnZXQudGV4dENvbnRlbnQgPSBcIlllcyBJJ20gc3VyZVwiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpLnRleHRDb250ZW50ID0gXCJDYW5jZWxcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2FybmluZyFcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY29uc29sZS5sb2coZG91YmxlX2NoZWNrKTtcbiAgICAgICAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICBlLnRhcmdldC50ZXh0Q29udGVudCA9IFwiQ2xlYXIgZGF0YVwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGVhcmVkXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmNsZWFyKCk7XG4gICAgICAgICAgICBuYW1lX2VudHJ5LnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gICAgXG4gIH0pO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHN3aXRjaCAoZG91YmxlX2NoZWNrKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGRvdWJsZV9jaGVjayA9IDA7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGVhclwiKS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xlYXJcIikudGV4dENvbnRlbnQgPSBcIkNsZWFyIGRhdGFcIjtcbiAgICAgICAgICAgIGUudGFyZ2V0LnRleHRDb250ZW50ID0gXCJDbG9zZVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSlcblxuICBmb3IgKHZlaGljbGUgb2YgdmVoaWNsZV9pdGVtcykge1xuICAgIHZlaGljbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB2ZWhpY2xlQ2xpY2soZSkpO1xuICB9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=