function showStatic() {
    
}

function init() {
    if (localStorage.getItem("mpg") === null) {
        showStatic();
    } else {
        showData();
    }
};


init();