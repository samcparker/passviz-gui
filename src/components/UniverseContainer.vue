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
        universes: Array
    },
    data: () => {
        return {
        }
    },
    methods: {
        clone(evt) {
            this.$emit("clone", evt);
        }
    }
}
</script>

<style>
/* #universe-col {
    padding: 0
} */

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