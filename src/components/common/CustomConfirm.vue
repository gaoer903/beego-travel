<template>
  <UModal v-model:open="confirmState.open">
    <template #content>
      <div class="p-6">
        <h3 class="text-brand-50 text-lg font-semibold">
          {{ confirmState.title }}
        </h3>

        <p
          v-if="confirmState.description"
          class="text-brand-500 mt-2 text-sm"
        >
          {{ confirmState.description }}
        </p>

        <div class="mt-6 flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="soft"
            class="bg-gray-400"
            @click="handleCancel"
          >
            {{ confirmState.cancelText }}
          </UButton>

          <UButton
            color="error"
            class="text-white"
            @click="handleConfirm"
          >
            {{ confirmState.confirmText }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useConfirmState, resolveConfirm } from "~/composables/useConfirm";

const confirmState = useConfirmState();

const handleConfirm = () => {
  resolveConfirm(true);
};

const handleCancel = () => {
  resolveConfirm(false);
};
</script>
