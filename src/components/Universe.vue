<template>
  <div id="universe">
      <p>{{ name }}</p>
  </div>
</template>

<script>
// import d3 from "@d3";

export default {

    data: () => {
        return {}
    },
    props: {
        name: String,
    },
    mounted() {
        console.log("hello");
    }

}
</script>

<style>
#universe {
    height: 100%;
    background-color: red;
    color: red;
}
</style>