<template>
  <section class="container-page mt-6">
    <div class="grid grid-cols-6 gap-3">
      <NuxtLink
        v-for="tool in TOOL_ENTRIES"
        :key="tool.id"
        :to="tool.to"
        class="card-tool group"
        :class="tool.highlight ? 'bg-brand-50/60 border-brand-200' : ''"
      >
        <span
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          :class="
            tool.highlight
              ? 'bg-brand-100 text-brand-700'
              : 'group-hover:bg-brand-100 group-hover:text-brand-700 bg-gray-100 text-gray-700'
          "
        >
          <Icon
            :name="tool.icon"
            size="20"
          />
        </span>
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-semibold text-gray-900">
            {{ tool.title }}
          </div>
          <div class="truncate text-xs text-gray-500">{{ tool.subtitle }}</div>
        </div>
        <Icon
          name="lucide:chevron-right"
          size="16"
          class="group-hover:text-brand-500 text-gray-300"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TOOL_ENTRIES } from "~/utils/mock";
</script>
