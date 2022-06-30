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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5wb3B1cC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFwcy1leHRlbnNpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGlzdG9yeV90YWJsZScpXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgICBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICB2YXIgcm93ID0gdGFibGUuaW5zZXJ0Um93KCk7XG4gICAgICAgIHZhciBjZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICAgICAgY2VsbC5pbm5lckhUTUwgPSByZXF1ZXN0LnNpdGU7XG4gICAgfVxuKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==