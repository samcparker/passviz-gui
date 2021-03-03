<template>
  
      <div id="tab" class="align-center px-2 mb-2" style="" @mouseover="universe.hover = true" @mouseleave="universe.hover = false">

    <v-tooltip bottom v-if="universe.error" >
      <template v-slot:activator="{ on, attrs }">
          <v-icon color="red" v-bind="attrs" v-on="on">
              mdi-alert-circle
          </v-icon>
      </template>
      <span>
          {{ universe.error }}
      </span>
    </v-tooltip>
          <v-progress-linear
          v-if="!universe.error"
                value="100"
                :color="universe.error ? 'red' : 'white'"
                :indeterminate="universe.computing"
            ></v-progress-linear>
            <v-btn icon color="white" x-small @click="remove">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="clone" :disabled="universe.computing">
                <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="universe.visible = !universe.visible" :disabled="universe.computing">
                <v-icon v-if="universe.visible && !universe.computing">mdi-eye</v-icon>
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
            if (this.universe.computing) return;
            this.$emit("clone", this.universe);
        },
        remove() {
            if (this.universe.computing) {
                const conf = confirm("Are you sure you want to remove this universe? It hasn't finished computing.");
                // TODO: Cancel computation on server side
                if (!conf) return;
            }
            else {
                const conf = confirm("Are you sure you want to remove this universe?");
                if (!conf) return;
            }

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