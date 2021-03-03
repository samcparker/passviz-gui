<template>
  <v-dialog v-model="settingsDialog" persistent max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs"
            v-on="on" icon x-small color="white">
            <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Password Universe Settings
        </v-card-title>
        <!-- <v-card-text></v-card-text> -->

        <v-container>
          <v-form>

        <v-checkbox
          v-model="externalServerEnabled"
          hide-details
          class="shrink mr-2 mt-0"
          label="Enable External Server"
        ></v-checkbox>
        <v-card-text>
          Processing can be sped up by using an external server. You can find this <a>here</a> with instructions on using it.
        </v-card-text>
        <v-text-field
        v-model="externalServer"
          :disabled="!externalServerEnabled"
          label="External Server URL"
        ></v-text-field>

          </v-form>
        </v-container>
        <v-row> </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="settingsDialog = false" tile>
            Close
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="saveSettings()"
            tile
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import isElectron from "is-electron";

import { LocalStorage } from "node-localstorage"; 
global.localStorage = new LocalStorage('./scratch');

let storage = null;
if (isElectron()) {
  storage = require("electron-json-storage");
}


export default {
  data: () => {
    return {
      settingsDialog: false,
        externalServerEnabled: false,
        externalServer: null
        }
    },
    mounted() {
      //set settings
      this.externalServerEnabled = this.getItem("externalServerEnabled");
      this.externalServer = this.getItem("externalServer");
    },
    methods: {
      // Set key to value in electron or web browser, whichever is being used
      setItem(key, value) {
        if (isElectron()) {
          // Store in electron storage
   
          storage.set(key, value, function(error) {
            if (error) throw error;
          });


        }
        else {
          // Store in localStorage

          localStorage.setItem(key, value)
        }
      },
      getItem(key) {
        if (isElectron()) {
          // retrieve from electron storage

          storage.get(key, function(error, data) {
            if (error) throw error;

            return data;
          });
        }
        else {
          // retrieve from localStorage
          console.log("not in electron, retrieve from localStorage");
          return localStorage.getItem(key)
        }
        
      },
      saveSettings() {
        
        this.setItem("externalServerEnabled", this.externalServerEnabled);
        this.setItem("externalServer", this.externalServer);

        this.settingsDialog = false;
      },

    }
}
</script>

<style>

</style>