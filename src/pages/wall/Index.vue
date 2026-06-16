<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h1 class="heading-1 flex items-center gap-2">
            <Icon name="lucide:pin" size="28" class="text-amber-500" />
            踩坑墙
          </h1>
          <p class="mt-2 text-muted">
            用户实时吐槽，未经核实 · 共 {{ PIT_TALK_TOTAL.toLocaleString() }} 条
          </p>
        </div>
        <NuxtLink to="/report">
          <el-button type="primary">
            <Icon name="lucide:plus" size="14" class="mr-1" />
            我也要吐槽
          </el-button>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(t, i) in MOCK_PIT_TALKS"
          :key="t.id"
          class="rounded-xl bg-pit-paper p-4 shadow-sticky transition hover:-translate-y-0.5"
          :class="tilts[i % tilts.length]"
        >
          <div class="flex items-center justify-between">
            <span class="badge-pending">
              <Icon name="lucide:clock-3" size="11" />
              待核实
            </span>
            <span class="text-lg">{{ t.emoji }}</span>
          </div>
          <p class="mt-2 text-sm leading-snug text-gray-800">{{ t.content }}</p>
          <div class="mt-2 flex flex-wrap gap-1 text-xs text-amber-700">
            <span
              v-for="tag in t.tags"
              :key="tag"
              class="rounded bg-amber-100/70 px-1.5 py-0.5"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>{{ t.postedAt }}</span>
            <span class="inline-flex items-center gap-0.5">
              <Icon name="lucide:hand" size="11" />
              +{{ t.meTooCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_PIT_TALKS, PIT_TALK_TOTAL } from '~/utils/mock'
useSeoMeta({ title: '踩坑墙 · 避过' })

const tilts = ['-rotate-2', '-rotate-1', 'rotate-1', 'rotate-2']
</script>
