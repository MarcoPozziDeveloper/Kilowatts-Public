<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "../components/CarouselComponent.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const newProducts = ref([]);
const images = ref([]);
const landingImages = ref([
  "../img/li1.png",
  "../img/li2.png",
  "../img/li3.png",
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
  <div class="hero">
    <div class="hero-left">
      <img
        src="../images/hero-desktop.webp"
        alt="Meccanico che installa impianto stereo"
      />
    </div>
    <div class="hero-right">
      <h1>IMPIANTI STEREO AD HOC</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fringilla
        eleifend nisi, vitae dapibus nisi tristique vitae.
      </p>
      <a href="#servizi" class="btn">Scopri di più</a>
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
        <p class="card-b-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          fringilla eleifend nisi, vitae dapibus nisi tristique vitae. Integer
          sed vehicula sem. Praesent volutpat, ipsum vitae lacinia mattis,
          sapien ex cursus velit, ac ullamcorper enim justo ac lacus. Maecenas
          porta diam.
        </p>
      </div>
    </div>
    <div class="card-b">
      <div class="card-b-text-container">
        <h2 class="card-b-title">Riconoscimenti</h2>
        <p class="card-b-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          fringilla eleifend nisi, vitae dapibus nisi tristique vitae. Integer
          sed vehicula sem. Praesent volutpat, ipsum vitae lacinia mattis,
          sapien ex cursus velit, ac ullamcorper enim justo ac lacus. Maecenas
          porta diam.
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
      :image="product.images[0] || './img/no-image.png'"
      @click="openDetails(product.id)"
    />
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
  .sez-a {
    flex-direction: column;
  }

  .hero {
    padding: 0;
    flex-direction: column;
    background-image: url("../images/hero.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    height: 75vh;
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
    font-size: 28px;
  }

  .card-b-description {
    font-size: 20px;
  }

  .news {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .sez-a {
    padding: 0;
    flex-direction: column;
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
    max-height: auto;
  }

  .card-b-text-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 30px;
    bottom: 0;
    z-index: 2;
    text-align: justify;
    text-justify: inter-word;
  }

  .card-b-title {
    color: var(--color-primary-light);
    font-size: 28px;
    font-weight: 600;
  }

  .card-b-description {
    color: var(--color-text);
    font-size: 20px;
  }
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
