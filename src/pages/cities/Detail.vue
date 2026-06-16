<template>
  <section class="section">
    <div class="container-page">
      <NuxtLink
        to="/cities"
        class="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
      >
        <Icon name="lucide:arrow-left" size="14" />
        返回城市榜
      </NuxtLink>

      <div class="mt-4 mb-6">
        <h1 class="heading-1 flex items-center gap-2">
          <Icon name="lucide:map-pin" size="28" class="text-brand-500" />
          {{ city }} 避雷总览
        </h1>
        <p class="mt-2 text-muted">汇总该城市已核实雷点与用户吐槽</p>
      </div>

      <h2 class="heading-3 mt-2">已核实雷点</h2>
      <div v-if="cityIncidents.length" class="mt-3 grid grid-cols-3 gap-4">
        <HomeIncidentCard
          v-for="inc in cityIncidents"
          :key="inc.id"
          :incident="inc"
        />
      </div>
      <p v-else class="mt-3 text-sm text-muted">该城市暂无已核实雷点</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_INCIDENTS } from '~/utils/mock'

const route = useRoute()
const city = computed(() => decodeURIComponent(String(route.params.city)))

useSeoMeta({
  title: () => `${city.value} 避雷总览 · 避过`,
})

const cityIncidents = computed(() =>
  MOCK_INCIDENTS.filter(i => i.city === city.value),
)
</script>
