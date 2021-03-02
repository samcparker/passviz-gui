<template>
  
      <div id="tab" class="align-center px-2 mb-2" style="">
          <v-progress-linear
                value="100"
                color="yellow darken-2"
            ></v-progress-linear>
            <v-btn icon color="white" x-small>
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="clone">
                <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small>
                <v-icon>mdi-eye</v-icon>
            </v-btn>


      </div>

</template>

<script>
export default {
    props: {
        universe: Array
    },
    methods: {
        clone() {
            this.$emit("clone", this.universe);
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