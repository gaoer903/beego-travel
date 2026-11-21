<template>
  <section class="section">
    <div class="mx-auto w-[860px]">
      <div class="card-padded mb-6 flex items-center gap-6">
        <el-avatar
          :size="64"
          :src="userStore.user?.avatar"
        />
        <div class="flex-1">
          <h2 class="text-xl font-bold">{{ userStore.nickname }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ userStore.user?.phone || "未绑定手机号" }}</p>
          <el-tag
            v-if="userStore.isVip"
            type="warning"
            class="mt-2"
          >
            <Icon
              name="lucide:crown"
              size="12"
              class="mr-0.5"
            />
            VIP 会员
          </el-tag>
          <el-tag
            v-else
            class="mt-2"
          >
            普通用户
          </el-tag>
        </div>
        <NuxtLink
          v-if="!userStore.isVip"
          to="/vip"
        >
          <el-button type="warning">
            <Icon
              name="lucide:crown"
              size="14"
              class="mr-1"
            />
            开通 VIP
          </el-button>
        </NuxtLink>
      </div>

      <div class="card-padded">
        <el-tabs v-model="tab">
          <el-tab-pane
            label="我的评估"
            name="history"
          >
            <div
              v-if="assessStore.history.length === 0"
              class="text-muted py-12 text-center"
            >
              暂无评估记录
              <div class="mt-3">
                <NuxtLink to="/assess">
                  <el-button
                    type="primary"
                    plain
                  >
                    立即评估
                  </el-button>
                </NuxtLink>
              </div>
            </div>
            <ul
              v-else
              class="divide-y divide-gray-100"
            >
              <li
                v-for="r in assessStore.history"
                :key="r.id"
                class="py-4"
              >
                <NuxtLink
                  :to="`/assess/${r.id}`"
                  class="hover:text-brand-700 flex items-center justify-between"
                >
                  <span>评估报告 #{{ r.id }}</span>
                  <span class="text-sm text-gray-500">评分 {{ r.overallScore.toFixed(1) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane
            label="收藏景点"
            name="favorites"
          >
            <div class="text-muted py-12 text-center">收藏功能开发中</div>
          </el-tab-pane>
          <el-tab-pane
            label="我的投稿"
            name="contributions"
          >
            <div class="text-muted py-12 text-center">投稿功能开发中</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: "个人中心 · 避过" });

const userStore = useUserStore();
const assessStore = useAssessStore();

const tab = ref("history");

onMounted(() => {
  if (!userStore.isLoggedIn) {
    navigateTo("/login", { replace: true });
  }
});
</script>
