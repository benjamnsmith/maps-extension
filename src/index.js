const table = document.querySelector('.history_table')

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var row = table.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = request.site;
    }
);
