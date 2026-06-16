<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <AppHeader :login-modal="loginModal" @update:login-modal="loginModal = $event" />
    <main class="w-full">
      <slot />
    </main>
    <AppFooter />
    <Teleport to="body">
      <LoginModal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import LoginModal from "@components/auth/LoginModal.vue";

const loginModal = ref(false);
</script>
