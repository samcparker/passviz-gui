<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="color"
          dark
          v-bind="attrs"
          v-on="on"
        >

        </v-btn>

      </template>

      <v-card>
          <v-color-picker v-model="color"></v-color-picker>
      </v-card>
    </v-menu>
</template>

<script>
export default {
    data: () => {
        return {
            menu: false,
        }
    },
    props: {
        color: String,
    },
    methods: {
    },
}
</script>

<style>

</style>