<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "../components/CarouselComponent.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useRouter } from "vue-router";
import ShowCardComponent from "@/components/ShowCardComponent.vue";
import noImage from "../images/no-image.png";
const scopri = ref(false);
const router = useRouter();
const newProducts = ref([]);
const images = ref([]);
const landingImages = ref([
  "../carousel/l1.webp",
  "../carousel/l2.webp",
  "../carousel/l4.webp",
  "../carousel/l5.webp",
  "../carousel/l6.webp",
  "../carousel/l7.webp",
  "../carousel/l8.webp",
  "../carousel/l9.webp",
  "../carousel/l10.webp",
  "../carousel/l11.webp",
  "../carousel/l12.webp",
]);
let lastWidth = 0;
const MOBILE_QUERY = "(max-width: 970px)";
const mql = window.matchMedia(MOBILE_QUERY);

const isMobile = ref(mql.matches);

const onChange = (e) => {
  isMobile.value = e.matches;
  scopri.value = !e.matches; // desktop = aperto, mobile = chiuso
};

onMounted(() => mql.addEventListener("change", onChange));
onBeforeUnmount(() => mql.removeEventListener("change", onChange));
const setAppHeight = () => {
  if (lastWidth !== 0 && window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`,
  );
};

onMounted(() => {
  setAppHeight();
  window.addEventListener("resize", setAppHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setAppHeight);
});

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
    }),
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
      `,
    )
    .order("datetime", { ascending: false })
    .limit(3);
  if (error) {
    console.error(`Errore nel caricamento da dati:`, error);
    /* alert(
      "Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore.\n\nHomeView/getProducts\n" +
        error.details,
    );*/
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
    /*   alert(
      "Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore. " +
        error,
    );*/
    return [];
  }

  return data.map(
    (file) =>
      supabase.storage
        .from("productimages")
        .getPublicUrl(`${productOid}/${file.name}`).data.publicUrl,
  );
};
const openDetails = (id) => {
  router.push({ name: "prodotto", params: { id } });
};
</script>

<template>
  <a class="fab" href="https://wa.me/message/NFCCXXO6KJOHA1">
    <img src="../icons/whatsapp.svg" alt="Whatsapp" />
  </a>
  <div class="hero">
    <div class="hero-left">
      <picture>
        <source media="(max-width: 970px)" srcset="../images/hero.webp" />
        <img
          src="../images/hero-desktop.webp"
          alt="Meccanico"
          class="blur"
          fetchpriority="high"
          decoding="sync"
        />
      </picture>
    </div>
    <div class="hero-right">
      <h1>INSTALLAZIONI PERSONALIZZATE</h1>
      <p>
        Realizziamo impianti audio ad alte prestazioni, anche estremi,
        progettati su misura per ogni auto.
      </p>
      <transition name="fade-slide">
        <p v-if="scopri || !isMobile">
          Vendiamo al dettaglio prodotti selezionati. Installiamo radio CarPlay,
          retrocamere, dashcam e LED, lavorando sempre con il cliente per
          migliorare prestazioni, comfort, tecnologia e sicurezza di guida
          quotidiana.
        </p>
      </transition>
      <button
        v-if="isMobile"
        @click="scopri = !scopri"
        :class="scopri ? 'btn-inverted' : 'btn'"
      >
        <img src="../icons/up.svg" v-if="scopri" alt="comprimi" />
        <img src="../icons/down.svg" v-else alt="leggi di più" />
        {{ scopri ? "Comprimi" : "Leggi di più" }}
      </button>
    </div>
  </div>
  <div class="separator" id="servizi">
    <label class="separator-text">Cosa offriamo</label>
  </div>

  <div class="sez-a-card">
    <ShowCardComponent
      title="Realizzazione"
      description="Impianti audio"
      fullDescription="Offriamo servizi di preparazione per impianti audio ad alte prestazioni, progettati su misura per ogni auto."
      image="./img/audio.webp"
    />
    <ShowCardComponent
      title="Illuminazione"
      description="Abitacolo e interni"
      fullDescription="Realizziamo soluzioni di illuminazione personalizzate per abitacolo e interni, migliorando l'estetica e il comfort di guida."
      image="./img/light.webp"
    />
    <ShowCardComponent
      title="Installazione"
      description="Radio Aftermarket"
      fullDescription="Installiamo radio CarPlay, retrocamere, dashcam e LED, lavorando sempre con il cliente per migliorare prestazioni, comfort, tecnologia e sicurezza di guida quotidiana."
      image="./img/radio.webp"
    />
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
    <label class="separator-text">Su di noi</label>
  </div>
  <div class="sez-a-card">
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Mission</h2>
        <p class="card-b-description">
          Trasformiamo ogni auto in uno spazio più coinvolgente, potente e
          funzionale, realizzando impianti audio DJ estremi e upgrade
          tecnologici su misura. Lavoriamo con passione e confronto diretto per
          offrire soluzioni personalizzate adatte a ogni cliente.
        </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Vision</h2>
        <p class="card-b-description">
          Siamo un punto di riferimento nel car audio e nella personalizzazione
          automotive, offrendo soluzioni innovative e su misura. Puntiamo a
          crescere insieme ai nostri clienti, unendo tecnologia, prestazioni e
          cura dei dettagli in ogni progetto realizzato.
        </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Collab</h2>
        <p class="card-b-description">
          Collaboriamo con partner specializzati per detailing, oscuramento
          vetri, wrapping, assetti regolabili, freni sportivi e mappatura
          centralina su banco prova. Dalla prima modifica alla preparazione più
          estrema, accompagniamo ogni progetto con competenza e passione.
        </p>
      </div>
    </div>
  </div>
  <div class="separator">
    <label class="separator-text">Novità</label>
  </div>
  <div class="news">
    <ProductCard
      v-for="product in newProducts"
      :key="product.oid"
      :name="product.Manufacturers.name + ' - ' + product.name"
      :price="product.price > 0 ? product.price : 0"
      :description="product.description"
      :category="product.Categories.name"
      :available="product.available"
      :image="product.images?.[0] || noImage"
      @click="openDetails(product.id)"
    />
  </div>
  <div class="separator">
    <label class="separator-text" id="eventi">Prossimi eventi</label>
  </div>
  <div class="sez-a">
    <div class="not-found" v-if="images.length == 0">
      <img src="../images/no-events.webp" alt="nessun evento" />
      <h2>Non ci sono eventi in programma</h2>
    </div>
    <CarouselComponent :images="images" v-else />
  </div>
