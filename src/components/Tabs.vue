<template>
    <div id="tabs" class="px-1" style="width: 100%; overflow-y: scroll;">
        <tab v-on:clone="clone" v-for="(universe, index) in universes" :key="index" :universe="universe"/>
    </div>
</template>

<script>
import Tab from './Tab.vue'
export default {
  components: { Tab },
    props: {
        universes: Array
    },
    methods: {
        clone(e) {
            console.log(e);
            this.$emit("clone", e);
        }
    }
}
</script>

<style>

</style>