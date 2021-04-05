<template>

    <v-row id="uc" style="min-height: 100%" no-gutters>
        <v-col v-for="(universe, index) in universes" :key="index" id="universe-col" no-gutters :class="universe.visible ? 'show' : 'hide'">
            <universe v-on:clone="clone" v-if="!universe.computing" :universe="universe"/>
        </v-col>
    </v-row>

</template>

<script>
import Universe from "./Universe";

export default {
    components: {
        Universe
    },
    props: {
        /**
         * Object containing all universes
         */
        universes: Array
    },
    methods: {
        /**
         * Send Clone event to App.vue to clone sub-universe
         */
        clone(evt) {
            this.$emit("clone", evt);
        },

    }
}
</script>

<style>
#uc {
    background-color: black;
}

#universe-col {
    width: 100%;
}

.hide {
    display: none;
}
.show {
    display: block;
}
</style>