<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-8">
        <h1 class="heading-1">商户 / 景点</h1>
        <p class="mt-2 text-muted">基于 12315、黑猫投诉等公开数据，看穿网红景点的滤镜</p>
      </div>

      <div class="mb-6 flex items-center gap-3">
        <el-input
          v-model="keyword"
          placeholder="搜索景点 / 城市，如：九寨沟、丽江"
          size="large"
          clearable
          class="!w-[360px]"
        >
          <template #prefix>
            <Icon name="lucide:search" size="16" class="text-gray-400" />
          </template>
        </el-input>

        <el-select v-model="category" placeholder="景点类型" size="large" clearable class="!w-40">
          <el-option label="全部" value="" />
          <el-option label="古镇" value="ancient_town" />
          <el-option label="自然景观" value="natural" />
          <el-option label="城市" value="urban" />
          <el-option label="山岳" value="mountain" />
        </el-select>

        <el-radio-group v-model="sortBy" size="large">
          <el-radio-button value="pit">坑指数</el-radio-button>
          <el-radio-button value="score">评分</el-radio-button>
          <el-radio-button value="review">点评数</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="filtered.length === 0" class="py-20 text-center text-muted">
        没有找到匹配的景点
      </div>

      <div v-else class="grid grid-cols-3 gap-5">
        <NuxtLink
          v-for="spot in filtered"
          :key="spot.id"
          :to="`/spots/${spot.id}`"
          class="group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              :src="spot.coverUrl"
              :alt="spot.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onerror="this.style.display='none'"
            />
            <div class="absolute right-3 top-3">
              <el-tag
                :type="spot.pitScore >= 7 ? 'danger' : spot.pitScore >= 5 ? 'warning' : 'success'"
                effect="dark"
                round
              >
                坑指数 {{ spot.pitScore.toFixed(1) }}
              </el-tag>
            </div>
          </div>

          <div class="p-5">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-brand-700">
                  {{ spot.name }}
                </h3>
                <div class="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="lucide:map-pin" size="12" />
                  {{ spot.province }} · {{ spot.city }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold tabular-nums">
                  {{ spot.baseScore.toFixed(1) }}
                </div>
                <div class="text-xs" :class="scoreLevel(spot.baseScore).color">
                  {{ scoreLevel(spot.baseScore).label }}
                </div>
              </div>
            </div>

            <p class="mt-3 line-clamp-2 text-sm text-gray-600">
              {{ spot.description }}
            </p>

            <div class="mt-3 flex flex-wrap gap-1.5">
              <el-tag
                v-for="t in spot.badTags.slice(0, 3)"
                :key="t"
                size="small"
                type="danger"
                effect="plain"
                round
              >
                {{ t }}
              </el-tag>
            </div>

            <div class="mt-3 text-xs text-gray-400">
              {{ formatNumber(spot.reviewCount) }} 条点评
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockSpots } from '~/utils/mock'
import { scoreLevel, formatNumber } from '~/utils/format'

useSeoMeta({
  title: '商户/景点 · 避过',
  description: '搜索景点，查看真实差评聚合与坑指数评分。',
})

const route = useRoute()
const router = useRouter()
const keyword = ref((route.query.keyword as string) || '')
const sortBy = ref<'pit' | 'score' | 'review'>(
  (route.query.sort as 'pit' | 'score' | 'review') || 'pit',
)
const category = ref<string>('')

const filtered = computed(() => {
  const list = mockSpots.filter((s) => {
    if (keyword.value && !s.name.includes(keyword.value) && !s.city.includes(keyword.value)) {
      return false
    }
    if (category.value && s.category !== category.value) return false
    return true
  })

  const sortMap = {
    pit: (a: typeof list[0], b: typeof list[0]) => b.pitScore - a.pitScore,
    score: (a: typeof list[0], b: typeof list[0]) => b.baseScore - a.baseScore,
    review: (a: typeof list[0], b: typeof list[0]) => b.reviewCount - a.reviewCount,
  }
  return [...list].sort(sortMap[sortBy.value])
})

watch([keyword, sortBy], () => {
  router.replace({ query: { keyword: keyword.value || undefined, sort: sortBy.value } })
})
</script>
