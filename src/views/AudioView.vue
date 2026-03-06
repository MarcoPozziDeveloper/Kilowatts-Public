<script setup>
import { ref, onMounted, computed, watch } from "vue";
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
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const showFilters = ref(false);
const macroName = ref("Audio");
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
    }),
  );

  products.value = productsWithImages;
};

const getProducts = async () => {
  const from = (page.value - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("Products").select(
    `
      oid,
      name,
      description,
      price,
      datetime,
      category_id,
      manufacturer_id,
      Categories!inner(name, macrocategory),
      Manufacturers(name, macrocategory),
      id,
      available
    `,
    { count: "exact" },
  );
  query = query.eq("Categories.macrocategory", macroName.value);
  if (search.value) {
    query = query.or(
      `name.ilike.%${search.value}%,description.ilike.%${search.value}%`,
    );
  }

  if (productData.value.price) {
    query = query.lte("price", productData.value.price);
  }

  if (productData.value.category_id) {
    query = query.eq("category_id", productData.value.category_id);
  }

  if (productData.value.manufacturer_id) {
    query = query.eq("manufacturer_id", productData.value.manufacturer_id);
  }

  // Applica l'ordinamento in base a sortBy
  switch (sortBy.value) {
    case "0": // Nome
      query = query.order("name", { ascending: true });
      break;
    case "1": // Prezzo Decrescente
      query = query.order("price", { ascending: false });
      break;
    case "2": // Prezzo Crescente
      query = query.order("price", { ascending: true });
      break;
    case "3": // Categoria
      query = query.order("category_id", { ascending: true });
      break;
    case "4": // Produttore
      query = query.order("manufacturer_id", { ascending: true });
      break;
    default:
      query = query.order("datetime", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) return [];
  total.value = count;
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
      error,
    );
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

watch(
  [
    search,
    sortBy,
    () => productData.value.price,
    () => productData.value.category_id,
    () => productData.value.manufacturer_id,
  ],
  () => {
    page.value = 1;
    loadData();
  },
);

const totalPages = computed(() => Math.ceil(total.value / pageSize));

watch(page, loadData);

watch(page, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

onMounted(loadData);
</script>

<template>
  <button class="mobile-filter-toggle" @click="showFilters = !showFilters">
    <img src="../icons/filter.svg" alt="Filtri" v-if="!showFilters" />
    <span v-if="!showFilters">Filtri</span>
    <span v-else>✕ Chiudi</span>
  </button>
  <!-- Overlay for mobile -->
  <div class="overlay" v-if="showFilters" @click="showFilters = false"></div>

  <!-- Filter Panel -->
  <form @submit.prevent class="left-pannel" :class="{ show: showFilters }">
    <div class="filter-header">
      <h3>Filtri</h3>
      <button type="button" class="close-filters" @click="showFilters = false">
        ✕
      </button>
    </div>

    <div class="input-group desktop-only">
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
        <option value="4">Brand</option>
      </select>
    </div>

    <div class="input-group">
      <label>Prezzo massimo</label>
      <input class="generic-input" v-model.number="productData.price" type="number" step="0.01" min="0"
        placeholder="Max" />
    </div>

    <div class="input-group">
      <label>Brand</label>
      <SelectComponent tableName="Manufacturers" label="Produttore" :refreshToken="refreshToken"
        @selected="productData.manufacturer_id = $event" :macroName="macroName" />
    </div>

    <div class="input-group">
      <label>Categoria</label>
      <SelectComponent tableName="Categories" label="Categorie" :refreshToken="refreshToken" :macroName="macroName"
        @selected="productData.category_id = $event" />
    </div>

    <button type="button" class="apply-filters-mobile" @click="showFilters = false">
      Applica Filtri
    </button>
  </form>
  <div class="search-bar mobile-only">
    <div class="sub-search-bar">
      <input type="text" v-model="search" placeholder="Cerca..." />
      <img class="search-icon" src="../images/lens.svg" alt="Search" />
    </div>
  </div>
  <div class="page-container">
    <!-- Products Grid -->

    <div class="content-area">
      <div class="products">
        <div class="not-found" v-if="total == 0">
          <img src="../images/no-found.webp" alt="" />
          <h2>Nessun prodotto trovato</h2>
        </div>
        <ProductCard v-for="product in products" :key="product.oid"
          :name="product.Manufacturers.name + ' - ' + product.name" :price="product.price > 0 ? product.price : 0"
          :description="product.description" :category="product.Categories.name"
          :image="product.images[0] || './img/no-image.png'" @click="openDetails(product.id)"
          :available="product.available" />
      </div>

      <div class="navigator">
        <button class="navbutton" @click="page--" :disabled="page === 1">
          <img src="../icons/angle_left.svg" alt="Precedente" />
        </button>
        <label>Pagina {{ page }}</label>
        <button class="navbutton" @click="page++" :disabled="page >= totalPages">
          <img src="../icons/angle_right.svg" alt="Successiva" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  color: var(--color-text);
}

.not-found img {
  width: 400px;
  margin-bottom: 20px;
}

@media (min-width: 601px) {
  .desktop-only {
    display: block !important;
  }

  .mobile-only {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .mobile-only {
    display: block !important;
  }

  .desktop-only {
    display: none !important;
  }

  .not-found {
    text-align: center;
    color: var(--color-text);
  }

  .not-found img {
    width: 100%;
    margin-bottom: 20px;
  }
}

.search-bar {
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  background-color: var(--color-input-background);
  width: 100%;
}

.sub-search-bar .search-icon {
  width: 20px;
  height: 20px;
}

.search-bar input {
  width: 100%;
  padding: 8px 34px 8px 12px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-container-border);
}

.search-bar input::placeholder {
  color: var(--color-text);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.page-container {
  position: relative;
  width: 100%;
}

.mobile-filter-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.mobile-filter-toggle:active {
  transform: scale(0.95);
}

.mobile-filter-toggle img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.filter-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  margin: 0;
  font-size: 20px;
}

.close-filters {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
  width: 30px;
  height: 30px;
}

.apply-filters-mobile {
  display: none;
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
}

.input-sub-group,
.sub-search-bar {
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
  color: var(--color-text);
  width: 100%;
}

.input-sub-group .search-icon {
  width: 18px;
  height: 18px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.generic-input:focus {
  outline: none;
  border-bottom: 2px solid var(--color-primary);
}

.input-group label {
  padding-left: 6px;
  font-weight: 500;
}

.left-pannel {
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  height: calc(100vh - var(--top-appbar-height));
  width: var(--left-pannel-width);
  padding: 50px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  background-color: var(--color-container);
  z-index: 100;
}

.content-area {
  margin-left: var(--left-pannel-width);
  width: calc(100% - var(--left-pannel-width));
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.navigator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
}

.navbutton {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  transition: opacity 0.2s;
}

.navbutton:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.navbutton:not(:disabled):hover {
  opacity: 0.7;
}

.navbutton img {
  width: 24px;
  height: 24px;
}

/* Responsive Styles */
@media (min-width: 601px) {
  .left-pannel {
    width: 280px;
  }

  .content-area {
    margin-left: 280px;
    width: calc(100% - 280px);
  }

  .products {
    gap: 15px;
    padding: 15px;
  }

  .mobile-filter-toggle {
    display: none;
  }
}

@media (max-width: 600px) {
  .mobile-filter-toggle {
    display: flex;
  }

  .overlay {
    display: block;
  }

  .filter-header {
    display: flex;
  }

  .apply-filters-mobile {
    display: block;
  }

  .left-pannel {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 85%;
    max-width: 350px;
    height: 100vh;
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .left-pannel.show {
    transform: translateX(0);
  }

  .content-area {
    margin-left: 0;
    width: 100%;
  }

  .products {
    gap: 15px;
    padding: 0 20px;
  }

  .navigator {
    gap: 15px;
    padding: 15px 10px;
  }

  .navigator label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .left-pannel {
    width: 90%;
    padding: 15px;
    gap: 30px;
  }

  .input-group {
    gap: 8px;
  }

  .generic-input {
    font-size: 14px;
    padding: 8px 32px 8px 8px;
  }

  .products {
    padding: 10px 5px;
    gap: 10px;
  }

  .mobile-filter-toggle {
    bottom: 15px;
    right: 15px;
    padding: 10px 16px;
    font-size: 14px;
  }

  .navigator {
    gap: 10px;
  }

  .navbutton img {
    width: 20px;
    height: 20px;
  }
}
</style>
