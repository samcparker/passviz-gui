<template>
    <div id="tabs" class="px-1" style="width: 100%; overflow-y: scroll;">
        <tab v-on:clone="clone" v-on:remove="remove" v-for="(universe, index) in universes" :key="index" :universe="universe"/>
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
            this.$emit("clone", e);
        },
        remove(e) {
            this.$emit("remove", e);
        }
    }
}
</script>

<style>

</style>