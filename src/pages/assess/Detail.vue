<template>
  <section class="section">
    <div class="container-page">
      <div
        v-if="pending"
        class="py-20 text-center"
      >
        <Icon
          name="lucide:loader-circle"
          size="40"
          class="text-brand-500 mb-4 animate-spin"
        />
        <p class="text-muted">AI 正在分析你的行程...</p>
      </div>

      <div
        v-else-if="!result"
        class="py-20 text-center"
      >
        <p class="text-muted">未找到该评估报告</p>
        <NuxtLink
          to="/assess"
          class="mt-4 inline-block"
        >
          <el-button type="primary">重新评估</el-button>
        </NuxtLink>
      </div>

      <template v-else>
        <div class="mb-6 flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-400">评估完成 · 报告 #{{ result.id }}</div>
            <h1 class="heading-2 mt-1">你的行程避坑报告</h1>
          </div>
          <div class="flex gap-2">
            <el-button @click="handleShare">
              <Icon
                name="lucide:share-2"
                size="14"
              />
              <span class="ml-1">分享</span>
            </el-button>
            <el-button @click="handleExport">
              <Icon
                name="lucide:download"
                size="14"
              />
              <span class="ml-1">导出 PDF</span>
            </el-button>
            <el-button
              type="primary"
              plain
            >
              <Icon
                name="lucide:star"
                size="14"
              />
              <span class="ml-1">收藏</span>
            </el-button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div class="card-padded flex flex-col items-center justify-center text-center">
            <div class="text-sm text-gray-500">综合评分</div>
            <div class="mt-2 text-6xl font-bold tabular-nums">
              {{ result.overallScore.toFixed(1) }}
              <span class="text-2xl text-gray-400">/10</span>
            </div>
            <el-tag
              v-if="overall"
              :class="[overall.color, overall.bg]"
              effect="plain"
              size="large"
              round
              class="mt-3"
            >
              {{ overall.label }}
            </el-tag>
          </div>

          <div class="card-padded col-span-2">
            <h3 class="heading-3 mb-4">维度评分</h3>
            <div class="space-y-3">
              <div
                v-for="d in dimensions"
                :key="d.label"
                class="flex items-center gap-4"
              >
                <span class="w-24 flex-shrink-0 text-sm text-gray-600">
                  {{ d.label }}
                </span>
                <el-progress
                  :percentage="d.score * 10"
                  :stroke-width="10"
                  :show-text="false"
                  :color="d.score >= 7 ? '#10b981' : d.score >= 5 ? '#f59e0b' : '#ef4444'"
                  class="flex-1"
                />
                <span class="w-12 text-right text-sm font-semibold tabular-nums">
                  {{ d.score.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-padded mt-6">
          <h3 class="heading-3 mb-4 flex items-center gap-2">
            <Icon
              name="lucide:calendar"
              size="18"
              class="text-brand-500"
            />
            行程时间线
          </h3>
          <ul class="space-y-3">
            <li
              v-for="item in result.timeline"
              :key="item.day"
              class="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
            >
              <Icon
                :name="statusIcon(item.status)"
                size="20"
                :class="
                  item.status === 'good'
                    ? 'text-brand-500'
                    : item.status === 'warn'
                      ? 'text-amber-500'
                      : 'text-red-500'
                "
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Day {{ item.day }}</span>
                  <span class="text-sm text-gray-500">{{ item.location }}</span>
                </div>
                <p class="mt-2 text-sm text-gray-700">{{ item.note }}</p>
                <p
                  v-if="item.advice"
                  class="text-brand-700 mt-2 flex items-center gap-1 text-sm"
                >
                  <Icon
                    name="lucide:lightbulb"
                    size="12"
                  />
                  {{ item.advice }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div class="card-padded mt-6">
          <h3 class="heading-3 mb-4 flex items-center gap-2">
            <Icon
              name="lucide:siren"
              size="18"
              class="text-red-500"
            />
            高风险提醒
          </h3>

          <div class="space-y-3">
            <div
              v-for="(risk, i) in result.risks.slice(0, 3)"
              :key="i"
              class="rounded-xl border-l-4 p-4"
              :class="[
                risk.level === 'high' && 'border-red-500 bg-red-50',
                risk.level === 'medium' && 'border-amber-500 bg-amber-50',
                risk.level === 'low' && 'border-blue-500 bg-blue-50',
              ]"
            >
              <div class="flex items-start gap-2">
                <Icon
                  :name="
                    risk.level === 'high'
                      ? 'lucide:triangle-alert'
                      : risk.level === 'medium'
                        ? 'lucide:lightbulb'
                        : 'lucide:info'
                  "
                  size="18"
                  :class="
                    risk.level === 'high'
                      ? 'text-red-600'
                      : risk.level === 'medium'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                  "
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ risk.title }}</h4>
                  <p class="mt-1 text-sm text-gray-700">{{ risk.description }}</p>
                  <p
                    v-if="risk.suggestion"
                    class="mt-2 text-sm font-medium text-gray-900"
                  >
                    建议：{{ risk.suggestion }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="result.risks.length > 3 && !result.isPaid && !userStore.isVip"
            class="relative mt-4 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
          >
            <div class="pointer-events-none absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
            <div class="relative text-center">
              <Icon
                name="lucide:lock"
                size="28"
                class="text-amber-600"
              />
              <h4 class="mt-2 font-semibold text-gray-900">
                还有 {{ result.risks.length - 3 }} 条深度建议
              </h4>
              <p class="mt-1 text-sm text-gray-600">包含完整避坑清单、隐藏成本计算、优化方案</p>
              <el-button
                class="mt-4"
                type="warning"
                @click="handleUnlock"
              >
                立即解锁 9.9 元
              </el-button>
            </div>
          </div>
        </div>

        <div class="card-padded mt-6">
          <h3 class="heading-3 mb-4 flex items-center gap-2">
            <Icon
              name="lucide:wallet"
              size="18"
              class="text-amber-600"
            />
            隐藏成本预估
          </h3>
          <el-table :data="result.hiddenCosts">
            <el-table-column
              prop="name"
              label="项目"
            />
            <el-table-column
              prop="unit"
              label="单位"
              width="120"
            />
            <el-table-column
              label="预估金额"
              width="160"
              align="right"
            >
              <template #default="{ row }">
                <span class="font-semibold text-red-600">¥ {{ row.amount }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-4 flex items-center justify-end gap-2 text-base">
            <span class="text-gray-500">合计预估：</span>
            <span class="text-xl font-bold text-red-600">¥ {{ totalCost }}</span>
          </div>
        </div>

        <div class="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
          <h3 class="heading-3 mb-4 flex items-center gap-2">
            <Icon
              name="lucide:tag"
              size="18"
              class="text-brand-500"
            />
            推荐订票渠道
          </h3>
          <p class="text-muted mb-4 text-sm">*跳转到第三方平台预订，已为你比价（CPS 接入中）</p>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="ch in ['携程', '飞猪', '美团']"
              :key="ch"
              class="rounded-xl bg-white p-4 text-center"
            >
              <div class="font-semibold">{{ ch }}</div>
              <div class="mt-1 text-xs text-gray-500">同步比价中...</div>
              <el-button
                class="mt-3"
                size="small"
                type="primary"
                plain
              >
                去预订
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { scoreLevel } from "~/utils/format";

const route = useRoute();
const assessStore = useAssessStore();
const userStore = useUserStore();

const { data: result, pending } = await useLazyFetch(`/api/assess/${route.params.id}`, {
  default: () => assessStore.currentResult,
});

useSeoMeta({
  title: () => `行程评估报告 #${route.params.id} · 避过`,
});

const overall = computed(() => {
  if (!result.value) return null;
  return scoreLevel(result.value.overallScore);
});

const dimensions = computed(() => {
  if (!result.value) return [];
  const d = result.value.dimensions;
  return [
    { label: "时间合理性", score: d.time },
    { label: "路线合理性", score: d.route },
    { label: "性价比", score: d.costPerf },
    { label: "体力消耗", score: d.energy },
    { label: "季节适配", score: d.season },
  ];
});

const totalCost = computed(() => {
  if (!result.value) return 0;
  return result.value.hiddenCosts.reduce((sum, c) => sum + c.amount, 0);
});

const statusIcon = (status: "good" | "warn" | "bad") => {
  if (status === "good") return "lucide:circle-check";
  if (status === "warn") return "lucide:triangle-alert";
  return "lucide:circle-x";
};

const handleUnlock = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning("请先登录");
    return;
  }
  navigateTo("/vip");
};

const handleShare = () => {
  ElMessage.success("分享卡片生成功能开发中");
};

const handleExport = () => {
  if (!userStore.isVip) {
    ElMessageBox.confirm("导出 PDF 报告需要 VIP 权限", "VIP 专属功能", {
      confirmButtonText: "开通 VIP",
      cancelButtonText: "稍后",
    })
      .then(() => navigateTo("/vip"))
      .catch(() => {});
    return;
  }
  ElMessage.success("PDF 报告生成中（功能开发中）");
};
</script>
