<template>

    <v-row style="min-height: 100%" no-gutters>
        <v-col v-for="(universe, index) in universes" :key="index" id="universe-col" no-gutters>
            <universe :name="universe.name" />
        </v-col>
    </v-row>

</template>

<script>
import Universe from "./Universe";

export default {
    components: {
        Universe
    },
    data: () => {
        return {
            universes: [
                {
                    name: "dog"
                },
                {
                    name: "cat"
                }
            ]
        }
    }
}
</script>

<style>
/* #universe-col {
    padding: 0
} */
</style>