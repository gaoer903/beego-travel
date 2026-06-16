<template>
  <section class="section">
    <div class="mx-auto w-[420px]">
      <div class="card-padded">
        <h1 class="mb-6 text-center heading-2">登录 避过</h1>

        <el-tabs v-model="tab" stretch>
          <el-tab-pane label="手机号登录" name="phone">
            <div class="space-y-4">
              <el-input
                v-model="phone"
                size="large"
                placeholder="请输入手机号"
              >
                <template #prefix>
                  <Icon name="lucide:smartphone" size="16" class="text-gray-400" />
                </template>
              </el-input>

              <div class="flex gap-2">
                <el-input
                  v-model="code"
                  size="large"
                  placeholder="验证码"
                  class="flex-1"
                >
                  <template #prefix>
                    <Icon name="lucide:lock-keyhole" size="16" class="text-gray-400" />
                  </template>
                </el-input>
                <el-button
                  size="large"
                  :disabled="countdown > 0"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>

              <el-button type="primary" size="large" class="w-full" @click="handleLogin">
                登录 / 注册
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="微信扫码" name="wechat">
            <div class="py-8 text-center">
              <div class="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Icon name="lucide:message-circle" size="56" />
              </div>
              <p class="mt-4 text-sm text-muted">微信扫码登录（接入开发中）</p>
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-divider>或</el-divider>

        <el-button class="w-full" plain @click="handleMockLogin">
          <Icon name="lucide:log-in" size="14" class="mr-1.5" />
          使用 Mock 账号一键登录（开发用）
        </el-button>

        <p class="mt-6 text-center text-xs text-gray-400">
          登录即代表同意
          <a href="#" class="text-brand-600 hover:underline">用户协议</a>
          和
          <a href="#" class="text-brand-600 hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@stores/user'

useSeoMeta({ title: '登录 / 注册 · 避过' })

const userStore = useUserStore()
const router = useRouter()

const tab = ref<'phone' | 'wechat'>('phone')
const phone = ref('')
const code = ref('')
const codeSent = ref(false)
const countdown = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  codeSent.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
  ElMessage.success('验证码已发送（mock：123456）')
}

const handleLogin = () => {
  if (!phone.value || !code.value) {
    ElMessage.warning('请填写完整')
    return
  }
  userStore.mockLogin()
  ElMessage.success('登录成功')
  router.push('/user')
}

const handleMockLogin = () => {
  userStore.mockLogin()
  router.push('/user')
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
