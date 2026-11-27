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
    </div>
  </div>
  <FooterComponent />
</template>

<style>
@import url("./styles/themes.css");
@import url("./styles/index.css");

.main-app {
  padding-top: var(--top-appbar-height);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
