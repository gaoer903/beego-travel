<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h1 class="heading-1 flex items-center gap-2">
            <Icon
              name="lucide:book-open"
              size="28"
              class="text-brand-500"
            />
            避雷案例库
          </h1>
          <p class="text-muted mt-2">真实用户翻车实录 · 投稿换积分</p>
        </div>
        <el-button type="primary">
          <Icon
            name="lucide:pencil"
            size="14"
            class="mr-1"
          />
          我要投稿
        </el-button>
      </div>

      <div class="grid grid-cols-3 gap-5">
        <NuxtLink
          v-for="c in mockCases"
          :key="c.id"
          :to="`/cases/${c.id}`"
          class="group shadow-card hover:shadow-soft overflow-hidden rounded-2xl bg-white transition-all hover:-translate-y-1"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              :src="c.coverUrl"
              :alt="c.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onerror="this.style.display = 'none'"
            />
          </div>
          <div class="p-5">
            <h3 class="group-hover:text-brand-700 line-clamp-2 font-semibold">
              {{ c.title }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm text-gray-500">{{ c.summary }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{{ c.userName }}</span>
              <span>{{ relativeTime(c.createdAt) }}</span>
            </div>
            <div class="mt-2 flex gap-3 text-xs text-gray-500">
              <span class="inline-flex items-center gap-1">
                <Icon
                  name="lucide:heart"
                  size="12"
                />
                {{ formatNumber(c.likes) }}
              </span>
              <span class="inline-flex items-center gap-1">
                <Icon
                  name="lucide:eye"
                  size="12"
                />
                {{ formatNumber(c.views) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockCases } from "~/utils/mock";
import { formatNumber, relativeTime } from "~/utils/format";

useSeoMeta({
  title: "案例库 · 避过",
  description: "真实用户翻车实录，避雷必看。",
});
</script>
