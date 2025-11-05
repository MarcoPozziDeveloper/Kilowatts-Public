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
const productData = ref({});
const images = ref([]);
const router = useRouter();
onMounted(async () => {
  productData.value = await getProduct(id);
  images.value = await getImagesForProduct(productData.value.oid);
});
const uploading = ref(false);

const getProduct = async (id) => {
  const { data, error } = await supabase
    .from("vw_products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Errore nel caricamento del prodotto:", error);
    alert("Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore. " + error.message);

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




const reduceImageSize = (canvas, ctx, originalImg, maxSizeKB, resolve, fileName) => {
  const currentWidth = canvas.width;
  const currentHeight = canvas.height;

  // Riduci le dimensioni del 20% ad ogni iterazione
  const newWidth = Math.floor(currentWidth * 0.8);
  const newHeight = Math.floor(currentHeight * 0.8);

  // Dimensioni minime per evitare immagini troppo piccole
  if (newWidth < 100 || newHeight < 100) {
    console.log("Dimensioni minime raggiunte, accetto la dimensione attuale");
    canvas.toBlob((blob) => {
      const compressedFile = new File([blob], fileName.replace(/\.(png|jpe?g|bmp|tiff?)$/i, '.webp'), {
        type: 'image/webp',
        lastModified: Date.now(),
      });
      resolve(compressedFile);
    }, 'image/webp', 0.1);
    return;
  }

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(originalImg, 0, 0, newWidth, newHeight);

  canvas.toBlob((blob) => {
    const sizeKB = blob.size / 1024;
    console.log(`Ridimensionamento: ${newWidth}x${newHeight}, dimensione: ${sizeKB.toFixed(2)}KB`);

    if (sizeKB <= maxSizeKB) {
      const compressedFile = new File([blob], fileName.replace(/\.(png|jpe?g|bmp|tiff?)$/i, '.webp'), {
        type: 'image/webp',
        lastModified: Date.now(),
      });
      resolve(compressedFile);
    } else {
      // Continua a ridurre
      reduceImageSize(canvas, ctx, originalImg, maxSizeKB, resolve, fileName);
    }
  }, 'image/webp', 0.3);
};

</script>

<template>
  <MessageBoxComponent :active="uploading" message="Caricamento in corso, attendere prego..." />


  <div class="main-container">

    <CarouselComponent :images="images" id="Foto" />

    <div class="product-details">
      <h2 class="product-name">{{ productData.manufacturer_name }} - {{ productData.name }}</h2>
      <p class="product-category">Categoria: {{ productData.category_name }}</p>
      <p class="product-price">{{ productData.price > 0 ? '€' + productData.price.toFixed(2) : 'Prezzo: ??' }}</p>
      <p class="product-description">{{ productData.description }}</p>
      <p class="product-category"></p>

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

}

.product-description {
  color: #ccc;
  white-space: pre-wrap;
}

.product-category {
  font-weight: 600;
}
</style>
