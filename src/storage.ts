import isElectron from "is-electron";
import 
    LocalStorage
 from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');

let electronStorage = null;
if (isElectron()) {
    electronStorage = require("electron-json-storage");
}

export default class Storage {
    
    setItem(key, value) {
        if (isElectron()) {
            // Store in electron storage
            
            electronStorage.set(key, value, function (error) {
                if (error) throw error;
            });
            
            
        } else {
            // Store in localStorage
            
            localStorage.setItem(key, value)
        }
    }
    
    getItem(key) {
        if (isElectron()) {
            // retrieve from electron storage

            electronStorage.get(key, function (error, data) {
                if (error) throw error;

                return data;
            });
        } else {
            // retrieve from localStorage
            return localStorage.getItem(key)
        }
    }

}