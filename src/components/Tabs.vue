<template>
    <div id="tabs" class="px-1" style="width: 100%; overflow-y: scroll;">
        <tab class="mt-2" v-on:merge="merge" v-on:clone="clone" v-on:remove="remove" v-for="(universe, index) in universes" :key="index" :universe="universe" :universeMerging="universeMerging"/>
    </div>
</template>

<script>
import Tab from './Tab.vue'

export default {
  components: { Tab },
  data: () => {
      return {
          universeMerging: false,
          mergables: []
      }
  },
    props: {
        // Array of universe
        universes: Array
    },
    methods: {
        /**
         * Emit clone event to App.vue
         */
        clone(e) {
            this.$emit("clone", e);
        },
        /**
         * Emit Remove event to App.vue
         */
        remove(e) {
            this.$emit("remove", e);
        },
        merge(universe) {
            // get user to select another universe
            this.universeMerging = true;
        }
    } 
}
</script>

<style>

</style>