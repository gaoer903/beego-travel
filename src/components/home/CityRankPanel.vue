<template>
  <div class="card flex h-full flex-col p-5">
    <div class="mb-3 flex items-center justify-between">
      <div>
        <h3 class="heading-3">高风险城市 TOP5</h3>
        <p class="mt-0.5 text-xs text-muted">近 7 天投诉密度排名</p>
      </div>
      <Icon name="lucide:trophy" size="20" class="text-amber-500" />
    </div>

    <ul class="flex flex-col justify-between flex-1 divide-y divide-gray-100">
      <li
        v-for="(item, index) in computedRiskCities"
        :key="index"
        class="flex items-center gap-3 py-3"
      >
        <span
          class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
          :class="item.tagType === 'danger' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'"
        >
          {{ index + 1 }}
        </span>
        <NuxtLink
          :to="`/cities/${item.name}`"
          class="flex-1 truncate text-[15px] font-semibold text-gray-900 hover:text-brand-700"
        >
          {{ item.name }}
        </NuxtLink>
        <span :class="item.tagClass">{{ item.tag }}</span>
        <button
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-brand-700"
          @click="handleSubscribe(item.name)"
        >
          <Icon name="lucide:bell" size="14" />
          监测
        </button>
        <Icon name="lucide:chevron-right" size="16" class="text-gray-300" />
      </li>
    </ul>

    <div class="mt-3 text-center">
      <NuxtLink to="/cities" class="text-sm text-brand-600 hover:underline">
        查看全部城市榜单 →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MOCK_CITY_RANK, riskTone } from "~/utils/mock";
import type { CityRecord, CityRecordWithTag } from "~/types/index";
import { getCityRiskTag } from "~/utils/dataProcess/index";

const props = defineProps<{
  riskCities: CityRecord[];
}>();

const computedRiskCities = computed<CityRecordWithTag[]>(() => {
  return props.riskCities.map((city) => {
    const tagObj = getCityRiskTag(city);
    return {
      ...city,
      ...tagObj,
    };
  });
});

const handleSubscribe = (city: string) => {
  ElMessage.success(`已开启「${city}」更新提醒（演示）`);
};
</script>
