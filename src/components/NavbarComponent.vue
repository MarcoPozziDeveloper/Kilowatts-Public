<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const bucket = "pdf";
const fileName = ref("");
const exists = ref(false);

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const loadFile = async () => {
  const { data } = await supabase.storage.from(bucket).list("", { limit: 1 });
  if (data && data.length > 0) {
    fileName.value = data[0].name;
    exists.value = true;
  } else {
    fileName.value = "";
    exists.value = false;
  }
};
const openPdf = () => {
  isMenuOpen.value = false;
  if (!exists.value) return;
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName.value);

  window.open(data.publicUrl, "_blank");
};

onMounted(loadFile);
</script>

<template>
  <div class="navbar">
    <router-link to="/">
      <img
        src="../images/KW_logo.png"
        alt="Kilowatts Industries Logo"
        class="logo"
      />
    </router-link>
    <button
      class="hamburger"
      @click="toggleMenu"
      :class="{ active: isMenuOpen }"
      aria-label="Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="sub-navbar" :class="{ open: isMenuOpen }">
      <div class="links-sub-navbar">
        <router-link to="/" @click="isMenuOpen = false">Home</router-link>
        <a href="/#eventi" @click="isMenuOpen = false">Eventi</a>
        <router-link to="/audio" @click="isMenuOpen = false"
          >Audio</router-link
        >
        <router-link to="/ricambi" @click="isMenuOpen = false"
          >Ricambi</router-link
        >
        <a href="" v-if="exists" @click="openPdf">Classifiche</a>
      </div>
      <img
        src="../icons/vert_separator.svg"
        alt="Separatore"
        class="separator"
      />
      <div class="icons-sub-navbar">
        <a
          href="https://www.facebook.com/p/Kilowatts-Industries-100083304311069/"
        >
          <img src="../icons/fb.svg" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/kilowatts.industries">
          <img src="../icons/ig.svg" alt="Instagram" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--color-input-background);
  padding: 0 26px;
  height: 70px;
}

.sub-navbar {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 40px;
}

.links-sub-navbar,
.icons-sub-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.icons-sub-navbar {
  gap: 30px;
}

.logo {
  max-width: 266px;
}

.links-sub-navbar a {
  color: var(--color-highlight);
  text-decoration: none;
  font-size: 20px;
  white-space: nowrap; /* FIX: impedisce il wrap del testo */
}

.links-sub-navbar a:hover {
  text-decoration: underline;
}

.links-sub-navbar a.router-link-active {

  text-decoration: underline;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 101;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--color-highlight);
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

@media (max-width: 970px) {
  .hamburger {
    display: flex;
  }

  .sub-navbar {
    position: fixed;
    top: 70px;
    right: 0;
    left: 0;
    flex-direction: column;
    background: var(--color-input-background);
    padding: 20px;
    gap: 20px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .sub-navbar.open {
    transform: translateX(0);
  }

  .links-sub-navbar {
    flex-direction: column;
    width: 100%;
  }

  .links-sub-navbar a {
    width: 100%;
    text-align: center;
    padding: 10px 0;
  }

  .separator {
    display: none;
  }

  .icons-sub-navbar {
    display: none;
  }
}

@media (max-width: 600px) {
  .logo {
    max-width: 200px;
  }
  .navbar {
    padding: 0 15px;
  }
  .links-sub-navbar {
    gap: 10px;
  }
}
</style>