/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const table = document.querySelector('.history_table')

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var row = table.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = request.site;
    }
);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21hcHMtZXh0ZW5zaW9uLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhpc3RvcnlfdGFibGUnKVxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gICAgZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIHJvdyA9IHRhYmxlLmluc2VydFJvdygpO1xuICAgICAgICB2YXIgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIGNlbGwuaW5uZXJIVE1MID0gcmVxdWVzdC5zaXRlO1xuICAgIH1cbik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=