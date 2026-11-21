<template>
  <NuxtLink
    to="/"
    class="flex w-[160px] items-center gap-2.5"
  >
    <NuxtImg
      src="/imgs/logo.png"
      alt="避过"
      width="60"
      height="60"
      format="webp"
    />
    <span class="flex flex-col leading-tight">
      <span
        class="font-bold tracking-tight text-gray-900"
        :class="size === 'lg' ? 'text-2xl' : 'text-xl'"
      >
        避过
      </span>
      <span
        v-if="showSlogan"
        class="text-[11px] font-medium text-gray-400"
      >
        这地方，避过吗？
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showSlogan?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  { showSlogan: true, size: "md" }
);
</script>
