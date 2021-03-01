<template>
  <v-app>

  
    <div class="d-flex" style="min-height: 100%">
        <universe-container id="uc"/>
        <div>
        <v-row no-gutters>
          Password Universe
        </v-row>

        <v-row style="min-height: 90%" no-gutters>
          <tabs />
        </v-row>

        <v-row no-gutters>
          <generate-load v-on:generate="generate" v-on:load="load" />
        </v-row>

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


  }),
  methods: {
    generate(passwordList: object, earth: string) {
      // We have list of passwords, now run dimensionality reduction on them
      new PasswordUniverseGenerator().generate(passwordList);

    },
    load(a: string) {
      console.log("loading");
      console.log(a);
    }
  }
});
</script>

<style scoped>
#uc {
  min-height: 100%;
}

tabs {
  min-height: 90%;
}
</style>