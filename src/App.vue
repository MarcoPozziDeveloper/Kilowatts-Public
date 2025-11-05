<script setup>
import { RouterView } from "vue-router";
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
</script>

<template>
  <div class="main">
    <NavbarComponent />
    <RouterView />
    <FooterComponent />
  </div>



</template>

<style>
@import url("./styles/themes.css");
@import url("./styles/index.css");
</style>
