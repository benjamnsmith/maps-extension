const loc = window.location.href;

console.log(loc);

chrome.runtime.sendMessage({site: loc});