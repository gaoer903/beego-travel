<template>
  <img
    :src="mascotUrl"
    :width="size"
    :height="size"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      transform: flip ? 'scaleX(-1)' : 'none',
    }"
    alt="避避"
    class="select-none object-contain drop-shadow-[0_4px_12px_rgba(124,58,237,0.18)]"
    draggable="false"
  />
</template>

<script setup lang="ts">
/**
 * 避避吉祥物（透明 PNG）
 * - 图片：assets/images/mascot.png（已抠图）
 * - 保留 prop 参数以兼容旧调用（暂只一张图）
 */
import mascotUrl from '~/assets/images/mascot.png'

withDefaults(
  defineProps<{
    size?: number
    prop?: 'magnifier' | 'pointer' | 'wink'
    flip?: boolean
  }>(),
  { size: 96, prop: 'magnifier', flip: false },
)
</script>
