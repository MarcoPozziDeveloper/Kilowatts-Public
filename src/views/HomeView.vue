<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "../components/CarouselComponent.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useRouter } from "vue-router";
const scopri = ref(false);
const router = useRouter();
const newProducts = ref([]);
const images = ref([]);
const landingImages = ref([
  "../carousel/l3.jpg",
  "../carousel/l1.jpg",
  "../carousel/l2.jpg",
  "../carousel/l4.jpg",
  "../carousel/l5.jpg",
  "../carousel/l6.jpg",
]);
onMounted(async () => {
  const { data: files, error } = await supabase.storage
    .from("posters")
    .list("", { limit: 100 });

  if (error) {
    console.error("Errore caricamento immagini:", error);
    return;
  }

  images.value = files.map((file) => {
    const { data } = supabase.storage.from("posters").getPublicUrl(file.name);
    return data.publicUrl;
  });
  const rawProducts = await getProducts();
  newProducts.value = await Promise.all(
    rawProducts.map(async (product) => {
      const images = await getImagesForProduct(product.oid);
      return { ...product, images };
    })
  );
});

const getProducts = async () => {
  const { data, error } = await supabase
    .from("Products")
    .select(
      `
        oid,
        name,
        description,
        price,
        datetime,
        category_id,
        manufacturer_id,
        Categories(name),
        Manufacturers(name),
        id,
        available 
      `
    )
    .order("datetime", { ascending: false })
    .limit(3);
  if (error) {
    console.error(`Errore nel caricamento da dati:`, error);
    alert(
      "Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore.\n\nHomeView/getProducts\n" +
      error.details
    );
    return [];
  }
  return data;
};

const getImagesForProduct = async (productOid) => {
  const { data, error } = await supabase.storage
    .from("productimages")
    .list(productOid, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    console.error(`Errore caricando immagini per ${productOid}:`, error);
    alert(
      "Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore. " +
      error
    );
    return [];
  }

  return data.map(
    (file) =>
      supabase.storage
        .from("productimages")
        .getPublicUrl(`${productOid}/${file.name}`).data.publicUrl
  );
};
const openDetails = (id) => {
  router.push({ name: "prodotto", params: { id } });
};
</script>

<template>
  <button class="fab">
    <img src="../icons/whatsapp.svg" alt="Filtri" />

  </button>
  <div class="hero">
    <div class="hero-left">
      <img src="../images/hero-desktop.webp" alt="Meccanico che installa impianto stereo" class="blur" />
    </div>
    <div class="hero-right">
      <h1>IMPIANTI STEREO AD HOC</h1>
      <p>
        Realizziamo impianti audio ad alte prestazioni, anche estremi, progettati su misura per ogni auto.
      </p>
      <transition name="fade-slide">
        <p v-if="scopri">
          Vendiamo al
          dettaglio prodotti selezionati. Installiamo radio CarPlay, retrocamere, dashcam e LED, lavorando sempre con il
          cliente per migliorare prestazioni, comfort, tecnologia e sicurezza di guida quotidiana.
        </p>
      </transition>
      <button " @click=" scopri = !scopri" :class="scopri ? 'btn-inverted' : 'btn'">
        <img src="../icons/up.svg" v-if="scopri" />
        <img src="../icons/down.svg" v-else />
        {{ scopri ? "Comprimi" : "Espandi" }}
      </button>
    </div>
  </div>
  <div class="separator" id="servizi">
    <label class="separator-text">Cosa offriamo</label>
  </div>

  <div class="sez-a">
    <div class="card">
      <div class="image-container">
        <img src="../images/audio.webp" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Preparazione</h2>
        <p class="card-description">Impianti audio</p>
      </div>
    </div>

    <div class="card">
      <div class="image-container">
        <img src="../images/light.webp" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Illuminazione</h2>
        <p class="card-description">Abitacolo e interni</p>
      </div>
    </div>

    <div class="card">
      <div class="image-container">
        <img src="../images/radio.webp" alt="Audio" />
      </div>

      <div class="card-text-container">
        <h2 class="card-title">Installazione</h2>
        <p class="card-description">Radio Aftermarket</p>
      </div>
    </div>

  </div>
  <div class="sez-ab">

    <div class="separator">
      <label class="separator-text">I nostri lavori</label>
    </div>
    <div class="carousel-padder">
      <CarouselComponent :images="landingImages" />
    </div>


  </div>



  <div class="separator">
    <label class="separator-text">Chi siamo</label>
  </div>
  <div class="sez-a">
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Mission</h2>
        <p class="card-b-description">
          Trasformiamo ogni auto in uno spazio più coinvolgente, potente e funzionale, realizzando impianti audio DJ
          estremi e upgrade tecnologici su misura. Lavoriamo con passione e confronto diretto per offrire soluzioni
          personalizzate adatte a ogni cliente.
        </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Vision</h2>
        <p class="card-b-description">
          Siamo un punto di riferimento nel car audio e nella personalizzazione automotive, offrendo soluzioni
          innovative e su misura. Puntiamo a crescere insieme ai nostri clienti, unendo tecnologia, prestazioni e cura
          dei dettagli in ogni progetto realizzato.
        </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Collab</h2>
        <p class="card-b-description">
          Collaboriamo con partner specializzati per detailing, oscuramento vetri, wrapping, assetti regolabili, freni
          sportivi e mappatura centralina su banco prova.
          Dalla prima modifica alla preparazione più estrema, accompagniamo ogni progetto con competenza e passione.
        </p>
      </div>
    </div>
  </div>
  <div class="separator">
    <label class="separator-text">Novità</label>
  </div>
  <div class="news">
    <ProductCard v-for="product in newProducts" :key="product.oid"
      :name="product.Manufacturers.name + ' - ' + product.name" :price="product.price > 0 ? product.price : 0"
      :description="product.description" :category="product.Categories.name" :available="product.available"
      :image="product.images[0] || './img/no-image.png'" @click="openDetails(product.id)" />
  </div>
  <div class="separator">
    <label class="separator-text" id="eventi">Prossimi eventi</label>
  </div>
  <div class="sez-a">
    <div class="not-found" v-if="images.length == 0">
      <img src="../images/no-events.webp" alt="" />
      <h2>Non ci sono eventi in programma</h2>
    </div>
    <CarouselComponent :images="images" v-else />
  </div>
