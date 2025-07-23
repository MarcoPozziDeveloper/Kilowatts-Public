<script setup>
import { ref, watch, onMounted } from "vue";

defineProps({
  images: Array
});

const currentIndex = ref(0);
const track = ref(null);

const update = () => {
  if (track.value) {
    track.value.style.transform = `translateX(-${currentIndex.value * 100}%)`;
  }
};

const prev = () => {
  if (!props.images.length) return;
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  update();
};

const next = () => {
  if (!props.images.length) return;
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
  update();
};

watch(
  () => props.images,
  () => {
    currentIndex.value = 0;
    update();
  }
);

onMounted(() => {
  update();
});
</script>

<template>
  <div class="carousel">
    <button class="carousel-btn left" @click="prev">
      <img src="./src/icons/angle_left.svg" alt="Prev" />
    </button>

    <div class="carousel-track-container">
      <div class="carousel-track" ref="track">
        <img
          v-for="(img, i) in images"
          :key="i"
          :src="img"
          :alt="`Image ${i + 1}`"
        />
      </div>
    </div>

    <button class="carousel-btn right" @click="next">
      <img src="./src/icons/angle_right.svg" alt="Next" />
    </button>
  </div>
</template>

<style scoped>
/* ...stesso stile che hai già */
.carousel {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: auto;
  overflow: hidden;
}

.carousel-track-container {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-track img {
  width: 100%;
  flex-shrink: 0;
  object-fit: cover;
}

/* --- Posizionamento dei bottoni sul carosello --- */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;

  cursor: pointer;
  z-index: 2;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn img {
  width: 64px;
  height: 64px;
}

.carousel-btn.left {
  left: 0px;
}

.carousel-btn.right {
  right: 0px;
}
</style>
