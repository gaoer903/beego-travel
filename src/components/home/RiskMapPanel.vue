<template>
  <div class="card p-5">
    <div class="mb-2 flex items-center justify-between">
      <div>
        <h3 class="heading-3">国内避雷热力图</h3>
        <p class="mt-0.5 text-xs text-muted">点击查看城市详情</p>
      </div>
      <Icon name="lucide:map" size="20" class="text-brand-500" />
    </div>

    <!-- 地图占位 SVG（中国轮廓简化） -->
    <div class="relative mt-2 aspect-[5/3] w-full overflow-hidden rounded-xl bg-brand-50/40">
      <svg viewBox="0 0 600 400" class="h-full w-full">
        <!-- 简化中国轮廓 -->
        <path
          d="M120 180 L140 130 L200 110 L260 90 L340 80 L420 100 L500 130
             L540 170 L520 220 L500 260 L470 300 L430 330 L380 350 L320 360
             L260 350 L210 330 L170 290 L150 240 Z"
          fill="#ecfdf5"
          stroke="#86efac"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <!-- 海南 -->
        <ellipse cx="420" cy="365" rx="14" ry="8" fill="#ecfdf5" stroke="#86efac" stroke-width="2" />
        <!-- 台湾 -->
        <ellipse cx="500" cy="320" rx="6" ry="14" fill="#ecfdf5" stroke="#86efac" stroke-width="2" />

        <!-- 热力点 -->
        <g>
          <g v-for="(p, i) in hotspots" :key="i">
            <circle
              :cx="p.x"
              :cy="p.y"
              :r="p.r + 6"
              :fill="p.fill"
              opacity="0.18"
            />
            <circle
              :cx="p.x"
              :cy="p.y"
              :r="p.r"
              :fill="p.fill"
              opacity="0.7"
            />
          </g>
        </g>
      </svg>
    </div>

    <!-- 图例 -->
    <div class="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
      <span
        v-for="l in legend"
        :key="l.label"
        class="flex items-center gap-1"
      >
        <span
          class="h-2.5 w-2.5 rounded-full"
          :style="{ background: l.color }"
        />
        {{ l.label }}
      </span>
    </div>

    <div class="mt-3 text-center">
      <NuxtLink to="/map" class="text-sm text-brand-600 hover:underline">
        查看全部城市 →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 国内避雷热力图（卡通描边版占位）+ 图例
// 真实热力图后续替换为 ECharts/AntV 地图组件
const legend = [
  { color: '#bbf7d0', label: '低风险' },
  { color: '#fde68a', label: '较低风险' },
  { color: '#fdba74', label: '中风险' },
  { color: '#fb923c', label: '较高风险' },
  { color: '#dc2626', label: '高风险' },
]

// 热力点（粗略经纬投影到 svg 视口）
const hotspots = [
  { x: 320, y: 260, r: 18, fill: '#dc2626', label: '云南' },
  { x: 360, y: 290, r: 14, fill: '#ea580c', label: '广西' },
  { x: 280, y: 240, r: 12, fill: '#fb923c', label: '四川' },
  { x: 420, y: 340, r: 14, fill: '#dc2626', label: '海南' },
  { x: 440, y: 200, r: 10, fill: '#fdba74', label: '湖南' },
  { x: 470, y: 170, r: 9, fill: '#fde68a', label: '上海' },
  { x: 240, y: 180, r: 10, fill: '#fdba74', label: '陕西' },
]
</script>
