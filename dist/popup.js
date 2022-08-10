const button = document.querySelector(".icon");
const welc_message = document.querySelector(".welcome");
const year = document.querySelector(".year");
const make = document.querySelector(".make");
const model = document.querySelector(".model");
const mpg = document.querySelector(".mpg");

const user = {
  "name": "Quincy",
  "mpg": 30,
  "make": "Volvo",
  "model": "v70",
  "year": "2003"
};

button.addEventListener("click", (e) => {
    chrome.runtime.openOptionsPage();
    //console.log("Opened options page");
});


function displayInfo(){
  // change greeting
  welc_message.innerText = "Hey there, " + user.name + "!";
  year.innerText = user.year;
  make.innerText = user.make;
  model.innerText = user.model;
  mpg.innerText = user.mpg;

}



function hideInfo(){
 const info = document.querySelector(".info_text");
 info.style.display = "none";
 welc_message.innerText = "You're not logged in. Please enter your info to see your stats!";
}

async function checkLogin(){

  return chrome.storage.sync.get("user", (res) =>{
      console.log(res);
      console.log(res.user);
      if (res.user){
    
        user.name = res.user;
      }
});

}


const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) {
  
        reject();
      } else {

        resolve(result[key]);
      }
    });
  });
};


async function render(){

  try {
    user.name = await readLocalStorage("user");
    console.log("display queen");
    displayInfo();
  } catch (rp) {
    console.log("embarassed girly");
    hideInfo();
  }

  
}

render();

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    if (key.toString() === "user"){
      console.log("the user name got changed baby");

      user.name = newValue;
      render();
    }
    
  }
});




// light ffa8af
// dark  ff000f
