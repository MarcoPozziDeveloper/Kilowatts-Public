<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import CarouselComponent from "@/components/CarouselComponent.vue";
const route = useRoute();
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
    .eq("id", id)
    .single();
  if (error) {
    console.error("Errore nel caricamento del prodotto:", error);
    return {};
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
      <p class="product-category">Categoria: {{ productData.Categories.name }}</p>
      <p class="product-price">{{ productData.price > 0 ? '€' + productData.price.toFixed(2) : 'Prezzo: ??' }}</p>
      <p class="product-description">{{ productData.description }}</p>
      <p class="product-availability"
        :style="{ color: productData.available ? 'var(--color-green)' : 'var(--color-red)' }">
        {{ productData.available ? 'Disponibile' : 'Non Disponibile' }}</p>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.carousel-wrapper {
  width: 100%;
  max-width: 400px;
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
  color: var(--color-primary);
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
</style>