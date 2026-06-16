<template>
  <div class="pb-2">
    <HomeHeroSearch />
    <HomeToolEntries />

    <!-- 今日已核实 -->
    <HomeVerifiedIncidents />

    <!-- 国内避雷热力图 + 高风险城市 TOP5 -->
    <section class="container-page mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.85fr_1fr] lg:items-stretch">
      <RiskMap :mapData="riskCitiesToMap" />
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
import RiskMap from "@components/maps/RiskMap.vue";

const citiesStore = useCitiesStore();

useSeoMeta({
  title: "避过 · 这地方，避过吗？",
  description:
    "基于 12315、黑猫投诉、文旅通报等真实数据的城市避雷工具。今日已核实雷点、踩坑墙、避雷地图、行前清单一站搞定。",
});

const client = useSupabaseClient();

const riskCities = ref<CityRecord[]>([]);

const riskCitiesToMap = ref<CityRecord[]>([]);

const { data: cities } = await useAsyncData<CityRecord[]>("cities", async () => {
  const { data, error } = await client
    .from("cities")
    .select("*")
    .order("risk_score", { ascending: false });

  try {
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message });
    }
    citiesStore.updateCitiesList(data as CityRecord[]);
  } catch (error) {
    console.error(error);
  }

  return (data ?? []) as CityRecord[];
});

console.log("cities", cities.value);

riskCities.value = cities.value?.slice(0, 5) || [];
riskCitiesToMap.value = cities.value || [];
console.log("riskCitiesToMap", riskCitiesToMap.value);
</script>
