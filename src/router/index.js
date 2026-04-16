import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import ProductView from "../views/ProductView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }

    return { top: 0 };
  },

  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/catalogo/:id", name: "catalogo", component: CatalogView },
    {
      path: "/prodotto/:id",
      name: "prodotto",
      component: ProductView,
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
    { path: "/not-found", name: "NotFound", component: NotFoundView },
  ],
});

export default router;
