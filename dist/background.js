// const loc = window.location.href
// const title = document.querySelector('.title');

// if (loc.includes('maps.google.com') || loc.includes('google.com/maps')){
//     console.log("Google maps")
//     title.style.color = 'green';
// }

chrome.webNavigation.onCompleted.addListener(() => {
    console.log("Yes website " + window.location.href)
})