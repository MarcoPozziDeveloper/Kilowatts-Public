<script setup>
import { RouterView } from "vue-router";
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
</script>

<template>
  <div class="main">
    <NavbarComponent />
    <div class="main-app">
      <RouterView :key="$route.params.id" />
      <FooterComponent />
    </div>
  </div>
</template>

<style>
.main-app {
  @import url("./styles/main.css");
  padding-top: var(--top-appbar-height);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