</template>
<style scoped>
/* ---------- FAB ---------- */
.fab {
  display: flex;
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  right: calc(20px + env(safe-area-inset-right, 0px));
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px;
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

/* ---------- Transizione testo hero ---------- */
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
}

/* ---------- Hero ---------- */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding: 80px 50px;
  box-sizing: border-box;
}

.hero-left,
.hero-right {
  min-width: 0;
}

.hero-right {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.hero-left img {
  width: 100%;
  max-height: 900px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}

.hero h1 {
  color: var(--color-text);
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: fit-content;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-on-primary);
  transition: all 0.3s ease;
}

/* pieno */
.hero .btn {
  background-color: var(--color-primary);
  border: 2px solid transparent;
}

/* contorno */
.hero .btn-inverted {
  background-color: transparent;
  border: 2px solid var(--color-primary);
}

/* hover solo su dispositivi con mouse */
@media (hover: hover) {
  .hero .btn:hover {
    background-color: transparent;
    border-color: var(--color-primary);
  }

  .hero .btn-inverted:hover {
    background-color: var(--color-primary);
    border-color: transparent;
  }
}

/* ---------- Sezioni ---------- */
.sez-a,
.sez-a-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.sez-a {
  align-items: center;
}

.sez-a-card {
  align-items: stretch;
  flex-wrap: wrap;
}

.sez-ab {
  width: 100%;
}

.carousel-padder {
  padding: 0 20px;
}

.news {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

/* ---------- Separator ---------- */
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

/* ---------- Card Mission / Vision / Collab ---------- */
.card-b {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  flex: 1 1 300px;
  box-sizing: border-box;
  background-color: var(--color-container);
  border: 1px solid var(--color-container-border);
  border-radius: 16px;
}

.card-b-text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px;
  z-index: 2;
}

.card-b-title {
  color: var(--color-primary-light);
  font-size: 28px;
  font-weight: 600;
}

.card-b-description {
  color: var(--color-text);
  font-size: 22px;
  text-align: justify;
  hyphens: none;
  overflow-wrap: normal;
  word-break: normal;
}

/* ---------- Nessun evento ---------- */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  color: var(--color-text);
}

.not-found img {
  width: 400px;
  max-width: 100%;
  margin-bottom: 20px;
}

/* ---------- Animazioni ---------- */
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

/* =========================================================
   RESPONSIVE (dal breakpoint più grande al più piccolo)
   ========================================================= */
@media (max-width: 1000px) {
  .sez-a {
    flex-direction: column;
  }
}

@media (max-width: 970px) {
  .hero {
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    gap: 0;
    padding: 0;
    overflow: hidden;
    min-height: calc(100vh - var(--top-appbar-height, 70px));
    min-height: calc(100svh - var(--top-appbar-height, 70px));
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.78);
    z-index: 1;
  }

  .hero-left {
    display: block; /* Non più none */
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .hero-left picture,
  .hero-left img {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    object-fit: cover;
  }

  .hero-right {
    position: relative;
    z-index: 2;
    padding: 30px 20px;
    gap: 20px;
  }

  .news {
    flex-direction: column;
  }

  .card-b-text-container {
    padding: 30px;
  }

  .card-b-description {
    font-size: 18px;
    line-height: 1.6;
    text-align: left;
    word-break: normal;
  }

  .not-found img {
    width: 250px;
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 32px;
  }

  .hero-right {
    padding: 40px 10px;
  }
}
</style>
