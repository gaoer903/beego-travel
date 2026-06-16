<template>
  <section class="section">
    <div class="mx-auto w-[860px]">
      <NuxtLink
        to="/incidents"
        class="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
      >
        <Icon name="lucide:arrow-left" size="14" />
        返回已核实列表
      </NuxtLink>

      <div class="mt-4 card-padded">
        <div class="flex items-center gap-2">
          <span :class="tone.chip">{{ tone.label }}</span>
          <span :class="['cat-tag', cat.bg, cat.ink]">
            <Icon :name="cat.icon" size="12" />
            {{ cat.label }}
          </span>
          <span class="badge-verified">
            <Icon name="lucide:badge-check" size="12" />
            已核实
          </span>
        </div>

        <h1 class="mt-3 heading-2">{{ incident.place }}</h1>
        <p class="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <Icon name="lucide:map-pin" size="12" />
          {{ incident.city }}
        </p>
        <p class="mt-4 text-base text-gray-800">{{ incident.summary }}</p>

        <div class="mt-6 grid grid-cols-3 gap-3">
          <div class="rounded-xl bg-gray-50 p-3 text-sm">
            <div class="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="lucide:bar-chart-3" size="11" />
              投诉
            </div>
            <div class="mt-1 text-lg font-bold">{{ incident.complaintCount }} 条</div>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 text-sm">
            <div class="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="lucide:database" size="11" />
              数据来源
            </div>
            <div class="mt-1 text-sm font-semibold">
              {{ incident.sources.map(s => s.label).join(' / ') }}
            </div>
          </div>
          <div class="rounded-xl bg-gray-50 p-3 text-sm">
            <div class="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="lucide:clock-3" size="11" />
              更新
            </div>
            <div class="mt-1 text-sm font-semibold">{{ incident.postedAt }}</div>
          </div>
        </div>

        <div v-if="incident.alternative" class="mt-6 rounded-xl bg-brand-50 p-4 text-sm">
          <div class="flex items-center gap-1.5 font-semibold text-brand-700">
            <Icon name="lucide:lightbulb" size="14" />
            替代方案
          </div>
          <p class="mt-1 text-gray-800">{{ incident.alternative }}</p>
        </div>
        <div v-if="incident.reportChannel" class="mt-3 rounded-xl bg-amber-50 p-4 text-sm">
          <div class="flex items-center gap-1.5 font-semibold text-amber-700">
            <Icon name="lucide:phone-call" size="14" />
            报案方式
          </div>
          <p class="mt-1 text-gray-800">{{ incident.reportChannel }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CATEGORY_MAP, MOCK_INCIDENTS, riskTone } from '~/utils/mock'

const route = useRoute()
const incident = computed(
  () => MOCK_INCIDENTS.find(i => i.id === route.params.id) || MOCK_INCIDENTS[0]!,
)

useSeoMeta({
  title: () => `${incident.value.place} · 避过`,
  description: () => incident.value.summary,
})

const cat = computed(() => CATEGORY_MAP[incident.value.category])
const tone = computed(() => riskTone(incident.value.risk))
</script>
