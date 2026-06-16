<template>
  <section class="container-page mt-10">
    <div class="mb-4 flex items-end justify-between">
      <div>
        <h2 class="heading-2 flex items-center gap-2">
          <span class="inline-block h-5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
          踩坑墙
        </h2>
        <p class="mt-1 text-xs text-muted">用户实时吐槽 · 未核实</p>
      </div>
      <NuxtLink to="/wall" class="text-sm text-brand-600 hover:underline">
        展开全部 {{ PIT_TALK_TOTAL.toLocaleString() }} 条吐槽 →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-7 gap-4">
      <div
        v-for="(talk, i) in MOCK_PIT_TALKS"
        :key="talk.id"
        class="relative flex flex-col rounded-xl bg-pit-paper p-3 shadow-sticky transition hover:-translate-y-0.5"
        :class="tilts[i % tilts.length]"
      >
        <div class="flex items-center justify-between">
          <span class="badge-pending">
            <Icon name="lucide:clock" size="11" />
            待核实
          </span>
          <span class="text-lg">{{ talk.emoji }}</span>
        </div>
        <p class="mt-2 line-clamp-3 text-[13px] leading-snug text-gray-800">
          {{ talk.content }}
        </p>
        <div class="mt-2 flex flex-wrap gap-1 text-[11px] text-amber-700">
          <span
            v-for="tag in talk.tags"
            :key="tag"
            class="rounded bg-amber-100/70 px-1.5 py-0.5"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between text-[11px] text-gray-500">
          <span>{{ talk.postedAt }}</span>
          <button
            class="inline-flex items-center gap-0.5 rounded-full bg-white/70 px-1.5 py-0.5 text-amber-700 hover:bg-white"
            @click="handleMeToo(talk.id)"
          >
            +{{ talk.meTooCount }} 我也遇到过
          </button>
        </div>
      </div>

      <!-- "我也要吐槽" 按钮卡片 -->
      <button
        class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white/40 p-3 text-gray-500 transition hover:border-brand-400 hover:bg-brand-50/40 hover:text-brand-700"
        @click="handleReport"
      >
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Icon name="lucide:plus" size="20" />
        </span>
        <span class="text-xs font-semibold">我也要吐槽</span>
        <span class="text-[11px]">报一个坑</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CATEGORY_MAP, MOCK_PIT_TALKS, PIT_TALK_TOTAL } from '~/utils/mock'

const tilts = ['-rotate-2', '-rotate-1', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-2']

const handleReport = () => {
  navigateTo('/report')
}

const handleMeToo = (id: string) => {
  ElMessage.success('+1 我也遇到过（演示）')
}
</script>
