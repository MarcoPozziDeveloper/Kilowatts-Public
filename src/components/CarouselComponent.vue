<script setup>
import { ref, onMounted, watch } from "vue";

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
    // Centra l'immagine corrente
    const translateX = -currentIndex.value * 100;
    track.value.style.transform = `translateX(${translateX}%)`;
  }
};

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  update();
};

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
  update();
};

const goToSlide = (index) => {
  currentIndex.value = index;
  update();
};

// Calcola l'indice dell'immagine precedente
const prevIndex = () => (currentIndex.value - 1 + props.images.length) % props.images.length;

// Calcola l'indice dell'immagine successiva  
const nextIndex = () => (currentIndex.value + 1) % props.images.length;

onMounted(() => {
  update();
});

watch(() => props.images, () => {
  update();
}, { deep: true });
</script>

<template>
  <div class="carousel">
    <!-- Immagine precedente (sinistra) -->
    <div class="side-image left-image" v-if="images.length > 1" @click="prev">
      <img :src="images[prevIndex()]" :alt="`Image ${prevIndex() + 1}`" />
    </div>

    <!-- Contenitore principale -->
    <div class="carousel-main">
      <button class="carousel-btn left" @click="prev" v-if="images.length > 1" aria-label="Precedente">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <div class="carousel-track-container">
        <div class="carousel-track" ref="track">
          <img v-for="(img, i) in images" :key="i" :src="img" :alt="`Image ${i + 1}`" class="carousel-image"
            :class="{ active: i === currentIndex }" />
        </div>
      </div>

      <button class="carousel-btn right" @click="next" v-if="images.length > 1" aria-label="Successivo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Immagine successiva (destra) -->
    <div class="side-image right-image" v-if="images.length > 1" @click="next">
      <img :src="images[nextIndex()]" :alt="`Image ${nextIndex() + 1}`" />
    </div>

  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-main {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.carousel-track-container {
  overflow: hidden;
  width: 100%;
  border-radius: 12px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.carousel-image {
  width: 100%;

  object-fit: contain;
  flex-shrink: 0;
}

/* Immagini laterali */
.side-image {
  width: 120px;
  height: 200px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0.7;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.side-image:hover {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.side-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.left-image {
  order: -1;
}

.right-image {
  order: 1;
}

/* Bottoni di navigazione */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #333;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.carousel-btn svg {
  filter: brightness(20);
}

.carousel-btn:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.carousel-btn.left {
  left: 15px;
}

.carousel-btn.right {
  right: 15px;
}

/* Indicatori */
.carousel-indicators {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}


/* Responsive - Mobile */
/* Responsive - Mobile */
@media (max-width: 600px) {
  .carousel {
    gap: 0;
    padding: 0;
    max-width: 100%;
    flex-direction: column;
  }

  /* Nascondi le immagini laterali su mobile molto piccoli */
  .side-image {
    display: none;
  }

  .carousel-main {
    width: 100%;
    border-radius: 0;
    position: relative;
    padding-bottom: 60px;
    box-shadow: none;
  }

  .carousel-track-container {
    border-radius: 0;
    width: 100%;
  }

  .carousel-track {
    width: 100%;
  }

  .carousel-image {
  
 
  }

  .carousel-btn {
    width: 44px;
    height: 44px;
    background-color: rgba(0, 0, 0, 0.3);
    top: auto;
    bottom: 8px;
    transform: none;
  }

  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }

  .carousel-btn.left {
    left: 50%;
    margin-left: -54px;
  }

  .carousel-btn.right {
    right: 50%;
    margin-right: -54px;
  }

  .carousel-btn:hover {
    transform: scale(1.05);
  }
}
</style>