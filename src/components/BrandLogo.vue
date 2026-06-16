<template>
  <NuxtLink to="/" class="flex items-center gap-2.5 w-[160px]">
    <img :src="LOGO_IMG" alt="避过" class="w-[60px] h-[60px]" />
    <span class="flex flex-col leading-tight">
      <span
        class="font-bold tracking-tight text-gray-900"
        :class="size === 'lg' ? 'text-2xl' : 'text-xl'"
      >
        避过
      </span>
      <span v-if="showSlogan" class="text-[11px] font-medium text-gray-400">
        这地方，避过吗？
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import LOGO_IMG from "@assets/images/logo.png";
withDefaults(
  defineProps<{
    showSlogan?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  { showSlogan: true, size: "md" }
);
</script>
