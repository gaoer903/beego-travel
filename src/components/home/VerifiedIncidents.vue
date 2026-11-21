<template>
  <section class="container-page mt-10">
    <div class="mb-4 flex items-end justify-between">
      <div>
        <h2 class="heading-2 flex items-center gap-2">
          <span
            class="bg-brand-500 inline-block h-5 w-1.5 rounded-full"
            aria-hidden="true"
          />
          今日已核实
        </h2>
        <p class="text-muted mt-1 text-xs">数据团队核实 · 定期更新</p>
      </div>
      <NuxtLink
        to="/incidents"
        class="text-brand-600 text-sm hover:underline"
      >
        查看全部 →
      </NuxtLink>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <HomeIncidentCard
        v-for="inc in MOCK_INCIDENTS"
        :key="inc.id"
        :incident="inc"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { MOCK_INCIDENTS } from "~/utils/mock";
</script>
