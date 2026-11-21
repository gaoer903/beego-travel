<template>
  <section class="section">
    <div class="container-page">
      <NuxtLink
        to="/cities"
        class="text-brand-600 inline-flex items-center gap-1 text-sm hover:underline"
      >
        <Icon
          name="lucide:arrow-left"
          size="14"
        />
        返回城市榜
      </NuxtLink>

      <div
        v-if="currentCity"
        class="mt-4 mb-6"
      >
        <h1 class="heading-1 flex items-center gap-2">
          <Icon
            name="lucide:map-pin"
            size="28"
            class="text-brand-500"
          />
          {{ currentCity.name }} 避雷总览
        </h1>
        <p class="text-muted mt-2">汇总该城市已核实雷点</p>
      </div>
      <div
        v-if="currentCity"
        class="mt-3"
      >
        <div
          class="shadow-card grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white"
        >
          <!-- 风险分 -->
          <div class="flex flex-col items-center gap-1 px-4 py-5">
            <span class="text-muted text-tiny">风险分</span>
            <span
              class="text-4xl font-bold tabular-nums"
              :class="riskScoreColor(currentCity.risk_score)"
            >
              {{ currentCity.risk_score ?? "—" }}
            </span>
          </div>

          <!-- 累计举报 -->
          <div class="flex flex-col items-center gap-1 px-4 py-5">
            <span class="text-muted text-tiny">累计举报</span>
            <span class="text-4xl font-bold text-gray-900 tabular-nums">
              {{ currentCity.report_count ?? 0 }}
            </span>
          </div>

          <!-- 所属省份 -->
          <div class="flex flex-col items-center gap-1 px-4 py-5">
            <span class="text-muted text-tiny">所属省份</span>
            <span class="inline-flex items-center gap-1 pt-2 text-lg font-semibold text-gray-800">
              <Icon
                name="lucide:map-pin"
                size="16"
                class="text-brand-500"
              />
              {{ currentCity.province || "--" }}
            </span>
          </div>
        </div>

        <p class="text-muted text-tiny mt-2 flex items-center justify-end gap-1">
          <Icon
            name="lucide:clock"
            size="13"
          />
          数据更新于 {{ formatDate(currentCity.updated_at) }}
        </p>
      </div>

      <!-- 已核实雷点列表 -->
      <h2
        v-if="currentCity"
        class="heading-3 mt-8 flex items-center gap-2"
      >
        已核实雷点
        <span
          v-if="cityPitfalls?.length"
          class="text-muted text-sm font-normal"
        >
          共 {{ cityPitfalls.length }} 条
        </span>
      </h2>

      <!-- 加载态 -->
      <div
        v-if="pitfallsPending"
        class="text-muted mt-3 text-sm"
      >
        加载中…
      </div>

      <!-- 列表 -->
      <div
        v-else-if="cityPitfalls?.length"
        class="mt-3 flex flex-col gap-4"
      >
        <article
          v-for="item in cityPitfalls"
          :key="item.id"
          class="card-padded flex flex-col gap-2"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="flex items-center gap-2 font-semibold text-gray-900">
              {{ item.title }}
              <span :class="severityMeta[item.severity].class">
                {{ severityMeta[item.severity].label }}
              </span>
            </h3>
            <span class="badge-pending">{{ categoryLabel[item.category] }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <Icon
              name="lucide:store"
              size="14"
              class="text-gray-400"
            />
            <span class="font-medium text-gray-800">{{ item.entity_name }}</span>
            <span
              v-if="item.address"
              class="text-muted"
            >
              · {{ item.address }}
            </span>
          </div>

          <p class="line-clamp-2 text-sm leading-relaxed text-gray-600">
            {{ item.content }}
          </p>

          <div class="text-tiny text-muted flex items-center gap-4 border-t border-gray-100 pt-2">
            <span class="inline-flex items-center gap-1">
              <Icon
                name="lucide:thumbs-up"
                size="13"
              />
              {{ item.upvotes ?? 0 }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Icon
                name="lucide:clock"
                size="13"
              />
              {{ formatDate(item.created_at) }}
            </span>
          </div>
        </article>
      </div>

      <!-- 空态 -->
      <p
        v-else-if="currentCity"
        class="text-muted mt-3 text-sm"
      >
        该城市暂无已核实雷点
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CityRecord } from "~/types";

const supabase = useSupabaseClient();
const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

/** 城市详情页展示所需的雷点字段子集 */
interface CityPitfall {
  id: number;
  title: string;
  content: string;
  entity_name: string;
  address: string | null;
  category: "food" | "accommodation" | "traffic" | "shopping" | "attraction";
  severity: "low" | "medium" | "high";
  upvotes: number;
  created_at: string;
  status: "active" | "auditing" | "resolved";
}

const { data: currentCity } = await useAsyncData(
  () => `city-${slug.value}`,
  async () => {
    if (!slug.value) {
      throw createError({ statusCode: 404, statusMessage: "城市不存在" });
    }

    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .eq("slug", slug.value)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: "城市不存在" });
    }

    return data as CityRecord;
  },
  { watch: [slug] }
);

useSeoMeta({
  title: () => `${currentCity.value?.name ?? "城市"}避雷总览 · 避过`,
});

/** 该城市的所有已展示雷点上报 */
const { data: cityPitfalls, pending: pitfallsPending } = await useAsyncData(
  () => `city-pitfalls-${slug.value}`,
  async () => {
    const cityId = currentCity.value?.id;
    if (!cityId) return [];

    const { data, error } = await supabase
      .from("pitfalls")
      .select(
        "id, title, content, entity_name, address, category, severity, upvotes, created_at, status"
      )
      .eq("city_id", cityId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load city pitfalls:", error);
      return [];
    }

    return (data ?? []) as CityPitfall[];
  },
  { watch: [slug] }
);

/** 更新时间格式化：YYYY-MM-DD */
function formatDate(value?: string) {
  if (!value) return "--";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("zh-CN");
}

/** 按风险分选择数字颜色，阈值对齐 getCityRiskTag */
function riskScoreColor(score?: number) {
  const s = score ?? 0;
  if (s >= 80) return "text-risk-high";
  if (s >= 40) return "text-amber-600";
  return "text-risk-new";
}

/** 分类标签（对齐数据库 check_category） */
const categoryLabel: Record<CityPitfall["category"], string> = {
  food: "餐饮",
  accommodation: "住宿",
  traffic: "交通",
  shopping: "购物",
  attraction: "景区",
};

/** 严重程度标签与配色（对齐数据库 check_severity） */
const severityMeta: Record<CityPitfall["severity"], { label: string; class: string }> = {
  high: { label: "严重", class: "chip-risk-high" },
  medium: { label: "中等", class: "chip-risk-warn" },
  low: { label: "轻微", class: "chip-risk-new" },
};
</script>
