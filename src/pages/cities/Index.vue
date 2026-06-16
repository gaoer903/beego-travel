<template>
  <section class="section">
    <div class="mx-auto w-[760px]">
      <div class="mb-6">
        <h1 class="heading-1 flex items-center gap-2">
          <Icon name="lucide:trophy" size="28" class="text-amber-500" />
          高风险城市榜
        </h1>
        <p class="mt-2 text-muted">近 7 天投诉密度排名 · 数据每日更新</p>
      </div>

      <ul class="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-card">
        <li
          v-for="item in MOCK_CITY_RANK"
          :key="item.rank"
          class="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            :class="
              item.rank <= 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
            "
          >
            {{ item.rank }}
          </span>
          <NuxtLink
            :to="`/cities/${item.city}`"
            class="flex-1 text-base font-semibold text-gray-900 hover:text-brand-700"
          >
            {{ item.city }}
          </NuxtLink>
          <span :class="riskTone(item.risk).chip">{{ item.badge }}</span>
          <Icon name="lucide:chevron-right" size="18" class="text-gray-300" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_CITY_RANK, riskTone } from '~/utils/mock'
useSeoMeta({ title: '高风险城市榜 · 避过' })
</script>
