<script setup></script>
<template>
  <div class="spacer"></div>
  <div class="navbar">
    <a href="/">
      <img src="../images/KW_logo.png" alt="Kilowatts Industries Logo" class="logo" />
    </a>
    <div class="sub-navbar">
      <div class="links-sub-navbar">
           <a href="/">Home</a>
        <a href="index.html">Catalogo</a>
        <a href="about.html">Classifiche</a>
        <a href="/#eventi">Eventi</a>
      </div>
      <img src="../icons/vert_separator.svg" alt="Separatore" />
      <div class="icons-sub-navbar">
        <a href="https://www.facebook.com/p/Kilowatts-Industries-100083304311069/">
          <img src="../icons/fb.svg" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/kilowatts.industries">
          <img src="../icons/ig.svg" alt="Instagram" /></a>
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
  background-color: var(--color-bg);
  padding: 0 50px;
}

.sub-navbar {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 40px;
  width: 100%;
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
</style>
