<template>
  <PagePlaceholder
    icon="lucide:clipboard-list"
    title="行前清单生成"
    subtitle="一键生成个人化避雷 PDF 清单"
    :features="[
      '根据目的地自动生成投诉电话 / 报案渠道清单',
      '常见陷阱速查表',
      '应急联系卡片可下载到手机',
      '导出 PDF 一键打印',
    ]"
  />
</template>

<script setup lang="ts">
useSeoMeta({ title: '行前清单 · 避过' })
</script>
