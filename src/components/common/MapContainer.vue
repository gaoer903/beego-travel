<template>
  <div style="border-radius: 12px; overflow: hidden">
    <Map
      ref="mapEl"
      :center="centerPos"
      :zoom="12"
      style="width: 100%; height: 400px"
      @click="onMapClick"
      @ready="onMapReady"
      @tilesLoaded="onTilesLoaded"
    >
      <!-- 进度遮罩层 -->
      <div
        v-show="isLoadingShow"
        class="process-mask"
      >
        <UIcon
          name="lucide-loader-circle"
          class="h-8 w-8 animate-spin"
        />
        <span class="ml-2 text-sm text-gray-700">地图加载中...</span>
      </div>
      <MapSearchPanel :targetCity="targetCityName"></MapSearchPanel>
      <slot name="default"></slot>
    </Map>
  </div>
</template>

<script setup lang="ts">
import { Map, useLocalCity } from "@baidumap/vue-bmap";
import type { MapMouseEvent } from "@baidumap/vue-bmap";
import MapSearchPanel from "./MapSearchPanel.vue";

const props = withDefaults(
  defineProps<{
    targetCityPos?: { lng: number; lat: number; name: string };
  }>(),
  {
    targetCityPos: () => ({ lng: 116.404, lat: 39.915, name: "北京" }),
  }
);
// 城市名称
const isLoadingShow = ref(true);
const mapEl = ref();
const isEditPage = inject("isEditPage");

const { data: localCity, get: getLocalCity } = useLocalCity();
if (!isEditPage) {
  getLocalCity();
}

const centerPos = computed(() => {
  if (localCity.value) {
    return {
      lng: localCity.value.center.lng,
      lat: localCity.value.center.lat,
    };
  }
  return props.targetCityPos;
});

const targetCityName = computed(() => {
  return props.targetCityPos.name || localCity.value?.name;
});
const onMapClick = (e: MapMouseEvent) => {
  console.log("map clicked:", e);
  mapEl.value?.getMapRef().panTo(e.point);
  mapEl.value?.getMapRef().setZoom(15, { zoomCenter: e.point, noAnimation: false });
};

const onMapReady = () => {
  console.log("map is ready");
};

const onTilesLoaded = () => {
  console.log("tiles loaded");
  if (isLoadingShow.value) {
    isLoadingShow.value = false;
  }
};
</script>

<style scoped lang="scss">
.process-mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 20;
}
</style>
