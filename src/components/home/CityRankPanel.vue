<template>
  <div class="card flex h-full flex-col p-5">
    <div class="mb-3 flex items-center justify-between">
      <div>
        <h3 class="heading-3">高风险城市 TOP5</h3>
        <p class="text-muted mt-0.5 text-xs">近 7 天投诉密度排名</p>
      </div>
      <Icon
        name="lucide:trophy"
        size="20"
        class="text-amber-500"
      />
    </div>

    <ul class="flex flex-1 flex-col justify-between divide-y divide-gray-100">
      <li
        v-for="(item, index) in computedRiskCities"
        :key="item.id"
        class="flex items-center gap-3 py-3"
      >
        <NuxtLink
          :to="cityDetailTo(item)"
          class="hover:text-brand-700 flex min-w-0 flex-1 items-center gap-3 text-gray-900"
        >
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            :class="
              item.tagType === 'danger' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
            "
          >
            {{ index + 1 }}
          </span>
          <span class="flex-1 truncate text-[15px] font-semibold">
            {{ item.name }}
          </span>
          <span :class="item.tagClass">{{ item.tag }}</span>
          <Icon
            name="lucide:chevron-right"
            size="16"
            class="text-gray-300"
          />
        </NuxtLink>
        <button
          type="button"
          class="hover:text-brand-700 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          @click.stop="handleSubscribe(item.name)"
        >
          <Icon
            name="lucide:bell"
            size="14"
          />
          监测
        </button>
      </li>
    </ul>

    <div class="mt-3 text-center">
      <NuxtLink
        to="/cities"
        class="text-brand-600 text-sm hover:underline"
      >
        查看全部城市榜单 →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const cityDetailTo = (city: CityRecord) => ({
  name: "cities-detail",
  params: { slug: city.slug },
});

const handleSubscribe = (city: string) => {
  ElMessage.success(`已开启「${city}」更新提醒（演示）`);
};
</script>
