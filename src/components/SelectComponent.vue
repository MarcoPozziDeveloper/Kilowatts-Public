<script setup>
import { ref, watch, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const props = defineProps({
  tableName: String,
  macroName: {
    type: String,
    default: null,
  },
  defaultSelectedId: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["selected"]);

const elements = ref([]);
const selectedElement = ref("");
const loadData = async () => {
  elements.value = await getEntitiesByMacro(props.tableName, props.macroName);
};
onMounted(loadData);

const getEntitiesByMacro = async (table, macroName = null) => {
  let query = supabase
    .from(table)
    .select(`
      oid,
      name,
      macrocategory
    `)
    .order("name", { ascending: true });

  if (macroName) {
    query = query.eq("macrocategory", macroName);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  // rimuove duplicati
  return Array.from(
    new Map(data.map(item => [item.oid, item])).values()
  );
};

watch(selectedElement, (newValue) => {
  emit("selected", newValue);
});
watch(
  () => props.refreshToken,
  async () => {
    await loadData();
  },
  { immediate: true },
);
</script>

<template>
  <select v-model="selectedElement" required class="generic-input">
    <option value="">SELEZIONA</option>
    <option v-for="element in elements" :key="element.oid" :value="element.oid">
      {{ element.name }}
    </option>
  </select>
</template>

<style scoped></style>
