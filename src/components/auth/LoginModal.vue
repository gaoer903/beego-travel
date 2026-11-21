<template>
  <UModal v-model:open="visible">
    <template #content>
      <div class="p-8">
        <h2 class="text-brand-500 text-xl font-bold">登录避过</h2>

        <p class="mt-2 text-sm text-gray-500">登录后可收藏城市、监测风险、举报雷点</p>

        <UInput
          v-model="email"
          class="mt-6 w-full"
          size="xl"
          placeholder="请输入邮箱"
          :color="emailError ? 'error' : 'neutral'"
        />

        <p
          v-if="emailError"
          class="mt-1 text-sm text-red-500"
        >
          {{ emailError }}
        </p>

        <UButton
          block
          size="xl"
          class="mt-4"
          :loading="loading"
          @click="submit"
        >
          发送登录链接
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useLoginModal } from "@composables/useLoginModal";

const { visible } = useLoginModal();
const toast = useToast();
const route = useRoute();

const supabase = useSupabaseClient();

const email = ref("");
const loading = ref(false);

const emailError = computed(() => {
  if (!email.value) return "";

  const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailReg.test(email.value) ? "" : "请输入正确的邮箱地址";
});

const submit = async () => {
  if (!email.value) {
    toast.add({
      title: "邮箱不能为空",
      color: "error",
      duration: 2000,
    });
    return;
  }

  if (emailError.value) {
    toast.add({
      title: "邮箱格式不正确",
      color: "warning",
      duration: 2000,
    });
    return;
  }

  loading.value = true;

  // 先记录下用户登录所在的页面路径
  localStorage.setItem("LOGIN_REDIRECT", route.fullPath);

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  });

  loading.value = false;

  if (error) {
    const errMessage = error.code!.includes("over_email_send_rate_limit")
      ? "请求过于频繁，请稍后再试"
      : "请稍后再试";
    toast.add({
      title: "发送失败",
      description: errMessage,
      color: "error",
      duration: 2000,
    });
    return;
  }

  toast.add({
    title: "邮件已发送",
    description: "请前往邮箱完成登录",
    color: "success",
  });
};
</script>
