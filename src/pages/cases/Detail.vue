<template>
  <article class="section">
    <div class="mx-auto w-[760px]">
      <NuxtLink
        to="/cases"
        class="text-brand-600 inline-flex items-center gap-1 text-sm hover:underline"
      >
        <Icon
          name="lucide:arrow-left"
          size="14"
        />
        返回案例库
      </NuxtLink>

      <h1 class="mt-4 text-3xl leading-tight font-bold">
        {{ caseItem.title }}
      </h1>

      <div class="mt-4 flex items-center gap-3 text-sm text-gray-500">
        <el-avatar
          :size="32"
          :src="caseItem.userAvatar"
        />
        <span>{{ caseItem.userName }}</span>
        <span>·</span>
        <span>{{ relativeTime(caseItem.createdAt) }}</span>
        <span>·</span>
        <span class="inline-flex items-center gap-1">
          <Icon
            name="lucide:eye"
            size="14"
          />
          {{ formatNumber(caseItem.views) }}
        </span>
      </div>

      <div class="mt-6 overflow-hidden rounded-2xl bg-gray-100">
        <img
          :src="caseItem.coverUrl"
          :alt="caseItem.title"
          class="w-full"
          onerror="this.style.display = 'none'"
        />
      </div>

      <div class="prose prose-emerald mt-8 max-w-none">
        <p class="text-lg leading-relaxed text-gray-700">{{ caseItem.summary }}</p>
        <p class="text-gray-400">（完整内容待用户投稿后展示）</p>
      </div>

      <div class="mt-10 flex items-center justify-center gap-3 border-t border-gray-100 pt-6">
        <el-button
          type="primary"
          plain
        >
          <Icon
            name="lucide:thumbs-up"
            size="14"
            class="mr-1"
          />
          有用 ({{ formatNumber(caseItem.likes) }})
        </el-button>
        <el-button plain>
          <Icon
            name="lucide:share-2"
            size="14"
            class="mr-1"
          />
          分享
        </el-button>
        <el-button plain>
          <Icon
            name="lucide:star"
            size="14"
            class="mr-1"
          />
          收藏
        </el-button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { mockCases } from "~/utils/mock";
import { relativeTime, formatNumber } from "~/utils/format";

const route = useRoute();
const caseItem = computed(() => mockCases.find((c) => c.id === route.params.id) || mockCases[0]!);

useSeoMeta({
  title: () => `${caseItem.value.title} · 避过`,
});
</script>
