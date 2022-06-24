const disp = document.querySelector('.display');
const err = document.querySelector('.nonexistant');
const title = document.querySelector('.title');
const form = document.querySelector('.form-data');
const mpg = document.querySelector('.mpg-input');

var loc = window.location.href

function init() {
    //loc = 'https://www.google.com/maps/dir/1671+Laurel+Ave,+St+Paul,+MN+55104-6122,+USA/due+focacceria,+475+Fairview+Ave+S,+St+Paul,+MN+55105/@44.9361101,-93.1810401,15z/data=!4m14!4m13!1m5!1m1!1s0x87f62a1b1099107d:0xbcce366cb091decb!2m2!1d-93.1710826!2d44.9452261!1m5!1m1!1s0x87f62b878c31ab6f:0xf767aeccf60cd109!2m2!1d-93.1775148!2d44.9272999!3e0'
    if (loc.includes('maps.google.com') || loc.includes('google.com/maps')){
        console.log("Google maps")
        title.style.color = 'green';
    } else {
        console.log("Not google maps")
        title.style.color = 'red';
        return;
    }
    const storedMPG = localStorage.getItem('mpg');

    if (storedMPG === null) {
        form.style.display = 'block';
        console.log("Missing saved mpg");
    }
};

function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('mpg', mpg.value)
    console.log("%s inputted", mpg.value)
}

form.addEventListener('submit', (e) => handleSubmit(e));
init();