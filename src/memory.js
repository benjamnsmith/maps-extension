class Memory {
    constructor(devmode) {
        // whether or not to use local storage
        this.devmode = devmode;
        console.log(`Memory controller created with devmode (${this.devmode})`)
    }

    push(k, v) {
        console.log(`Adding ${k} to memory as ${v}`);
        if (this.devmode){
            localStorage.setItem(k, v);
        } else {
            chrome.storage.sync.set({ k: v });
        }

    }

    pull(k) {
        console.log(`Pulling ${k} from memory...`);
        if (this.devmode){
            var data = localStorage.getItem(k)
            console.log(`LocalStorage got ${data}`)
            return data;
        } else {
            var storage_prom = chrome.storage.sync.get(k);
            storage_prom.then ( (data) => {
                console.log(`Chrome storage got ${data[k]}`);
                return data[k];
            })
        }
    }
}

export {Memory};

