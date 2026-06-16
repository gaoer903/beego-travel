<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h1 class="heading-1 flex items-center gap-2">
            <Icon name="lucide:badge-check" size="28" class="text-brand-500" />
            今日已核实
          </h1>
          <p class="mt-2 text-muted">
            数据团队核实 · 每日更新 · 共 {{ MOCK_INCIDENTS.length }} 条
          </p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <HomeIncidentCard
          v-for="inc in MOCK_INCIDENTS"
          :key="inc.id"
          :incident="inc"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_INCIDENTS } from '~/utils/mock'

useSeoMeta({ title: '今日已核实 · 避过' })
</script>
