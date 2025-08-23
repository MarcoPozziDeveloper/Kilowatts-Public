<script setup>
import { ref, watch, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const props = defineProps({
  tableName: String,
  defaultSelectedId: {
    type: String,
    default: null
  },
  refreshToken: { 
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['selected']);

const elements = ref([]);
const selectedElement = ref("");
const loadData = async () => { 
  elements.value = await getElements(props.tableName);

 
};
onMounted(loadData);

const getElements = async (table) => {
    
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`Errore nel caricamento da ${table}:`, error);
    return [];
  }
  return data;
};

watch(selectedElement, (newValue) => {
  emit('selected', newValue);
  
});
watch(
  () => props.refreshToken,
  async () => {
    await loadData()
  },
  { immediate: true }
)

</script>

<template>

  <select v-model="selectedElement" required class="generic-input">
    <option value=""> SELEZIONA</option>
    <option v-for="element in elements" :key="element.oid" :value="element.oid">
      {{ element.name }}
    </option>
  </select>
</template>

<style scoped>

</style>