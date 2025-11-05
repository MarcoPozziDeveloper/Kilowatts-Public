import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import ProductView from "../views/ProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/catalogo",
      name: "catalogo",
      component: CatalogView,
    },
    {
      path: "/prodotto/:id",
      name: "prodotto",
      component: ProductView,
      meta: { requiresAuth: true },
    },
  ],
});

export default router;
