<template>
  <BMapProvider
    :ak="BD_API_KEY"
    version="4.0"
  >
    <MapContainer
      :targetCityPos="
        $attrs['targetCityPos'] as { lng: number; lat: number; name: string } | undefined
      "
    >
      <Marker :position="{ lng: 116.404, lat: 39.915 }" />
      <NavigationControl />
      <!-- <ScaleControl /> -->
    </MapContainer>
  </BMapProvider>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { BMapProvider, Marker, NavigationControl } from "@baidumap/vue-bmap";
import MapContainer from "./MapContainer.vue";

const { BD_API_KEY } = useRuntimeConfig().public;

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