</template>
<style scoped>
.fab {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-whatsapp);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999;

  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.fab:active {
  transform: scale(0.95);
}

.fab img {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}


.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  max-height: 500px;
  /* altezza massima stimata */
}

@media (min-width: 481px) {
  .not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    color: var(--color-text);
  }

  .not-found img {
    width: 400px;
    margin-bottom: 20px;
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
}

@media (max-width: 1000px) {
  .sez-a {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .hero-right {
    padding: 10px;
  }
}

@media (max-width: 970px) {
  .not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    color: var(--color-text);
  }

  .not-found img {
    width: 250px;
    margin-bottom: 20px;
  }



  .hero {
    padding: 0;
    flex-direction: column;
    background-image: url("../images/hero.webp");
    background-size: cover;

    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    min-height: calc(100vh - var(--top-appbar-height));
  }

  .hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }

  .hero-left {
    display: none;
  }

  .hero-right {
    position: relative;
    z-index: 2;
  }

  .card-b-title {
    font-size: 24px;
  }

 

  .news {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }



  .hero-left {
    display: none;
  }

  .card-b {
    background-color: var(--color-container);
    border: 1px solid var(--color-container-border);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .card-b-text-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 30px;
    bottom: 0;
    z-index: 2;

  }

  .card-b-title {
    color: var(--color-primary-light);
    font-size: 28px;
    font-weight: 600;
  }

  .card-b-description {
    color: var(--color-text);
    font-size: 18px;
    text-align: left;
    line-height: 1.6;
    word-break: normal;
  }

  .card-title {
    color: var(--color-primary-light);
    font-size: 28px;
    font-weight: 600;
  }


  .card-description {
    color: var(--color-text);
    font-size: 20px;
  }
}

.carousel-padder {
  padding: 0 20px;
}

.news {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

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

.hero .btn,
.hero .btn-inverted {
  gap: 10px;
  padding: 12px 20px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: fit-content;
}

.hero .btn {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 2px solid transparent;
}

.hero .btn:hover,
.hero .btn-inverted {
  background-color: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-on-primary);
}

.hero .btn-inverted:hover,
.hero .btn {
  background-color: var(--color-primary);
  border: 2px solid transparent;
  color: var(--color-on-primary);
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

.sez-ab {
  width: 100%;
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
