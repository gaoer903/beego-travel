<template>
  <UContainer class="max-w-3xl space-y-6 py-10">
    <div class="flex items-center justify-between pb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-black">我的避坑爆料</h1>
        <p class="mt-1 text-sm text-gray-500">
          当前登录身份：
          <span class="text-brand-400 dark:text-brand-600 font-medium">
            {{ currentUserNickname }}
          </span>
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        class="bg-brand-500 rounded-full text-white"
        @click="handleContinueReport"
      >
        继续爆料
      </UButton>
    </div>

    <div
      v-if="pending"
      class="space-y-4"
    >
      <USkeleton
        class="h-32 w-full"
        v-for="i in 3"
        :key="i"
      />
    </div>

    <div
      v-else-if="myPitfalls && myPitfalls.length > 0"
      class="space-y-4"
    >
      <UCard
        v-for="item in myPitfalls"
        :key="item.id"
        :ui="{
          // 🌟 核心：重塑双色表现。彻底告别脏灰，暗色下使用纯粹深黑底色 + 荧光绿微透边框
          root: [
            'bg-white border border-gray-100 rounded-2xl shadow-sm',
            'dark:bg-zinc-950 dark:border-emerald-500/20',
            'dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]',
          ].join(' '),

          // 头部区域：去掉下边框，微调内边距，使其与主体完美融合
          header: 'px-6 pt-6 pb-2 border-b-0',

          // 主体区域：保持四周间距呼吸感，略微收紧顶部间距
          body: 'px-6 pt-2 pb-6',
        }"
        class="transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:border-emerald-500/50 hover:dark:border-emerald-400/40"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                variant="soft"
                size="md"
                class="bg-red-50 text-red-700 dark:bg-red-500/25 dark:text-red-200 dark:ring-1 dark:ring-red-500/20"
              >
                <UIcon
                  name="i-lucide-map-pin-x"
                  class="size-5"
                />

                {{ item.cities?.name || "未知城市" }}
              </UBadge>
              <UBadge
                variant="soft"
                size="sm"
                class="text-white dark:ring-1 dark:ring-sky-500/20"
                :class="`${getCategoryColor(item.category)}`"
              >
                {{ getCategoryLabel(item.category) }}
              </UBadge>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ item.title }}
              </h3>
            </div>

            <div class="flex items-center gap-2">
              <UBadge
                :color="getStatusColor(item.status)"
                variant="soft"
                size="sm"
              >
                {{ getStatusLabel(item.status) }}
              </UBadge>
              <UBadge
                :color="item.is_anonymous ? 'warning' : 'primary'"
                variant="soft"
                size="sm"
              >
                <template v-if="!item.is_anonymous">
                  <UIcon
                    name="lucide-eye"
                    class="size-5"
                  />
                  前台实名展示
                </template>
                <template v-else>
                  <UIcon
                    name="lucide-eye-off"
                    class="size-5"
                  />
                  前台匿名展示
                </template>
              </UBadge>
            </div>
          </div>
        </template>

        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <UIcon
              name="i-heroicons-building-storefront"
              class="h-4 w-4 text-gray-400"
            />
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.entity_name }}</span>
            <span
              v-if="item.address"
              class="text-gray-400"
            >
              · {{ item.address }}
            </span>
          </div>
          <p class="line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-400">
            {{ item.content }}
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-between text-xs text-gray-400">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-0.5">
                <UIcon
                  name="lucide-thumbs-up"
                  class="h-3.5 w-3.5"
                />
                {{ item.upvotes }} 赞成
              </span>
              <span class="flex items-center gap-0.5">
                <UIcon
                  name="lucide-thumbs-down"
                  class="h-3.5 w-3.5"
                />
                {{ item.downvotes }} 反对
              </span>
            </div>
            <div>
              <span class="mr-4">提交于：{{ formatDate(item.created_at) }}</span>

              <UButton
                icon="lucide-square-pen"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-cat-tour cursor-pointer hover:bg-transparent"
                @click="goToMyReportEdit(item)"
              >
                编辑
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-gray-800 dark:bg-gray-900/40"
    >
      <UIcon
        name="i-heroicons-chat-bubble-bottom-center-text"
        class="mx-auto mb-3 h-12 w-12 text-gray-300"
      />
      <p class="text-sm text-gray-500">你还没有发布过任何避坑爆料哦</p>
      <UButton
        to="/report"
        color="primary"
        size="sm"
        class="mt-4"
      >
        去发布第一条
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { type MyPitfallItem } from "~/types";
import { useAuth } from "@composables/useAuth";

const supabase = useSupabaseClient();
const { user } = useAuth(); // 获取当前登录用户

// 动态拿到当前用户的昵称（必须和 report.vue 写入时的逻辑完全一致）
const currentUserNickname = computed(() => {
  return (
    user.value?.user_metadata?.full_name ||
    user.value?.user_metadata?.nickname ||
    user.value?.email?.split("@")[0] ||
    "热心避坑群众"
  );
});

// 🌟 核心异步查询：利用 useAsyncData 捞取数据，并连表把城市名字顺便查出来
const { data: myPitfalls, pending } = await useAsyncData("my-pitfalls", async () => {
  if (!user.value?.sub) return [];

  const { data, error } = await supabase
    .from("pitfalls")
    .select(
      `
      *,
      cities (
        name
      )
    `
    )
    .eq("user_id", user.value.sub) // JWT claims 的 sub 即用户 UUID；匿名爆料也能正确归到作者名下
    .order("created_at", { ascending: false }); // 最新发布的排在最前面

  if (error) {
    console.error("Fetch my pitfalls error:", error);
    return [];
  }
  return data as MyPitfallItem[];
});

// ==================== 🛠️ 映射字典系统（对齐你的数据库 CHECK 约束） ====================
const getStatusLabel = (val: string) => {
  const map: any = { active: "展示中", auditing: "审核中", resolved: "已解决/下架" };
  return map[val] || "未知状态";
};
const getStatusColor = (val: string): any => {
  const map: any = { active: "success", auditing: "warning", resolved: "neutral" };
  return map[val] || "gray";
};

const getCategoryLabel = (val: string) => {
  const map: any = {
    food: "餐饮",
    accommodation: "住宿",
    traffic: "交通",
    shopping: "购物",
    attraction: "景区",
  };
  return map[val] || "其它";
};
const getCategoryColor = (val: string): any => {
  const map: any = {
    food: "bg-orange-500 dark:text-orange-200",
    accommodation: "bg-indigo-500 dark:text-indigo-200",
    traffic: "bg-cyan-500 dark:text-cyan-200",
    shopping: "bg-purple-500 dark:text-purple-200",
    attraction: "bg-emerald-500 dark:text-emerald-200",
  };
  return map[val] || "gray";
};

// 简单格式化 ISO 时间字符串
function formatDate(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const router = useRouter();

const handleContinueReport = () => {
  router.push("/report");
};

// 去往编辑上报页
const goToMyReportEdit = (reportItem: MyPitfallItem) => {
  router.push(`/report/edit?report_id=${reportItem.id}`);
};
</script>
