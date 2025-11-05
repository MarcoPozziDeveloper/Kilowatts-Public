<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";
import SelectComponent from "@/components/SelectComponent.vue";

const router = useRouter();
const categories = ref([]);
const manufacturers = ref([]);
const products = ref([]);
const refreshToken = ref(0);
const search = ref("");
const sortBy = ref("0");
const productData = ref({
  name: "",
  description: "",
  price: null,
  category_id: "",
  manufacturer_id: "",
});

const loadData = async () => {
  refreshToken.value++;
  const rawProducts = await getProducts();
  categories.value = productData.Categories;
  manufacturers.value = productData.Manufacturers;
  // Aggiunge le immagini a ogni prodotto
  const productsWithImages = await Promise.all(
    rawProducts.map(async (product) => {
      const images = await getImagesForProduct(product.oid);
      return { ...product, images };
    })
  );

  products.value = productsWithImages;
};



const getProducts = async () => {
  const { data, error } = await supabase
    .from('Products')
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
      id
    `)
    .order('datetime', { ascending: false });
  if (error) {
    console.error(`Errore nel caricamento da dati:`, error);
    alert(
      "Si e' verficato un errore. Fai una foto a questo messaggio e inviala allo sviluppatore. " +
      error
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

// Computed property per filtrare e ordinare i prodotti
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Filtro per ricerca testuale
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.manufacturer_name.toLowerCase().includes(searchLower)
    );
  }

  // Filtro per prezzo massimo
  if (productData.value.price !== null && productData.value.price !== "") {
    result = result.filter((product) => product.price <= productData.value.price);
  }

  // Filtro per manufacturer
  if (productData.value.manufacturer_id) {
    result = result.filter(
      (product) => product.manufacturer_id === productData.value.manufacturer_id
    );
  }

  // Filtro per categoria
  if (productData.value.category_id) {
    result = result.filter(
      (product) => product.category_id === productData.value.category_id
    );
  }

  // Ordinamento
  switch (sortBy.value) {
    case "0": // Nome
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "1": // Prezzo Decrescente
      result.sort((a, b) => b.price - a.price);
      break;
    case "2": // Prezzo Crescente
      result.sort((a, b) => a.price - b.price);
      break;
    case "3": // Categoria
      result.sort((a, b) => a.category_name.localeCompare(b.category_name));
      break;
    case "4": // Produttore
      result.sort((a, b) => a.manufacturer_name.localeCompare(b.manufacturer_name));
      break;
  }

  return result;
});

const openDetails = (id) => {
  router.push({ name: "prodotto", params: { id } });
};

onMounted(loadData);
</script>

<template>
  <form @submit.prevent="submitProduct" class="left-pannel">
    <div class="input-group">
      <label>Cerca parole chiave</label>
      <div class="input-sub-group">
        <input class="generic-input" type="text" v-model="search" placeholder="Cerca..." />
        <img class="search-icon" src="../images/lens.svg" alt="Search" />
      </div>
    </div>

    <div class="input-group">
      <label>Ordina per</label>
      <select class="generic-input" v-model="sortBy">
        <option value="0">Nome</option>
        <option value="1">Prezzo Decrescente</option>
        <option value="2">Prezzo Crescente</option>
        <option value="3">Categoria</option>
        <option value="4">Produttore</option>
      </select>
    </div>

    <div class="input-group">
      <label>Prezzo massimo</label>
      <input class="generic-input" v-model.number="productData.price" type="number" step="0.01" min="0"
        placeholder="Max" />
    </div>

    <div class="input-group">
      <label>Fornitore</label>
      <SelectComponent tableName="Manufacturers" label="Produttore" :refreshToken="refreshToken"
        @selected="productData.manufacturer_id = $event" />
    </div>

    <div class="input-group">
      <label>Categoria</label>
      <SelectComponent tableName="Categories" label="Categorie" :refreshToken="refreshToken"
        @selected="productData.category_id = $event" />
    </div>
  </form>

  <div class="products">
    <ProductCard v-for="product in filteredProducts" :key="product.oid"
      :name="product.Manufacturers.name + ' - ' + product.name" :price="product.price > 0 ? product.price : 0"
      :description="product.description" :category="product.Categories.name"
      :image="product.images[0] || './img/no-image.png'" @click="openDetails(product.id)" />
  </div>
</template>

<style scoped>
.input-sub-group {
  display: flex;
  position: relative;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.generic-input {
  border: none;
  border-bottom: 1px solid var(--color-text);
  background-color: var(--color-input-background);
  font-size: 16px;
  padding: 6px 32px 6px 6px;

  /* spazio extra a destra per l’icona */
  color: var(--color-text);
  width: 100%;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.generic-input:focus {
  outline: none;
  border-bottom: 2px solid var(--color-primary);
}

.input-group label {
  padding-left: 6px;
}

.left-pannel {
  position: fixed;
  top: var(--top-appbar-height);
  left: 0;
  bottom: 0;
  height: calc(100vh - var(--footer-height));
  width: var(--left-pannel-width);

  padding: 50px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 100px;
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  margin-left: var(--left-pannel-width);
  width: calc(100% - (var(--left-pannel-width)));
  /* Spazio per il form */
}
</style>
