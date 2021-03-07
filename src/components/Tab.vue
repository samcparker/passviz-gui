<template>
  
    <div id="tab" class="align-center px-2 mb-2" :style="universe.mergable ? 'border: 1px solid red' : 'border 0px'" @mouseover="universe.hover = true" @mouseleave="universe.hover = false">

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
            <v-btn icon color="white" x-small @click="remove" :disabled="universeMerging">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="clone" :disabled="universe.computing || universeMerging">
                <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="save" :disabled="universe.computing">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="universe.visible = !universe.visible" :disabled="universe.computing || universeMerging">
                <v-icon v-if="universe.visible && !universe.computing">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
            </v-btn>
      </div>

</template>

<script>
import { save } from "save-file";

export default {
    props: {
        universe: Object,
        universeMerging: Boolean
    },
    methods: {
        merge() {
            if (this.universe.computing) return;
            this.universe.merging = true;
            this.$emit("merge", this.universe);
        },
        async save() {
            // this.$emit("save", this.universe);
            const universeCopy = JSON.parse(JSON.stringify(this.universe));
            universeCopy.hover = false;
            const data = JSON.stringify(universeCopy, null, 1);
            await save(data, 'example.pu');
        },
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