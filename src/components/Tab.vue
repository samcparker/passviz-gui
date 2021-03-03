<template>
  
      <div id="tab" class="align-center px-2 mb-2" style="" @mouseover="universe.hover = true" @mouseleave="universe.hover = false">
          <v-progress-linear
                value="100"
                color="yellow darken-2"
            ></v-progress-linear>
            <v-btn icon color="white" x-small @click="remove">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="clone">
                <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="universe.visible = !universe.visible">
                <v-icon v-if="universe.visible">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
            </v-btn>


      </div>

</template>

<script>
export default {
    props: {
        universe: Object
    },
    methods: {
        clone() {
            this.$emit("clone", this.universe);
        },
        remove() {
            this.$emit("remove", this.universe);
        }
    }
}
</script>

<style>
#tab {
    display: flex;
    width: 100%;
    height: 50px;
    background-color: #616161;
}
</style>