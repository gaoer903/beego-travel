<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-8">
        <h1 class="heading-1 flex items-center gap-2">
          <Icon name="lucide:wrench" size="28" class="text-brand-500" />
          工具箱
        </h1>
        <p class="mt-2 text-muted">避过 · 12 个实用避雷工具，持续更新</p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.id"
          :to="tool.to"
          class="card-padded group flex flex-col gap-3"
        >
          <span
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100"
          >
            <Icon :name="tool.icon" size="22" />
          </span>
          <div>
            <h3 class="text-base font-semibold text-gray-900 group-hover:text-brand-700">
              {{ tool.title }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">{{ tool.subtitle }}</p>
          </div>
        </NuxtLink>

        <div
          class="card-padded flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400"
        >
          <Icon name="lucide:wrench" size="28" />
          <p class="text-sm">更多工具开发中</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TOOL_ENTRIES } from '~/utils/mock'

useSeoMeta({ title: '工具箱 · 避过' })

const tools = computed(() => TOOL_ENTRIES.filter(t => t.id !== 'all'))
</script>
