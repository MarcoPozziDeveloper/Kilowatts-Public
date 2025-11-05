<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "../components/CarouselComponent.vue";

const images = ref([])
const landingImages = ref([
  "../img/li1.png",
  "../img/li2.png",
  "../img/li3.png"

]);
onMounted(async () => {
  const { data: files, error } = await supabase.storage
    .from('posters')
    .list('', { limit: 100 })

  if (error) {
    console.error('Errore caricamento immagini:', error)
    return
  }

  images.value = files.map((file) => {
    const { data } = supabase.storage
      .from('posters')
      .getPublicUrl(file.name)
    return data.publicUrl
  })
})
</script>

<template>
  <div class="hero">
    <div class="hero-left">
      <img src="../images/hero.png" alt="Meccanico che installa impianto stereo">
    </div>
    <div class="hero-right">
      <h1>IMPIANTI STEREO MODIFICATI</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla eleifend nisi, vitae dapibus nisi
        tristique vitae.</p>
      <a href="#servizi" class="btn">Scopri di più</a>
    </div>
  </div>
  <div class="separator" id="servizi">
    <label class="separator-text">Cosa offriamo</label>
  </div>

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
  <CarouselComponent :images="landingImages" />
  <div class="separator">
    <label class="separator-text">Chi siamo</label>
  </div>
  <div class="sez-a">
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">La mission</h2>
        <p class="card-b-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla eleifend
          nisi, vitae dapibus nisi tristique vitae. Integer sed vehicula sem. Praesent volutpat, ipsum vitae lacinia
          mattis, sapien ex cursus velit, ac ullamcorper enim justo ac lacus. Maecenas porta diam. </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Riconoscimenti</h2>
        <p class="card-b-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla eleifend nisi, vitae dapibus nisi
          tristique vitae. Integer sed vehicula sem. Praesent volutpat, ipsum vitae lacinia mattis, sapien ex cursus
          velit, ac ullamcorper enim justo ac lacus. Maecenas porta diam. </p>
      </div>
    </div>
  </div>
  <div class="separator">
    <label class="separator-text">Prossimi eventi</label>
  </div>
  <CarouselComponent :images="images" id="eventi" />
</template>
<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding: 80px 50px;
}

.hero-left {
  animation: slideInLeft 1s ease-out forwards;
}

.hero-right {
  animation: slideInRight 1s ease-out forwards;
}

.hero-left img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 500px;
}

.hero-right {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 500px;
}

.hero h1 {
  color: var(--color-text);
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
}

.hero p {
  color: #cccccc;
  font-size: 18px;
  line-height: 1.5;
}

.hero .btn {

  background-color: #007bff;
  color: white;
  padding: 15px 30px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  text-transform: uppercase;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: fit-content;
}

.hero .btn:hover {
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

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

.card-b {
  background-color: var(--color-container);
  border: 1px solid var(--color-container-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-height: 400px;
}

.card-b-text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px;
  bottom: 0;
  z-index: 2;
  /* sopra il gradiente */
}

.card-b-title {
  color: var(--color-primary-light);
  font-size: 32px;
  font-weight: 600;
}

.card-b-description {
  color: var(--color-text);
  font-size: 24px;
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
  z-index: 2;
  /* sopra il gradiente */
}

.card-title {
  color: var(--color-primary-light);
  font-size: 32px;
  font-weight: 600;
}

.card:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
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



@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
