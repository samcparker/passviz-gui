/**
 * Set of functions to access storage from localStorage if using website or Electron storage if using Electron.
 */

import isElectron from "is-electron";

import store from "store2";

/**
 * Set the item key in storage with value.
 * 
 * @param  {string} key - key of the item
 * @param  {*} value - value of the item
 */
const setItem = function (key, value) {
    if (isElectron()) {
        // Store in electron storage
        const electronStore =  require("electron-store");
        const electronstore = new electronStore();
        electronstore.set(key, value);
    } else {
        // Store in localStorage
        store.set(key, value)
    }
}
/**
 * Get the item with the corresponding key
 * @param  {string} key - key of the item
 * 
 * @return {*} - value of the key
 */
const getItem = function (key) {
    if (isElectron()) {
        // retrieve from electron storage
        const electronStore =  require("electron-store");
        const electronstore = new electronStore();
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