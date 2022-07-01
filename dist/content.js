const loc = window.location.href;

console.log(loc);

let [matches] = document.querySelectorAll("fontBodyMedium");
console.log(matches);

for (match of matches) {
    if (match.innerHTML.contains("miles")) {
        console.log(match.innerHTML)
    }
}
