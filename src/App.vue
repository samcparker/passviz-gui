<template>
  <v-app>

  
    <div class="d-flex" style="min-height: 100%">
        <universe-container id="uc" :universes="universes"/>
        <div id="right" class="d-flex flex-column" style="max-height: 100%">
          <!-- <v-row no-gutters>
            Password Universe
          </v-row>

          <v-row style="min-height: 90%" class="pa-0 ma-0" no-gutters>
            <tabs />
          </v-row>

          <v-row no-gutters class="pa-0 ma-0">
            <generate-load v-on:generate="generate" v-on:load="load" />
          </v-row> -->
          <div style="min-height:5%; background-color: #424242;" class="px-2 d-flex align-center justify-center">
            <span style="color: white; font-weight: 900">PASSWORD UNIVERSE
              <settings />
            </span>
          </div>
          <tabs id="tabs" v-on:clone="clone" v-on:remove="remove" :universes="universes" style="min-height: 90%" />
          <generate-load style="min-height: 5%" v-on:generate="generate" v-on:load="load" />

        </div>
    </div>


  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import UniverseContainer from "./components/UniverseContainer.vue";
import Tabs from "./components/Tabs.vue";
import GenerateLoad from "./components/GenerateLoad.vue";

import PasswordUniverseGenerator from "./passworduniversegenerator";
import Settings from "./components/Settings.vue";

import storage from "./storage";

export default Vue.extend({
  name: "App",

  components: {
    UniverseContainer,
    Tabs,
    GenerateLoad,
    Settings
  },

  data: () => ({
    universes: [],

  }),
  methods: {
    clone(universe) {
      const nu = JSON.parse(JSON.stringify(universe));
      nu.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
      this.universes.push(nu);
    },
    remove(universe) {
      const conf = confirm("Are you sure you want to remove this universe?");

      if (!conf) return;

      for (let i = 0; i < this.universes.length; i++) {
        if (this.universes[i].id == universe.id) {
          this.universes.splice(i, 1);
          return;
        }
      }
    },
    generate(passwords: string[], earth: string) {
      // We have list of passwords, now run dimensionality reduction on them
      // let stars = null;


      const externalServerEnabled = storage.getItem("externalServerEnabled");
      let externalServer = null;

      if (externalServerEnabled) {
        externalServer = storage.getItem("externalServer");
      }

      new PasswordUniverseGenerator().generate(passwords, externalServer)
      .then((stars) => {

        const results = {
          stars: stars,
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          hover: false,
          visible: true
        };

        this.universes.push(results);

        console.log("in", this.universes);
      })
      .catch((err) => {
        console.error(err)
      });

        console.log("out:" , this.universes);

    },
    load(a: string) {
      console.log("loading");
      console.log(a);
    }
  }
});
</script>

<style>
html, body {
  overflow: hidden;
}

#uc {
  min-height: 100%;
}

#tabs {
  min-height: 90%;
}

#right {
  background-color: #212121;

}

</style>