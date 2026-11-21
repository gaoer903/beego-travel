<template>
  <NuxtImg
    src="/imgs/mascot.png"
    :width="size"
    height="80"
    alt="避避"
    format="webp"
    class="object-contain drop-shadow-[0_4px_12px_rgba(124,58,237,0.18)] select-none"
  />
</template>

<script setup lang="ts">

withDefaults(
  defineProps<{
    size?: number;
    prop?: "magnifier" | "pointer" | "wink";
    flip?: boolean;
  }>(),
  { size: 96, prop: "magnifier", flip: false }
);
</script>
