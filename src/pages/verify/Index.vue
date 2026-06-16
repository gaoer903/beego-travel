<template>
  <PagePlaceholder
    icon="lucide:shield-check"
    title="真假鉴别"
    subtitle="拍照识别商家 / 证件 / 价格真伪"
    :features="[
      '拍照识别证照真伪（导游证 / 旅行社资质）',
      '海鲜重量 / 价格陷阱识别',
      '景区门票真伪比对',
      '玉石、丝绸等纪念品鉴定提示',
    ]"
  />
</template>

<script setup lang="ts">
useSeoMeta({ title: '真假鉴别 · 避过' })
</script>
