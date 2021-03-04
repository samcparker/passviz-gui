import isElectron from "is-electron";

import store from "store2";


import electronStore from "electron-store";

const electronstore = new electronStore();



const setItem = function (key, value) {
    if (isElectron()) {
        // Store in electron storage
        electronstore.set(key, value);


    } else {
        // Store in localStorage
        store.set(key, value)
    }
}

const getItem = function (key) {
    if (isElectron()) {
        // retrieve from electron storage

        return electronstore.get(key);
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