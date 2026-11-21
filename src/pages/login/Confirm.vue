<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
    <UCard class="w-full max-w-md">
      <div class="flex flex-col items-center py-4 text-center">
        <!-- Brand -->
        <h1 class="text-primary text-3xl font-bold">
          避过
          <span class="text-brand-500 text-2xl">BeeGo</span>
        </h1>

        <p class="text-muted mt-2 text-sm">避开踩坑，发现真实体验</p>

        <!-- Loading -->
        <template v-if="status === 'loading'">
          <div class="bg-primary/10 mt-8 flex h-16 w-16 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-loader-circle"
              class="text-primary h-8 w-8 animate-spin"
            />
          </div>

          <h2 class="mt-6 text-lg font-semibold">正在验证登录</h2>

          <p class="text-muted mt-2 text-sm">请稍候，我们正在确认您的身份</p>

          <UProgress
            animation="carousel"
            class="mt-6 w-full"
          />
        </template>

        <!-- Success -->
        <template v-else-if="status === 'success'">
          <div class="bg-success/10 mt-8 flex h-16 w-16 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-circle-check-big"
              class="text-success h-8 w-8"
            />
          </div>

          <h2 class="mt-6 text-lg font-semibold">登录成功</h2>
          <p class="text-muted mt-2 text-sm">正在返回之前访问的页面...</p>
        </template>

        <!-- Error -->
        <template v-else>
          <div class="bg-error/10 mt-8 flex h-16 w-16 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-circle-alert"
              class="text-error h-8 w-8"
            />
          </div>

          <h2 class="mt-6 text-lg font-semibold">登录失败</h2>

          <p class="text-muted mt-2 text-sm">
            {{ errorMessage }}
          </p>

          <UButton
            class="mt-6"
            to="/"
          >
            返回首页
          </UButton>
        </template>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const supabase = useSupabaseClient();
const route = useRoute();
type Status = "loading" | "success" | "error";

const status = ref<Status>("loading");
const errorMessage = ref("");

onMounted(async () => {
  try {
    const code = route.query.code;

    if (!code) {
      throw new Error("缺少授权参数");
    }

    await supabase.auth.exchangeCodeForSession(code as string);

    status.value = "success";

    const redirect = localStorage.getItem("LOGIN_REDIRECT");

    setTimeout(() => {
      navigateTo(redirect || "/");
    }, 800);
  } catch (error) {
    status.value = "error";
    errorMessage.value = "登录链接已失效或已过期";
  }
});
</script>

<style scoped></style>
