<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  fullDescription: String,
  image: String
});

const open = ref(false);

function toggle() {
  open.value = !open.value;
}
</script>

<template>
  <div class="card" @click="toggle">
    <div class="image-container" :class="{ open }">
      <img :src="image" alt="image" />
    </div>

    <div class="card-text-container" :class="{ hidden: open }">
      <h2 class="card-title">{{ title }}</h2>
      <p class="card-description">{{ description }}</p>
    </div>

    <div class="card-text-container" :class="{ hidden: !open }">
      <p>{{ fullDescription }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-container);
  border: 1px solid var(--color-container-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
  position: relative;
  flex: 1 1 300px;
  cursor: pointer;
  

}

.image-container {
  position: relative;
  width: 100%;

  
  transition: filter 0.4s ease, transform 0.4s ease;
}

.image-container {
  position: relative;
  width: 100%;
  height: 400px; /* o quello che vuoi */
  overflow: hidden;
  transition: filter 0.4s ease, transform 0.4s ease;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-container.open {
  filter: blur(4px) brightness(0.4);
  transform: scale(1.05);
}

.card-title {
  color: var(--color-primary-light);
  font-size: 32px;
  font-weight: 600;
}

.card-description {
  color: var(--color-text);
  font-size: 22px;
}


.hidden {
  display: none;
}
p{
    color: var(--color-text);
    font-size: 20px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>