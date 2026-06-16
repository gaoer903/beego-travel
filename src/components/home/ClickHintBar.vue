<template>
  <section class="mt-10 border-t border-brand-100 bg-brand-50">
    <div class="container-page flex items-center justify-between gap-6 py-5">
      <!-- 左：避避 + 提示气泡 -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <Mascot :size="56" prop="pointer" />
        <span
          class="rounded-full border-2 border-brand-500 bg-white px-3 py-1.5 text-sm font-semibold text-brand-700"
        >
          这里能点哦！
        </span>
      </div>

      <!-- 中：3 个交互暗示 -->
      <div class="flex flex-1 items-center justify-center gap-x-6">
        <div
          v-for="(h, i) in hints"
          :key="h.title"
          class="flex items-center gap-3"
        >
          <div class="flex items-center gap-2">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
              <Icon :name="h.icon" size="18" />
            </span>
            <div>
              <div class="text-sm font-semibold text-gray-900">{{ h.title }}</div>
              <div class="text-xs text-gray-500">{{ h.sub }}</div>
            </div>
          </div>
          <Icon
            v-if="i < hints.length - 1"
            name="lucide:arrow-right"
            size="18"
            class="text-brand-400"
          />
        </div>
      </div>

      <!-- 右：问题避避 -->
      <button
        class="relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:shadow-md"
        @click="handleAsk"
      >
        <Icon name="lucide:message-square" size="16" />
        问题避避
        <span class="relative flex h-5 w-5 items-center justify-center">
          <Mascot :size="28" prop="wink" />
        </span>
        <span
          class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
        >
          1
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const hints = [
  {
    icon: 'lucide:search',
    title: '点击任何雷点',
    sub: '查看完整调查报告',
  },
  {
    icon: 'lucide:map-pin',
    title: '点击任何城市',
    sub: '查看该城市避雷总览',
  },
  {
    icon: 'lucide:clipboard-list',
    title: '点击工具',
    sub: '生成个人化避雷清单',
  },
]

const askOpen = ref(false)
const handleAsk = () => {
  askOpen.value = !askOpen.value
  if (askOpen.value) {
    ElMessage({
      message: '避避在这儿～后续接入 AI 问答',
      type: 'success',
      offset: 80,
    })
  }
}
</script>
