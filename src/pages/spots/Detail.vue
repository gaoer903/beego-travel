<template>
  <section class="section">
    <div class="container-page">
      <div class="card-padded">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="heading-1">{{ spot.name }}</h1>
            <div class="text-muted mt-2 flex items-center gap-2">
              <Icon
                name="lucide:map-pin"
                size="14"
              />
              {{ spot.province }} · {{ spot.city }}
              <span class="text-gray-300">·</span>
              {{ formatNumber(spot.reviewCount) }} 条点评
            </div>
          </div>
          <div class="flex gap-2">
            <el-button>
              <Icon
                name="lucide:star"
                size="14"
              />
              <span class="ml-1">收藏</span>
            </el-button>
            <el-button>
              <Icon
                name="lucide:share-2"
                size="14"
              />
              <span class="ml-1">分享</span>
            </el-button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-6">
          <div>
            <div class="text-sm text-gray-500">综合评分</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-5xl font-bold tabular-nums">
                {{ spot.baseScore.toFixed(1) }}
              </span>
              <span class="text-gray-400">/ 10</span>
              <el-tag
                :class="[scoreLevel(spot.baseScore).color, scoreLevel(spot.baseScore).bg]"
                round
              >
                {{ scoreLevel(spot.baseScore).label }}
              </el-tag>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">坑指数</div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-5xl font-bold text-red-600 tabular-nums">
                {{ spot.pitScore.toFixed(1) }}
              </span>
              <span class="text-gray-400">/ 10</span>
            </div>
            <el-progress
              :percentage="spot.pitScore * 10"
              :show-text="false"
              :color="spot.pitScore >= 7 ? '#ef4444' : '#f59e0b'"
              class="mt-2"
            />
          </div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-6">
        <div class="card-padded">
          <h3 class="heading-3 mb-3 flex items-center gap-1">
            <Icon
              name="lucide:thumbs-up"
              size="16"
              class="text-brand-500"
            />
            适合人群
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="t in spot.suitableFor"
              :key="t"
              type="success"
              round
            >
              {{ t }}
            </el-tag>
          </div>

          <h3 class="heading-3 mt-6 mb-3 flex items-center gap-1">
            <Icon
              name="lucide:sun"
              size="16"
              class="text-amber-500"
            />
            最佳季节
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="s in spot.bestSeason"
              :key="s"
              type="info"
              round
            >
              {{ s }}
            </el-tag>
          </div>
        </div>

        <div class="card-padded">
          <h3 class="heading-3 mb-3 flex items-center gap-1">
            <Icon
              name="lucide:thumbs-down"
              size="16"
              class="text-gray-400"
            />
            不适合
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="t in spot.unsuitableFor"
              :key="t"
              type="danger"
              effect="plain"
              round
            >
              {{ t }}
            </el-tag>
          </div>

          <h3 class="heading-3 mt-6 mb-3 flex items-center gap-1">
            <Icon
              name="lucide:triangle-alert"
              size="16"
              class="text-red-500"
            />
            差评热词
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="t in spot.badTags"
              :key="t"
              type="danger"
              effect="dark"
              round
            >
              {{ t }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="card-padded mt-6">
        <h3 class="heading-3 mb-4 flex items-center gap-1">
          <Icon
            name="lucide:camera"
            size="16"
            class="text-brand-500"
          />
          滤镜对比
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="mb-2 text-sm text-gray-500">小红书宣传图</div>
            <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
              <img
                :src="spot.coverUrl"
                :alt="spot.name"
                class="h-full w-full object-cover"
                onerror="this.style.display = 'none'"
              />
            </div>
          </div>
          <div>
            <div class="mb-2 text-sm text-gray-500">用户实拍图（待用户投稿）</div>
            <div
              class="flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-100 text-gray-400"
            >
              <Icon
                name="lucide:image"
                size="32"
              />
              <span class="ml-2 text-sm">等待投稿</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center"
      >
        <Icon
          name="lucide:lock"
          size="28"
          class="text-amber-600"
        />
        <h3 class="heading-3 mt-2">深度差评聚合 + 周边坑点 + 替代推荐</h3>
        <p class="text-muted mt-1 text-sm">完整真实差评、黑车黑导游名单、类似但更小众的替代景点</p>
        <el-button
          class="mt-4"
          type="warning"
          @click="handleUnlock"
        >
          VIP 解锁查看
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockSpots } from "~/utils/mock";
import { scoreLevel, formatNumber } from "~/utils/format";

const route = useRoute();
const userStore = useUserStore();

const spot = computed(() => mockSpots.find((s) => s.id === route.params.id) || mockSpots[0]!);

useSeoMeta({
  title: () => `${spot.value.name} 真实评分 · 避过`,
  description: () =>
    `${spot.value.name} 综合评分 ${spot.value.baseScore.toFixed(1)}，坑指数 ${spot.value.pitScore.toFixed(1)}。基于全网公开点评 AI 提炼。`,
});

const handleUnlock = () => {
  if (!userStore.isVip) navigateTo("/vip");
};
</script>
