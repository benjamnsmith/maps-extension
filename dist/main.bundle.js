/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const disp = document.querySelector('.display');
const err = document.querySelector('.nonexistant');
const title = document.querySelector('.title');
const form = document.querySelector('.form-data');
const mpg = document.querySelector('.mpg-input');

var loc = window.location.href

function init() {
    //loc = 'https://www.google.com/maps/dir/1671+Laurel+Ave,+St+Paul,+MN+55104-6122,+USA/due+focacceria,+475+Fairview+Ave+S,+St+Paul,+MN+55105/@44.9361101,-93.1810401,15z/data=!4m14!4m13!1m5!1m1!1s0x87f62a1b1099107d:0xbcce366cb091decb!2m2!1d-93.1710826!2d44.9452261!1m5!1m1!1s0x87f62b878c31ab6f:0xf767aeccf60cd109!2m2!1d-93.1775148!2d44.9272999!3e0'
    if (loc.includes('maps.google.com') || loc.includes('google.com/maps')){
        console.log("Google maps " + loc)
        title.style.color = 'green';
    } else {
        console.log("Not google maps " + loc)
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGlzcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaXNwbGF5Jyk7XG5jb25zdCBlcnIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm9uZXhpc3RhbnQnKTtcbmNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tZGF0YScpO1xuY29uc3QgbXBnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1wZy1pbnB1dCcpO1xuXG52YXIgbG9jID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvL2xvYyA9ICdodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZGlyLzE2NzErTGF1cmVsK0F2ZSwrU3QrUGF1bCwrTU4rNTUxMDQtNjEyMiwrVVNBL2R1ZStmb2NhY2NlcmlhLCs0NzUrRmFpcnZpZXcrQXZlK1MsK1N0K1BhdWwsK01OKzU1MTA1L0A0NC45MzYxMTAxLC05My4xODEwNDAxLDE1ei9kYXRhPSE0bTE0ITRtMTMhMW01ITFtMSExczB4ODdmNjJhMWIxMDk5MTA3ZDoweGJjY2UzNjZjYjA5MWRlY2IhMm0yITFkLTkzLjE3MTA4MjYhMmQ0NC45NDUyMjYxITFtNSExbTEhMXMweDg3ZjYyYjg3OGMzMWFiNmY6MHhmNzY3YWVjY2Y2MGNkMTA5ITJtMiExZC05My4xNzc1MTQ4ITJkNDQuOTI3Mjk5OSEzZTAnXG4gICAgaWYgKGxvYy5pbmNsdWRlcygnbWFwcy5nb29nbGUuY29tJykgfHwgbG9jLmluY2x1ZGVzKCdnb29nbGUuY29tL21hcHMnKSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR29vZ2xlIG1hcHNcIilcbiAgICAgICAgdGl0bGUuc3R5bGUuY29sb3IgPSAnZ3JlZW4nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGdvb2dsZSBtYXBzXCIpXG4gICAgICAgIHRpdGxlLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RvcmVkTVBHID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21wZycpO1xuXG4gICAgaWYgKHN0b3JlZE1QRyA9PT0gbnVsbCkge1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk1pc3Npbmcgc2F2ZWQgbXBnXCIpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtcGcnLCBtcGcudmFsdWUpXG4gICAgY29uc29sZS5sb2coXCIlcyBpbnB1dHRlZFwiLCBtcGcudmFsdWUpXG59XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IGhhbmRsZVN1Ym1pdChlKSk7XG5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9