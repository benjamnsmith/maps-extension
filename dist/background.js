// this file is legacy - now it just console logs information about the chrome storage

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (key.toString() === "mpg"){
        saved_mpg = parseInt(newValue);
      }
    }
  });