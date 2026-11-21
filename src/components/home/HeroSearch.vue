<template>
  <section class="hero relative mx-auto w-full overflow-hidden bg-[#cfe8f5]">
    <NuxtImg
      src="/imgs/hero-bg.png"
      alt=""
      aria-hidden="true"
      width="1920"
      height="600"
      format="webp"
      densities="1x"
      :preload="{ fetchPriority: 'high' }"
      fetchpriority="high"
      loading="eager"
      decoding="async"
      class="hero-bg pointer-events-none absolute inset-y-0 left-1/2 h-full w-480 max-w-none -translate-x-1/2 select-none object-cover object-center"
    />
    <div class="container-page relative z-10 pt-14 pb-16">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-end gap-4">
          <div class="speech text-2xl font-bold">今天你想避哪儿的坑？</div>
          <Mascot :size="120" />
        </div>
        <p class="text-sm text-gray-600">
          基于
          <b class="text-gray-800">12315</b>
          、
          <b class="text-gray-800">黑猫投诉</b>
          、
          <b class="text-gray-800">文旅通报</b>
          等真实数据
        </p>
      </div>

      <div
        class="shadow-soft mx-auto mt-8 max-w-3xl rounded-3xl border border-gray-100 bg-white/95 p-5 backdrop-blur-sm"
      >
        <div class="mb-3 flex gap-6 border-b border-gray-100">
          <button
            class="relative flex items-center gap-1 px-1 pb-3 text-sm font-semibold transition"
            :class="tab === 'destination' ? 'text-brand-700' : 'text-gray-500 hover:text-gray-900'"
            @click="tab = 'destination'"
          >
            <Icon
              name="lucide:map-pin"
              size="16"
            />
            目的地
            <span
              v-if="tab === 'destination'"
              class="bg-brand-500 absolute inset-x-0 -bottom-px h-0.5 rounded-full"
            />
          </button>
          <button
            class="relative flex items-center gap-1 px-1 pb-3 text-sm font-semibold transition"
            :class="tab === 'merchant' ? 'text-brand-700' : 'text-gray-500 hover:text-gray-900'"
            @click="tab = 'merchant'"
          >
            <Icon
              name="lucide:store"
              size="16"
            />
            商户 / 景点
            <span
              v-if="tab === 'merchant'"
              class="bg-brand-500 absolute inset-x-0 -bottom-px h-0.5 rounded-full"
            />
          </button>
        </div>

        <div class="flex flex-row gap-3">
          <el-input
            v-model="keyword"
            size="large"
            :placeholder="placeholderMap[tab]"
            clearable
            class="flex-1"
            @keyup.enter="handleSubmit"
          >
            <template #prefix>
              <Icon
                name="lucide:search"
                size="16"
                class="text-gray-400"
              />
            </template>
          </el-input>
          <button
            class="btn-brand px-7"
            @click="handleSubmit"
          >
            <Icon
              name="lucide:zap"
              size="16"
            />
            立即避过
          </button>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span class="font-medium text-gray-400">热门搜索：</span>
          <button
            v-for="kw in HOT_SEARCHES"
            :key="kw"
            class="hover:bg-brand-50 hover:text-brand-700 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 transition"
            @click="handleHotClick(kw)"
          >
            {{ kw }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOT_SEARCHES } from "~/utils/mock";

const tab = ref<"destination" | "merchant">("destination");
const keyword = ref("");
const router = useRouter();

const placeholderMap = {
  destination: "输入目的地（城市/景区），如：丽江、三亚、亚龙湾",
  merchant: "输入商户/酒店/景点名，如：阳光小吃街、古城某客栈",
};

const handleSubmit = () => {
  const q = keyword.value.trim();
  if (!q) {
    ElMessage.warning("请输入要查询的目的地或商户名");
    return;
  }
  router.push({ path: "/spots", query: { keyword: q, type: tab.value } });
};

const handleHotClick = (kw: string) => {
  keyword.value = kw;
  handleSubmit();
};
</script>
