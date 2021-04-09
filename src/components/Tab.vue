<template>

    <div id="tab" class="d-flex flex-column px-2 mb-2"
        :style="universe.mergable ? 'border: 1px solid red' : 'border 0px'" @mouseover="universe.hover = true"
        @mouseleave="universe.hover = false">
        <div class="h-100">
            <v-tooltip bottom v-if="universe.error">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon color="red" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                    </v-icon>
                </template>
                <span>
                    {{ universe.error }}
                </span>
            </v-tooltip>
            <p class="mb-0" style="color: white" contenteditable="true" @input="rename" ref="name">
            {{ universe.name }}
            
            </p>
            <span>
                {{ Object.keys(universe.stars).length }} stars
            </span>
        </div>
        <div  class="h-100">
            <v-btn icon color="white" x-small @click="remove" :disabled="universeMerging">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="clone" :disabled="universe.computing || universeMerging">
                <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="save" :disabled="universe.computing">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon color="white" x-small @click="universe.visible = !universe.visible"
                :disabled="universe.computing || universeMerging">
                <v-icon v-if="universe.visible && !universe.computing">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
            </v-btn>
        </div>
        <!-- <div v-if="universe.computing"> -->
            <v-progress-linear  v-if="!universe.error && universe.computing" value="100" :color="universe.error ? 'red' : 'white'"
                :indeterminate="universe.computing"></v-progress-linear>
        <!-- </div> -->
        <!-- <v-row  class="w-100">
            <v-col cols="12">
                <p>
                    {{universe.name}}
                </p>
            </v-col>
            <v-col cols="12">
               
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
                
            </v-col>
            <v-col cols="12" v-if="universe.computing && !universe.error">
                      <v-progress-linear
          v-if="!universe.error && universe.computing"
                value="100"
                :color="universe.error ? 'red' : 'white'"
                :indeterminate="universe.computing"
            ></v-progress-linear>

            </v-col>
        </v-row> -->
    </div>

    <!-- <div id="tab" class="align-center px-2 mb-2" :style="universe.mergable ? 'border: 1px solid red' : 'border 0px'" @mouseover="universe.hover = true" @mouseleave="universe.hover = false">

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
        <p style="color: white" class="mb-0">
            {{ universe.name }}
            <br>
            <span style="font-size: 10px" v-if="universe.stars">
            Points: {{universe.stars.length}} 

            </span>
        </p>
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
          <v-progress-linear
          v-if="!universe.error && universe.computing"
                value="100"
                :color="universe.error ? 'red' : 'white'"
                :indeterminate="universe.computing"
            ></v-progress-linear>
      </div> -->

</template>

<script>
import { save } from "save-file";

export default {
    props: {
        // Universe object passed from App.vue.
        universe: Object,
        universeMerging: Boolean
    },
    methods: {
        rename() {
            const newName = this.$refs.name.innerText;
            this.universe.name = newName;
        },
        /**
         * Merge function. Not in use.
         */
        merge() {
            if (this.universe.computing) return;
            this.universe.merging = true;
            this.$emit("merge", this.universe);
        },
        /**
         * Save the universe object.
         */
        async save() {
            const universeCopy = JSON.parse(JSON.stringify(this.universe));
            universeCopy.hover = false;
            const data = JSON.stringify(universeCopy, null, 1);
            await save(data, this.universe.name+ ".pu");
        },
        /**
         * Emit a clone event to App.vue to clone this universe.
         */
        clone() {
            if (this.universe.computing) return;
            this.$emit("clone", this.universe);
        },
        /**
         * Emit a remove event to App.vue to remove this universe.
         */
        remove() {
            // Give message to confirm user wants to actually remove universe.
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
    height: 70px;
    background-color: #616161;
}
</style>