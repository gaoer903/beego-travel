<template>
  <footer class="border-t border-gray-100 bg-white">
    <div class="container-page py-10">
      <div class="grid grid-cols-4 gap-8">
        <div>
          <BrandLogo />
          <p class="mt-3 text-sm text-gray-500">
            基于 12315、黑猫投诉、文旅通报<br />
            等公开真实数据的城市避雷工具。
          </p>
        </div>

        <div v-for="group in footerLinks" :key="group.title">
          <h4 class="text-sm font-semibold text-gray-900">{{ group.title }}</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="link in group.links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-gray-500 transition-colors hover:text-brand-600"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-5 text-sm text-gray-400"
      >
        <span>© {{ year }} {{ config.public.appName }} · 仅供参考，请理性出行</span>
        <span class="text-xs">数据来源：12315 / 黑猫投诉 / 文旅通报 · 不代表平台立场</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { footerLinks } = useNavigation()
const year = new Date().getFullYear()
const config = useRuntimeConfig()
</script>
