<template>
  <PagePlaceholder
    icon="lucide:map-pin"
    title="避雷地图"
    subtitle="基于真实投诉数据的全国城市风险热力图"
    :features="[
      'ECharts 中国地图 + 实时投诉数据热力图',
      '点击城市进入避雷总览',
      '支持按交通 / 住宿 / 餐饮 / 景区分层显示',
      '订阅城市更新提醒',
    ]"
  />
</template>

<script setup lang="ts">
useSeoMeta({
  title: "避雷地图 · 避过",
  description: "基于真实投诉数据的全国避雷热力图",
});
</script>
