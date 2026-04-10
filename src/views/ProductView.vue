<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "@/components/CarouselComponent.vue";
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const productData = ref({
  oid: "",
  name: "",
  description: "",
  price: "",
  datetime: "",
  Categories: {
    name: ""
  },
  Manufacturers: {
    name: ""
  },
  available: false
});
const images = ref([]);
onMounted(async () => {
  productData.value = await getProduct(id);
  images.value = await getImagesForProduct(productData.value.oid);
});

const getProduct = async (id) => {
  const { data: exists, error: rpcError } = await supabase.rpc(
    "product_exists",
    { p_id: id }
  );

  if (rpcError) {
    console.error("RPC error:", rpcError);
    return {};
  }

  if (exists !== true) {
    router.push("/not-found");
    return {};
  }

  const { data, error } = await supabase
    .from("Products")
    .select(`
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
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Errore nel caricamento del prodotto:", error);
    return {};
  }

  return data ?? {};
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
    alert("Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore. " + error.message);
    return [];
  }
  return data.map(
    (file) =>
      supabase.storage
        .from("productimages")
        .getPublicUrl(`${productOid}/${file.name}`).data.publicUrl
  );
};
</script>

<template>
  <div class="main-container">
    <div class="carousel-wrapper">
      <CarouselComponent :images="images" id="Foto" />
    </div>
    <div class="product-details">
      <h2 class="product-name">{{ productData.Manufacturers.name }} - {{ productData.name }}</h2>


      <p class="product-price">{{ productData.price > 0 ? '€' + productData.price.toFixed(2) : '0 €' }}</p>
      <p class="product-availability"
        :style="{ color: productData.available ? 'var(--color-green)' : 'var(--color-red)' }">
        {{ productData.available ? 'Disponibile' : 'Non Disponibile' }}</p>
      <p class="product-description">{{ productData.description }}</p>
      <p class="product-category">Categoria: {{ productData.Categories.name }}</p>
      <a class="mobile-filter-toggle"
        :href="`https://wa.me/393421263387?text=${encodeURIComponent('Buongiorno, vorrei un\'informazione riguardo a questo prodotto:\n' + productData.Manufacturers.name + ' - ' + productData.name + '\nkilowattsindustries.it' + $route.fullPath)}`"
        target="_blank" rel="noopener noreferrer">
        <img src="../icons/whatsapp.svg" alt="Info" />

        <span>Richiedi Info</span>
      </a>
    </div>
  </div>
</template>
<style scoped>
.carousel-image {
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .main-container {
    flex-direction: row;
    align-items: flex-start;
    max-width: 1200px;
    gap: 60px;
    padding: 40px;
  }

  .carousel-wrapper {
    flex: 1.2;
    /* un po' più largo dei dettagli */
    position: sticky;
    top: 20px;
  }

  .product-details {
    flex: 1;
  }
}

.product-name {
  font-size: 1.8rem;
}

.product-price {
  font-size: 1.5rem;
  color: var(--color-text);
}

.product-description {
  line-height: 1.8;
}



.mobile-filter-toggle {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  background-color: transparent;
  border: 1.5px solid var(--color-whatsapp);
  border-radius: 8px;
  color: var(--color-whatsapp);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  text-decoration: none;
  /* distanza dai testi sopra */
}

.mobile-filter-toggle:hover {
  background-color: var(--color-whatsapp);
  color: #000;
}

.mobile-filter-toggle:hover img {
  filter: brightness(0);
}

.mobile-filter-toggle img {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(64%) sepia(61%) saturate(400%) hue-rotate(95deg) brightness(95%);
  transition: filter 0.3s ease;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  max-width: 900px;
  /* più largo su desktop */
  margin: 0 auto;
}

.carousel-wrapper {
  width: 100%;
  /* niente più max-width, usa tutto */
  align-self: center;
}

.product-details {
  padding: 15px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
}

.product-name {
  font-size: 1.25rem;
  color: var(--color-primary-light);
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
}

.product-description {
  color: #ccc;
  white-space: pre-wrap;
}

.product-category {
  font-weight: 600;
}

@media (min-width: 768px) {
  .main-container {
    padding: 40px;
  }

  .product-name {
    font-size: 1.6rem;
  }

  .product-price {
    font-size: 1.3rem;
  }
}
</style>