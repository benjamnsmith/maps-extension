const button = document.querySelector(".icon");

button.addEventListener("click", (e) => {
    chrome.runtime.openOptionsPage();
    console.log("options clicked");
});




// light ffa8af
// dark  ff000f
