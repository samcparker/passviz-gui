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
          <div style="min-height:5%; background-color: #424242" class="d-flex align-center justify-center">
            <span style="color: white">Password Universe</span>
          </div>
          <tabs id="tabs" v-on:clone="clone" :universes="universes" style="min-height: 90%" />
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

export default Vue.extend({
  name: "App",

  components: {
    UniverseContainer,
    Tabs,
    GenerateLoad,
  },

  data: () => ({
    universes: []

  }),
  methods: {
    clone(universe) {
      this.universes.push(universe);
    },
    generate(passwordList: string[], earth: string) {
      // We have list of passwords, now run dimensionality reduction on them
      const results = new PasswordUniverseGenerator().generate(passwordList);
      this.universes.push(results);
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