import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AudioView from "../views/AudioView.vue";
import RicambiView from "../views/RicambiView.vue";
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
    { path: "/audio", name: "audio", component: AudioView },
    { path: "/ricambi", name: "ricambi", component: RicambiView },
    {
      path: "/prodotto/:id",
      name: "prodotto",
      component: ProductView,
      meta: { requiresAuth: true },
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  ],
});

export default router;
