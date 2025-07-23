<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "../components/CarouselComponent.vue";

const images = ref([])

onMounted(async () => {
  const { data: files, error } = await supabase.storage
    .from('landingimages')
    .list('', { limit: 100 })

  if (error) {
    console.error('Errore caricamento immagini:', error)
    return
  }

  images.value = files.map((file) => {
    const { data } = supabase.storage
      .from('landingimages')
      .getPublicUrl(file.name)
    return data.publicUrl
  })
})
</script>

<template>
  <div class="sez-a">
    <div class="card">
      <div class="image-container">
        <img src="../images/audio.jpg" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Preparazione</h2>
        <p class="card-description">Impianti audio</p>
      </div>
    </div>

    <div class="card">
      <div class="image-container">
        <img src="../images/light.jpg" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Installazione</h2>
        <p class="card-description">Illuminazioni abitacolo</p>
      </div>
    </div>

    <div class="card">
      <div class="image-container">
        <img src="../images/radio.jpg" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Montaggio</h2>
        <p class="card-description">Radio Aftermarket</p>
      </div>
    </div>
  </div>
  <div class="separator">
    <label class="separator-text">I nostri lavori</label>
  </div>
    <CarouselComponent :images="images" />
</template>
<style scoped>
.sez-a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  padding: 20px;
}
.card {
  background-color: var(--color-container);
  border: 1px solid var(--color-container-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
  position: relative;
  flex: 1;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 400px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, black 100%);
  z-index: 1;
}

.card-text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px;
  position: absolute;
  bottom: 0;
  z-index: 2; /* sopra il gradiente */
}

.card-title {
  color: var(--color-primary);
  font-size: 32px;
  font-weight: 600;
}

.card-description {
  color: var(--color-text);
  font-size: 24px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 40px 0;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--color-container-border);
}
.separator-text {
  padding: 0 20px;
  font-size: 16px;
  color: var(--color-text);
}
</style>
