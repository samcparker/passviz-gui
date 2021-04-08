<template>
  <v-app>

  
    <div class="d-flex" style="min-height: 100%">
        <universe-container v-on:clone="clone" id="uc" :universes="universes"/>
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

import PasswordUniverseGenerator from "./passworduniversegenerator.js";
import Settings from "./components/Settings.vue";

import storage from "./storage";

import loadedUniverse from "./assets/universes/universe.json";
import loadedUniverse2 from "./assets/universes/universe_2.json";

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
  mounted() {
    // Load universe from file in universes/universe.pu
    this.load(JSON.stringify(loadedUniverse));
    // this.load(JSON.stringify(loadedUniverse2));
  },
  methods: {
    /**
     * Normalise the points of a list of stars between -1 and 1.
     */
    normaliseStars(stars) {
      console.log(stars);
      const points = [];
      for (const i in stars) {
        const star  = stars[i];
        points[star.value] = [star.position.x, star.position.y];
      }


      this.normalisePoints(points);


      for (const name in stars) {
        const star = stars[name];
        star.position.x = points[name][0];
        star.position.y = points[name][1];
  
      }
      return stars;
    },
    /**
     * Manipulate the points array directly to normalise between -1 and 1.
     */
    normalisePoints(points) {
      // find max value
      // find min value
      // Only requires storing of max and min, not maxX, minX, maxY and minY because normalise entire point set
      let maxX = -Infinity;
      let minX = Infinity;
      let maxY = -Infinity;
      let minY = Infinity;

      for (const name in points) {
        const p = points[name];

        if (p[0] > maxX) maxX = p[0];
        if (p[1] > maxY) maxY = p[1];
        if (p[0] < minX) minX = p[0];
        if (p[1] < minY) minY = p[1];
      }

      for (const name in points) {
        const p = points[name];
        p[0] = 2 * ((p[0] - minX) / (maxX - minX)) - 1;
        p[1] = 2 * ((p[1] - minY) / (maxY - minY)) - 1;
      }

    },
    /**
     * Clone a universe object.
     */
    clone(universe) {
      const nu = JSON.parse(JSON.stringify(universe));
      nu.stars = this.normaliseStars(nu.stars);
      nu.id = this.getId();
      nu.hover = false;
      this.universes.push(nu);
    },
    /**
     * Generate a random ID for the universe.
     */
    getId() {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
    /**
     * Remove the universe. Removes the universe with corresponding ID.
     */
    remove(universe) {

      for (let i = 0; i < this.universes.length; i++) {
        if (this.universes[i].id == universe.id) {
          this.universes.splice(i, 1);
          return;
        }
      }
    },
    /**
     * Generate a universe with the corresponding parameters.
     */
    generate(passwords: string[], name: string, drMethod: string, gmMethod: string) {
      // Add placeholder with cancel buttons etc
      const u = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        stars: null,
        computing: true,
        hover: false,
        visible: false,
        error: null,
        name: name
      };
      this.universes.push(u);

      // We have list of passwords, now run dimensionality reduction on them
      // let stars = null;


      const externalServerEnabled = storage.getItem("externalServerEnabled");
      let externalServer = null;

      if (externalServerEnabled) {
        externalServer = storage.getItem("externalServer");
      }
       
      new PasswordUniverseGenerator().generate(passwords, externalServer, drMethod, gmMethod)
        .then((stars) => {
          // Normalise stars
          u.stars = this.normaliseStars(stars);
          u.computing = false;
          u.visible = true;
  
        })
        .catch((err) => {
          console.error(err)
          u.error = err;
        });
    },
    /**
     * Load the contents of a file to a universe. Will first check if it is JSON and read as CSV if not.
     * 
     * TODO : Error message if neither JSON or CSV
     */
    load(universeString: string) {
      let universe = null;
      try {
        universe = JSON.parse(universeString);

        const nStars = {};

        for (let i = 0; i < universe.stars.length; i++) {
          nStars[universe.stars[i].value] = universe.stars[i];
        }

        universe.stars = nStars;
      }
      // Erred so presumably CSV
      catch(err) {
        const lines = universeString.split("\n");
        const stars = {};
        // Write all to points object from CSV
        for (let i = 0; i < lines.length; i++) {
          const current = lines[i].replace("\r", "").split("\t");
          const name = current[0];
          const xp = parseFloat(current[1]);
          const yp = parseFloat(current[2]);
          stars[name] = {
            value: name,
            position: {
              x: xp,
              y: yp
            }
          };
        }
        universe = {
          "stars": stars
        }


      }

      

      this.normaliseStars(universe["stars"]);
      universe["id"] = this.getId();
      universe["visible"] = true;
      this.universes.push(universe);
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
  min-width: 220px;

}

</style>