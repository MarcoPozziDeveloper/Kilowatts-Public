<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, handleError } from "vue";

import { supabase } from "../lib/supabaseClient";
import { useRouter } from "vue-router";
import SelectComponent from "@/components/SelectComponent.vue";
import MessageBoxComponent from "@/components/MessageBoxComponent.vue";
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
const router = useRouter();
onMounted(async () => {
  productData.value = await getProduct(id);
  images.value = await getImagesForProduct(productData.value.oid);
});
const uploading = ref(false);

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
  <MessageBoxComponent :active="uploading" message="Caricamento in corso, attendere prego..." />


  <div class="main-container">

    <CarouselComponent :images="images" id="Foto" />

    <div class="product-details">
      <h2 class="product-name">{{ productData.Manufacturers.name }} - {{ productData.name }}</h2>
      <p class="product-category">Categoria: {{ productData.Categories.name }}</p>
      <p class="product-price">{{ productData.price > 0 ? '€' + productData.price.toFixed(2) : 'Prezzo: ??' }}</p>
      <p class="product-description">{{ productData.description }}</p>
      <p class="product-category"></p>
      <p class="product-availability" :style="{ color: productData.available ? 'var(--color-green)' : 'var(--color-red)' }">
        {{ productData.available ? 'Disponibile' : 'Non Disponibile' }}</p>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.product-card {
  background-color: var(--input-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: var(--text-color);
  width: 100%;
  max-width: 300px;
  transition: transform 0.2s ease;
  width: var(--left-pannel-width);
}

.product-card:hover {
  cursor: pointer;
  box-shadow: 0px 6px 15px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.product-card:hover {
  transform: scale(1.03);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
}

.product-details {
  padding: 15px;
  gap: 10px;
  display: flex;
  flex-direction: column;
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
