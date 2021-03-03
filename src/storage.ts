import isElectron from "is-electron";

import store from "store2";

let electronStorage = null;
if (isElectron()) {
    electronStorage = require("electron-json-storage");
}


const setItem = function (key, value) {
    if (isElectron()) {
        // Store in electron storage

        electronStorage.set(key, value, function (error) {
            if (error) throw error;
        });


    } else {
        // Store in localStorage
        console.log("setting", key, "to", value);
        store.set(key, value)
    }
}

const getItem = function (key) {
    if (isElectron()) {
        // retrieve from electron storage

        electronStorage.get(key, function (error, data) {
            if (error) throw error;

            return data;
        });
    } else {

        // retrieve from localStorage
        console.log("getting", key);
        return store.get(key)
    }
}

export default {
    setItem,
    getItem
}