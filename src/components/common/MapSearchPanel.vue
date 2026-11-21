<template>
  <div id="map-search-panel">
    <section class="mb-2 flex justify-around">
      <UInput
        v-model="searchPlace"
        placeholder="请输入检索地点"
        class="mr-2"
      >
        <template
          v-if="searchPlace?.length"
          #trailing
        >
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="handleClearSearch"
          />
        </template>
      </UInput>
      <UButton
        @click="handleSearch"
        style="border-radius: 6px"
      >
        {{ loading ? "搜索中…" : "搜索" }}
      </UButton>
    </section>
    <div
      id="res-panel"
      ref="panelRef"
      style="max-height: 300px; min-height: 40px"
      @wheel.stop
      @touchmove.stop
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLocalSearch, useMapRef } from "@baidumap/vue-bmap";
import type { LocalSearchOptions } from "@baidumap/vue-bmap";

const panelRef = ref<HTMLElement | null>(null);
const searchPlace = ref("");
const toast = useToast();
const props = withDefaults(
  defineProps<{
    targetCity?: string;
  }>(),
  {
    targetCity: "北京",
  }
);

const mapRef = useMapRef();
const initOption = reactive<LocalSearchOptions>({
  location: props.targetCity,
  renderOptions: { panel: panelRef, autoViewport: true },
});
const { search, loading, clearResults } = useLocalSearch(initOption as LocalSearchOptions);

const handleSearch = () => {
  if (!searchPlace.value) {
    toast.add({
      title: "请输入检索地点",
      color: "warning",
      duration: 1000,
    });
    return;
  }
  search(searchPlace.value);
};

const handleClearSearch = () => {
  searchPlace.value = "";
  clearResults();
};

watch(
  () => props.targetCity,
  (city) => {
    initOption.location = city;
  }
);
</script>

<style scoped lang="scss">
#map-search-panel {
  position: absolute;
  z-index: 10;
  width: 300px;
  padding: 12px;
  background-color: #fff;
  right: 5px;
  top: 10px;
  border-radius: 6px;

  #res-panel {
    overflow: auto;
    font-size: 12px;
  }
}
</style>
