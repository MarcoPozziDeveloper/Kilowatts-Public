<script setup>
import { RouterView } from "vue-router";
import NavbarComponent from "./components/NavbarComponent.vue";
</script>

<template>
  <div class="main">
      <NavbarComponent />
        <RouterView />
  </div>



</template>

<style >
@import url("./styles/themes.css");
</style>
