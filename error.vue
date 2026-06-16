<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <div class="text-7xl font-bold gradient-text">
        {{ error.statusCode || 500 }}
      </div>
      <h1 class="mt-4 text-2xl font-semibold">出了点小问题</h1>
      <p class="mt-2 text-gray-500">{{ error.message || "页面正在维护中" }}</p>
      <el-button class="mt-6" type="primary" size="large" @click="handleHome"> 返回首页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NuxtErrorProps {
  error: { statusCode?: number; message?: string };
}
defineProps<NuxtErrorProps>();

const handleHome = () => clearError({ redirect: "/" });
</script>
