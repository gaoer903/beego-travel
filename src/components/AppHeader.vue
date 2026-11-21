<template>
  <header
    class="home-header sticky top-0 z-40 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md"
  >
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <BrandLogo />

      <nav class="flex w-[450px] items-center justify-between">
        <NuxtLink
          v-for="item in mainNav"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-center rounded-lg px-2 py-2 text-[13px] transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-brand-50 text-brand-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
        >
          <Icon
            v-if="item.icon"
            :name="item.icon"
            size="16"
            class="mr-[4px] opacity-70"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex w-[480px] items-center justify-between">
        <UButton
          icon="lucide:circle-gauge"
          class="bg-risk-high shadow-soft hover:bg-risk-high/80 cursor-pointer rounded-full text-white"
          @click="handleReport"
        >
          举报一个坑
        </UButton>

        <UButton
          icon="lucide:share-2"
          class="rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          @click="handleGenerateCard"
        >
          生成避雷情报卡
        </UButton>

        <UDropdownMenu
          :items="assistantItems"
          :content="{
            align: 'center',
            sideOffset: 8,
          }"
          :ui="{
            content: 'w-56 rounded-lg shadow-lg',
          }"
        >
          <div
            class="bg-brand-50 text-brand-700 hover:bg-brand-100 flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-2.5 text-[12px] font-medium transition-colors"
          >
            <Icon
              name="lucide:bot-message-square"
              size="14"
            />
            <span>避避助手</span>
            <Icon
              name="lucide:chevron-down"
              size="12"
              class="text-brand-700/70"
            />
          </div>
        </UDropdownMenu>

        <UPopover
          v-model:open="isUserMenuOpen"
          mode="hover"
          :content="{
            align: 'end',
            sideOffset: 8,
          }"
          :ui="{
            content: 'ring-0 shadow-none bg-transparent focus:outline-none',
          }"
        >
          <!-- Trigger -->
          <div
            class="bg-brand-100 hover:bg-brand-300 flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 transition-colors"
            :class="isUserMenuOpen ? 'bg-brand-300' : ''"
          >
            <UAvatar
              :src="userStore.user?.avatar"
              size="sm"
            />

            <span class="text-sm font-medium">我的</span>

            <UIcon
              name="i-lucide-chevron-down"
              class="size-3 text-gray-400 transition-transform duration-200"
              :class="{
                'rotate-180': isUserMenuOpen,
              }"
            />
          </div>

          <!-- Panel -->
          <template #content>
            <div class="w-64 overflow-hidden rounded-lg bg-white shadow-lg">
              <!-- 登录状态 -->
              <template v-if="isLogin">
                <!-- 用户信息 -->
                <div class="border-brand-100 flex items-center gap-3 p-4">
                  <UAvatar
                    :src="userStore.user?.avatar"
                    size="md"
                  />
                  <span class="text-brand-600 font-medium">{{ user?.email }}</span>
                </div>

                <!-- 菜单 -->
                <div class="p-2">
                  <NuxtLink
                    v-for="item in userMenu"
                    :key="item.to"
                    :to="item.to"
                    class="group hover:bg-brand-500 flex gap-3 rounded-lg px-3 py-3 transition-colors hover:text-white"
                  >
                    <UIcon
                      :name="item.icon"
                      class="text-brand-600 group-hover:text-brand-50 mt-0.5 size-4 shrink-0"
                    />

                    <div>
                      <div class="text-sm font-medium">
                        {{ item.label }}
                      </div>

                      <div
                        v-if="item.sub"
                        class="text-xs text-gray-500"
                      >
                        {{ item.sub }}
                      </div>
                    </div>
                  </NuxtLink>
                </div>

                <!-- Footer -->
                <div class="border-brand-100 border-t p-2">
                  <UButton
                    block
                    color="error"
                    variant="ghost"
                    icon="i-lucide-log-out"
                    @click="logoutClick"
                  >
                    退出登录
                  </UButton>
                </div>
              </template>

              <!-- 未登录状态 -->
              <template v-else>
                <div class="p-4">
                  <div class="font-medium">登录后解锁更多功能</div>

                  <div class="mt-1 text-sm text-gray-500">收藏城市、举报雷点、同步个人数据</div>

                  <UButton
                    block
                    class="mt-4"
                    icon="i-lucide-log-in"
                    @click="handleLoginModalOpen"
                  >
                    立即登录
                  </UButton>
                </div>
              </template>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLoginModal } from "@composables/useLoginModal";
import { useAuth } from "@composables/useAuth";

const { open } = useLoginModal();
const { mainNav, userMenu } = useNavigation();
const userStore = useUserStore();
const route = useRoute();
const { user, isLogin, logout } = useAuth();
const isUserMenuOpen = ref(false);

console.log("当前用户：", user, "登录状态：", isLogin);

const props = defineProps<{
  loginModal: boolean;
}>();

const assistantItems = [
  [
    {
      label: "打招呼问问避避",
      icon: "i-lucide-bot",
      onSelect: () => {
        console.log("打招呼");
      },
    },
    {
      label: "提交一个问题",
      icon: "i-lucide-message-square",
      onSelect: () => {
        console.log("提交问题");
      },
    },
    {
      label: "给避避喂数据",
      icon: "i-lucide-lightbulb",
      onSelect: () => {
        console.log("喂数据");
      },
    },
  ],
];

const emits = defineEmits(["update:login-modal"]);

const isActive = (to: string) => route.path === to || route.path.startsWith(to + "/");
const handleLoginModalOpen = () => {
  open();
};
// 退出登录
const logoutClick = async () => {
  const confirmRes = await useConfirm()({
    title: "退出登录",
    description: "确定要退出登录吗？",
  });
  if (!confirmRes) return;

  logout();
};

const handleReport = () => {
  if (!isLogin.value) {
    useConfirm()({
      title: "请先登录",
      description: "您需要先登录后才能进行举报操作哦~",
    }).then(() => {
      handleLoginModalOpen();
    });
    return;
  }
  navigateTo("/report");
};

const handleGenerateCard = () => {
  ElMessage.success("避雷情报卡生成中（功能开发中）");
};
</script>

<style lang="scss">
.home-header {
  margin: 0 auto;
  .btn-report {
    font-size: 12px;
  }

  .btn-avoid {
    font-size: 12px;
  }
}
</style>
