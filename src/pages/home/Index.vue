<template>
  <div class="pb-2">
    <HomeHeroSearch />
    <HomeToolEntries />

    <!-- 今日已核实 -->
    <HomeVerifiedIncidents />

    <!-- 国内避雷热力图 + 高风险城市 TOP5 -->
    <section
      class="container-page mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.85fr_1fr] lg:items-stretch"
    >
      <ClientOnly>
        <RiskMap :mapData="riskCitiesToMap" />
      </ClientOnly>
      <HomeCityRankPanel :risk-cities="riskCities" />
    </section>

    <!-- 踩坑墙 -->
    <HomePitWall />

    <!-- 底部点击提示行 -->
    <HomeClickHintBar />
  </div>
</template>

<script setup lang="ts">
import type { CityRecord } from "~/types";
import { useCitiesStore } from "@stores/citiesStore";
const RiskMap = defineAsyncComponent(() => import("@components/maps/RiskMap.vue"));

const citiesStore = useCitiesStore();

useSeoMeta({
  title: "避过 · 这地方，避过吗？",
  description:
    "基于 12315、黑猫投诉、文旅通报等真实数据的城市避雷工具。今日已核实雷点、踩坑墙、避雷地图、行前清单一站搞定。",
});

interface RiskCitiesResponse {
  data: CityRecord[];
  meta: {
    cache: "hit" | "miss" | "bypass";
    key: string;
    ttl: number;
  };
}

const { data: cities } = await useAsyncData<CityRecord[]>("cities", async () => {
  const response = await $fetch<RiskCitiesResponse>("/api/home/risk-cities");
  citiesStore.updateCitiesList(response.data);

  return response.data;
});

const riskCities = computed(() => cities.value?.slice(0, 5) ?? []);
const riskCitiesToMap = computed(() => cities.value ?? []);
</script>
