<template>
  <NuxtLink
    :to="`/incidents/${incident.id}`"
    class="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
  >
    <!-- 顶部胶带 + 已核实徽章 -->
    <div class="absolute -top-2 left-3 flex gap-2">
      <span :class="tone.tape">{{ tone.label }}</span>
    </div>
    <div class="absolute -top-2 right-3">
      <span class="badge-verified">
        <Icon name="lucide:badge-check" size="12" />
        已核实
      </span>
    </div>

    <!-- 分类标签条 -->
    <div class="mt-3 flex items-center justify-between">
      <span
        class="cat-tag"
        :class="[cat.bg, cat.ink]"
      >
        <Icon :name="cat.icon" size="12" />
        {{ cat.label }}
      </span>
      <span class="text-tiny">{{ incident.sources.map(s => s.label).join(' / ') }}</span>
    </div>

    <!-- 大插画区（category 驱动） -->
    <div
      class="mt-3 flex h-24 items-center justify-center rounded-xl"
      :class="cat.bg"
    >
      <Icon :name="cat.icon" :class="cat.ink" size="56" />
    </div>

    <!-- 主体信息 -->
    <div class="mt-3 flex-1">
      <h3 class="text-[15px] font-semibold text-gray-900 group-hover:text-brand-700">
        {{ incident.place }}
      </h3>
      <p class="mt-1 line-clamp-2 text-sm text-gray-600">{{ incident.summary }}</p>
    </div>

    <ul class="mt-3 space-y-1 text-xs text-gray-500">
      <li class="flex items-center gap-1">
        <Icon name="lucide:bar-chart" size="12" class="text-gray-400" />
        投诉 {{ incident.complaintCount }} 条 · {{ incident.postedAt }}
      </li>
      <li v-if="incident.alternative" class="flex items-start gap-1">
        <Icon name="lucide:lightbulb" size="12" class="mt-0.5 text-amber-500" />
        替代方案：{{ incident.alternative }}
      </li>
      <li v-if="incident.reportChannel" class="flex items-center gap-1">
        <Icon name="lucide:phone" size="12" class="text-gray-400" />
        报案方式：{{ incident.reportChannel }}
      </li>
    </ul>

    <div class="mt-4 flex justify-end">
      <span class="btn-soft text-xs">
        查看详情
        <Icon name="lucide:chevron-right" size="14" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Incident } from '~/types'
import { CATEGORY_MAP, riskTone } from '~/utils/mock'

const props = defineProps<{ incident: Incident }>()

const cat = computed(() => CATEGORY_MAP[props.incident.category])
const tone = computed(() => riskTone(props.incident.risk))
</script>
