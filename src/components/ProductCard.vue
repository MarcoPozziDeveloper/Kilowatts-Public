<script setup>
defineProps({
  name: String,
  price: {
    type: Number,
    default: 0
  },
  description: String,
  category: String,
  image: {
    type: String,
    default: './img/no-image.png'
  },
  available: {
    type: Boolean,
    default: false
  }

})
</script>

<template>
  <div class="product-card">
    <img :src="image" :alt="name" class="product-image" />
    <div class="product-details">
      <div class="info">
        <h2 class="product-name">{{ name }}</h2>

        <p class="product-price">{{ price > 0 ? '€' + price.toFixed(2) : 'Prezzo: ??' }}</p>

        <p class="product-description">{{ description.length > 90 ? description.substring(0, 90) + '...' : description
        }}
        </p>
      </div>

      <div class="info">
        <p class="product-category">{{ category }}</p>
        <p class="product-availability" :style="{ color: available ? 'var(--color-green)' : 'var(--color-red)' }">
          {{ available ? 'Disponibile' : 'Non Disponibile' }}</p>
      </div>

    </div>
  </div>
</template>



<style scoped>
.product-card {
  background-color: var(--input-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: var(--text-color);
  width: 100%;
  transition: transform 0.2s ease;
  width: var(--left-pannel-width);
  border: 1px solid var(--color-container-border);
  height: 470px;
}

@media (min-width: 601px) {
  .product-card:hover {
    cursor: pointer;
    box-shadow: 0px 6px 15px color-mix(in srgb, var(--color-primary) 40%, transparent);
  }

  .product-card:hover {
    transform: scale(1.03);
  }
}



.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
}

.product-details {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(470px - 200px);
  /* altezza card meno immagine */
}

.info {
  gap: 10px;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.1rem;
  color: var(--color-primary);
}

.product-description {
  color: #ccc;
  white-space: pre-wrap;
}

.product-category {
  font-weight: 600;
}
</style>
