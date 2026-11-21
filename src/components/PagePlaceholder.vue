<template>
  <section class="section">
    <div class="container-page">
      <div class="mx-auto max-w-3xl">
        <div class="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div
            class="bg-brand-50 text-brand-600 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          >
            <Icon
              :name="props.icon"
              size="32"
            />
          </div>

          <div class="mb-3 inline-flex items-center gap-2">
            <el-tag
              size="small"
              type="warning"
              round
            >
              {{ props.tag }}
            </el-tag>
            <span class="text-sm text-gray-400">页面建设中</span>
          </div>

          <h1 class="heading-1">{{ props.title }}</h1>
          <p
            v-if="props.subtitle"
            class="text-muted mt-3 text-lg"
          >
            {{ props.subtitle }}
          </p>

          <div
            v-if="props.features.length"
            class="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-5 text-left"
          >
            <div class="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              规划中的功能
            </div>
            <ul class="space-y-2">
              <li
                v-for="(f, i) in props.features"
                :key="i"
                class="flex items-start gap-2 text-sm text-gray-700"
              >
                <Icon
                  name="lucide:circle-check"
                  class="text-brand-500 mt-0.5"
                  size="16"
                />
                {{ f }}
              </li>
            </ul>
          </div>

          <div class="mt-8 flex items-center justify-center gap-3">
            <NuxtLink :to="props.ctaTo">
              <el-button>{{ props.ctaText }}</el-button>
            </NuxtLink>
            <NuxtLink to="/">
              <el-button type="primary">先去首页搜一搜</el-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  features?: string[];
  ctaText?: string;
  ctaTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "lucide:wrench",
  tag: "WIP",
  features: () => [],
  ctaText: "返回首页",
  ctaTo: "/",
});
</script>
