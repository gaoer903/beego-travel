<template>
  <PagePlaceholder
    icon="lucide:bookmark"
    title="我的避雷清单"
    subtitle="收藏的雷点 / 行前清单 / 应急联系卡片"
    :features="[
      '雷点收藏 + 离线访问',
      '已生成的行前清单 PDF 列表',
      '一键分享给同行人',
    ]"
  />
</template>

<script setup lang="ts">
useSeoMeta({ title: '我的避雷清单 · 避过' })
</script>
