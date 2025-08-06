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
  <CarouselComponent :images="images" />

  <div class="separator">
    <label class="separator-text"></label>
  </div>
  <div class="footer">
    <div class="footer-element">
      <label class="footer-title"> Come ci trovi</label>
      <div class="footer-list">
        <div class="footer-row">
          <img src="../icons/clock.svg" alt="Orario" />
          <label class="footer-text">14:00-19:00 | Lunedì-Sabato</label>
        </div>
        <a href="https://maps.app.goo.gl/2vtuVn9tbHBYb1tY8" class="footer-row">
          <img src="../icons/location.svg" alt="Posizione" />
          <label class="footer-text">Via Cadorna 55 Buscate VA</label>
        </a>
      </div>
    </div>
    <div class="footer-element">
      <label class="footer-title">Contatti</label>
      <div class="footer-list">
        <a href="tel:+393421263387" class="footer-row">
          <img src="../icons/phone.svg" alt="Telefono" />
          <label class="footer-text">+39 342 126 3387</label>
        </a>

        <a class="footer-row" href="mailto:kilowatts.industries@gmail.com ">
          <img src="../icons/mail.svg" alt="Mail" />
          <label class="footer-text"> kilowatts.industries@gmail.com </label>
        </a>

      </div>
    </div>
  </div>

</template>
<style scoped>
.sez-a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  /*max-width: 1200px;*/  
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
  color: var(--color-primary);
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
  color: var(--color-primary);
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

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: var(--color-bg);
  width: 100%;
}

.footer-element {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-title {
  font-size: 24px;
  color: var(--color-primary);
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  text-decoration: none;

}

.footer-row img,
.footer-row label {
  cursor: pointer;
}
.footer-row img,
.footer-row label:hover {
  text-decoration: underline;
}
</style>
