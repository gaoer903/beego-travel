<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CustomConfirm />
  </UApp>
</template>

<script setup lang="ts">
import { useHead } from "#imports";
import CustomConfirm from "@components/common/CustomConfirm.vue";

useHead({
  bodyAttrs: { class: "font-sans" },
});
</script>
