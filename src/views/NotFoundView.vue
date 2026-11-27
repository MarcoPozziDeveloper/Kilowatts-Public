<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="not-found">
    <div class="overlay">
      <h1>404</h1>
      <p>La pagina che stai cercando non esiste.</p>
    </div>

    <img src="../images/404.webp" alt="404" />

    <button @click="goHome" class="input-default">Torna alla home</button>
  </div>
</template>

<style scoped>
.not-found {
  width: 100%;
  margin-top: var(--top-appbar-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.not-found img {
  max-width: 500px;
  width: 100%;
}

.overlay {
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 48px;
}

p {
  margin: 0;
}
button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
