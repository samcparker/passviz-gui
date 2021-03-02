<template>

    <v-row id="uc" style="min-height: 100%" no-gutters>
        <v-col v-for="(universe, index) in universes" :key="index" id="universe-col" no-gutters>
            <universe :universe="universe" />
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
</style>