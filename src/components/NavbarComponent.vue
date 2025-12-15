<script setup>
import { ref } from "vue";
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

</script>
<template>
  <div class="spacer"></div>
  <div class="navbar">
    <router-link to="/">
      <img src="../images/KW_logo.png" alt="Kilowatts Industries Logo" class="logo" />
    </router-link>

    <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="sub-navbar" :class="{ open: isMenuOpen }">
      <div class="links-sub-navbar">
        <router-link to="/" @click="isMenuOpen = false">Home </router-link>
        <router-link to="/catalogo" @click="isMenuOpen = false">Catalogo </router-link>
        <a href="about.html" @click="isMenuOpen = false">Classifiche</a>
        <a href="/#eventi" @click="isMenuOpen = false">Eventi</a>
      </div>
      <img src="../icons/vert_separator.svg" alt="Separatore" class="separator" />
      <div class="icons-sub-navbar">
        <a href="https://www.facebook.com/p/Kilowatts-Industries-100083304311069/">
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
.spacer {
  height: 90px;
}

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
}

.sub-navbar {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 40px;
 
}
@media (min-width: 769px) {
  .sub-navbar {
    position: static;
    display: flex;
  }
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
}

.links-sub-navbar a:hover {
  text-decoration: underline;
}

.links-sub-navbar a.active {
  font-weight: bold;
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

/* Media Query per Tablet e Mobile */


/* Media Query per Smartphone Piccoli */
@media (max-width: 480px) {
  .logo {
    max-width: 150px;
  }

  .links-sub-navbar a {
    font-size: 16px;
  }

  .icons-sub-navbar img {
    width: 24px;
    height: 24px;
  }
}
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .sub-navbar {
    position: absolute;
    top: 100%;
    right: 0;
    flex-direction: column;
    display: none;
    background: var(--color-input-background);
  }

  .sub-navbar.open {
    display: flex;
  }
}
</style>