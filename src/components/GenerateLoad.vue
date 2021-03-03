/* eslint-disable prettier/prettier */
<template>
  <v-row no-gutters>
    <v-dialog v-model="generateDialog" persistent max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-col id="btn-col">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            class="w-100 px-0"
            tile
            id="genLoadButton"
            
          >
          <div class="d-flex flex-column">

          <v-icon small>
        mdi-plus-thick
      </v-icon>
            Generate
          </div>
          </v-btn>
        </v-col>
      </template>
      <v-card>
        <v-card-title class="headline">
          Generate Universe
        </v-card-title>
        <v-card-text>Generate a new universe.</v-card-text>

        <v-container>
          <v-form>
            <v-file-input
              truncate-length="15"
              label="Password database"
              @change="setFile"
            ></v-file-input>

            <v-slider
              label="Amount used"
              min="1"
              :max="totalPasswords"
              thumb-label="always"
              v-model="amount"
              :disabled="disabled == 1"
            >
            </v-slider>
          </v-form>
        </v-container>
        <v-row> </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="generateDialog = false" tile>
            Close
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="
              generateDialog = false;
              generate();
            "
            tile
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loadDialog" persistent max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-col id="btn-col">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            class="w-100 px-0"
            id="genLoadButton"
            tile
          >
          <div class="d-flex flex-column">
          <v-icon small>
        mdi-upload
      </v-icon>
            Load

          </div>
          </v-btn>
        </v-col>
      </template>
      <v-card>
        <v-card-title class="headline">
          Generate Universe
        </v-card-title>
        <v-card-text>Load a universe.</v-card-text>

        <v-container>
          <v-form>
            <v-file-input
              truncate-length="15"
              label="Universe file"
            ></v-file-input>
          </v-form>
        </v-container>
        <v-row> </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn tile color="green darken-1" text @click="loadDialog = false">
            Close
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="
              loadDialog = false;
              load();
            "
            tile
          >
            Load
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => {
    return {
      generateDialog: false,
      loadDialog: false,
      file: null,
      loadFile: null,
      passwords: null,
      totalPasswords: 1,
      amount: 100,
      disabled: true
    };
  },
  methods: {
    generate() {
      console.log("Generating...");
      console.log(this.passwords);
      console.log(this.amount);
        this.$emit("generate", this.passwords.slice(0, this.amount), null);
      // pass the params
    },
    load() {
      console.log("Loading...");
      this.$emit("load", this.loadFile);
    },

    setLoadFile(event) {
      this.loadFile = event;

      if (!this.loadFile) {
        return;
      }

      const reader = new FileReader();

      
      reader.readAsText(this.file, "UTF-8");
      reader.onload = evt => {
        this.loaded = JSON.parse(evt.target.result);

      };
      reader.onerror = evt => {
        this.disabled = true;
        console.error(evt);
      };

    },

    setFile(event) {
      this.file = event;

      if (!this.file) {
        this.disabled = true;
        return;
      }

      const reader = new FileReader();

      
      reader.readAsText(this.file, "UTF-8");
      reader.onload = evt => {
        this.passwords = evt.target.result.split("\n");

        this.totalPasswords = this.passwords.length;
        this.amount = this.totalPasswords;
        this.disabled = false;



      };
      reader.onerror = evt => {
        this.disabled = true;
        console.error(evt);
      };
    }
  }
};
</script>

<style scoped>
/* #button {
    padding: 0;
    width: 50%;
} */

v-btn {
  padding: 0;
  min-height: 100%;
}

#btn-col {
  max-width: 50%;
}

#genLoadButton {
  min-width: 100%;
  max-width: 100%;
  font-size: 10px;
}
</style>
