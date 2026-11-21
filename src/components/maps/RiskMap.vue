<template>
  <div class="card flex h-full flex-col overflow-hidden p-0">
    <div class="flex items-center justify-between px-5 pt-5 pb-3">
      <div>
        <h3 class="heading-3">国内避雷热力图</h3>
        <p class="text-muted mt-0.5 text-xs">滚轮缩放 · 拖拽平移</p>
      </div>
      <Icon
        name="i-lucide:map-minus"
        size="20"
        class="text-brand-400"
      />
    </div>

    <div class="risk-map-shell min-h-[360px] w-full flex-1 bg-[#f7fffb] sm:min-h-[400px]">
      <VChart
        v-if="isMapLoaded"
        class="risk-map-chart block h-full w-full"
        :option="riskChartOptions"
        autoresize
      />
      <div
        v-else
        class="text-muted flex h-full items-center justify-center text-sm"
      >
        地图加载中…
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { registerMap } from "echarts/core";
import type { CityRecord } from "~/types";

const props = defineProps<{
  mapData: CityRecord[];
}>();

const colorMode = useColorMode();
const isMapLoaded = ref(false);

const scatterSeriesData = computed(() => {
  return props.mapData.map((item) => ({
    name: item.name,
    value: [item.longitude, item.latitude, item.risk_score],
  }));
});

onMounted(async () => {
  try {
    const response = await fetch("/maps/chinaMap.json");
    const chinaGeoJson = await response.json();
    registerMap("china", chinaGeoJson);
    isMapLoaded.value = true;
  } catch (error) {
    console.error("Failed to load map geojson:", error);
  }
});

const riskChartOptions = computed(() => {
  const isDark = colorMode.value === "dark";

  const palette = isDark
    ? {
        mapFill: "#134e4a",
        mapBorder: "#2dd4bf",
        mapHover: "#115e59",
        canvasBg: "#042f20",
        tooltipBg: "rgba(4, 47, 46, 0.7)",
        tooltipBorder: "rgba(94, 234, 212, 0.25)",
        tooltipText: "#ecfdf5",
        tooltipSubText: "#a7f3d0",
        scatterLow: "#5eead4",
        scatterHigh: "#ff6633",
        scatterShadow: "rgba(253, 230, 138, 0.25)",
      }
    : {
        mapFill: "#f0fdf4",
        mapBorder: "#bbf7d0",
        mapHover: "#ecfdf5",
        canvasBg: "#f7fffb",
        tooltipBg: "rgba(255, 255, 255, 0.96)",
        tooltipBorder: "#d1fae5",
        tooltipText: "#047857",
        tooltipSubText: "#10b981",
        scatterLow: "#6ee7b7",
        scatterHigh: "#fdba74",
        scatterShadow: "rgba(110, 231, 183, 0.35)",
      };

  return {
    backgroundColor: palette.canvasBg,
    tooltip: {
      trigger: "item",
      backgroundColor: palette.tooltipBg,
      borderColor: palette.tooltipBorder,
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: palette.tooltipText,
      },
      formatter: (params: { name: string; value?: number[] }) => {
        const score = params.value?.[2] ?? 0;
        return `<div>
          <p style="font-weight:600;font-size:13px;margin:0;color:${palette.tooltipText};">📍 ${params.name}</p>
          <p style="font-size:12px;color:${palette.tooltipSubText};margin:6px 0 0;">
            城市风险分：<span style="color:${palette.scatterHigh};font-weight:600;">${score}</span>
          </p>
        </div>`;
      },
    },
    geo: {
      map: "china",
      roam: true,
      scaleLimit: {
        min: 0.85,
        max: 4,
      },
      // 缩小边距 + 按短边缩放，尽量放大又不溢出
      top: 8,
      bottom: 6,
      left: 10,
      right: 10,
      layoutCenter: ["50%", "50%"],
      layoutSize: "96%",
      aspectScale: 0.78,
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: palette.mapFill,
        borderColor: palette.mapBorder,
        borderWidth: 1,
      },
      emphasis: {
        label: {
          show: true,
          color: isDark ? "#ecfdf5" : "#10b981",
          fontSize: 12,
          fontWeight: 600,
        },
        itemStyle: {
          areaColor: palette.mapHover,
          borderColor: isDark ? "#5eead4" : "#86efac",
        },
      },
    },
    series: [
      {
        name: "城市雷点",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: scatterSeriesData.value,
        clip: true,
        rippleEffect: {
          brushType: "stroke",
          scale: 2.2,
          period: 6,
        },
        symbolSize: (val: number[]) => {
          const score = val[2] || 0;
          return Math.min(Math.max(score * 1.5, 10), 22);
        },
        itemStyle: {
          color: (params: { value: number[] }) => {
            const score = params.value?.[2] ?? 0;
            const ratio = Math.min(score / 100, 1);
            return ratio > 0.55 ? palette.scatterHigh : palette.scatterLow;
          },
          shadowBlur: 6,
          shadowColor: palette.scatterShadow,
        },
        emphasis: {
          disabled: false,
          scale: true,
        },
      },
    ],
  };
});
</script>

<style scoped>
.risk-map-shell {
  overflow: hidden;
}

.risk-map-chart :deep(canvas) {
  display: block;
}
</style>
