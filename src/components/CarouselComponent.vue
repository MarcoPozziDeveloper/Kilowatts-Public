<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});
const currentIndex = ref(0);
const track = ref(null);
const update = () => {
  if (track.value && props.images.length > 0) {
    // Impostiamo la variabile CSS per il numero di immagini
    track.value.style.setProperty('--image-count', props.images.length);
    // Il track deve essere largo quanto tutte le immagini affiancate
    track.value.style.width = `${props.images.length * 100}%`;
    // Ogni step sposta di una larghezza completa del contenitore
    track.value.style.transform = `translateX(-${currentIndex.value * (100 / props.images.length)}%)`;
  }
};
const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  update();
};
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
  update();
};
onMounted(() => {
  update();
});
</script>
<template>
  <div class="carousel">
    <button class="carousel-btn left" @click="prev" v-if="images.length > 1">
      <img src="../icons/angle_left.svg" alt="Prev" />
    </button>
   
    <div class="carousel-track-container">
      <div class="carousel-track" ref="track">
        <img
          v-for="(img, i) in images"
          :key="i"
          :src="img"
          :alt="`Image ${i + 1}`"
          class="carousel-image"
        />
      </div>
    </div>
   
    <button class="carousel-btn right" @click="next" v-if="images.length > 1">
      <img src="../icons/angle_right.svg" alt="Next" />
    </button>
  </div>
</template>
<style scoped>
.carousel {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: auto;
  overflow: hidden;
  border-radius: 8px;
}
.carousel-track-container {
  overflow: hidden;
  width: 100%;
}
.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  /* La larghezza viene impostata dinamicamente via JavaScript */
}
.carousel-image {
  /* Ogni immagine deve occupare una frazione della larghezza totale del track */
  width: calc(100% / var(--image-count, 1));
  height: 400px;
  object-fit: contain;
  flex-shrink: 0;
  flex-grow: 0;
}
/* Posizionamento dei bottoni */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 2;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}
.carousel-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.carousel-btn img {
  width: 32px;
  height: 32px;
  filter: invert(1); /* Rende le icone bianche */
}
.carousel-btn.left {
  left: 10px;
}
.carousel-btn.right {
  right: 10px;
}
</style>