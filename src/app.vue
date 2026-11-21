<template>
  <UApp :toaster="toaster">
    <!-- <NuxtLoadingIndicator /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CustomConfirm />
  </UApp>
</template>

<script setup lang="ts">
import { useHead } from "#imports";
import CustomConfirm from "@components/common/CustomConfirm.vue";
import type { ToasterProps } from "@nuxt/ui";

// 全局提示弹窗配置
const toaster: ToasterProps = { position: "top-right" };

useHead({
  bodyAttrs: { class: "font-sans" },
});
</script>
