<template>
  <PagePlaceholder
    icon="lucide:bell"
    title="城市更新提醒"
    subtitle="订阅城市的雷点更新"
    :features="['微信 / 站内推送', '按风险等级设置接收阈值', '出发前一周自动汇总']"
  />
</template>

<script setup lang="ts">
useSeoMeta({ title: "城市更新提醒 · 避过" });
</script>
