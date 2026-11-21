<template>
  <UContainer class="py-10">
    <UCard class="px-10">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-megaphone"
            class="h-6 w-6 text-orange-500"
          />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEdit ? "编辑避坑爆料" : "提交避坑爆料" }}
          </h1>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          {{ isEdit ? "修改并保存你之前发布的爆料内容。" : "你的爆料将帮助更多小伙伴不再踩坑。" }}
        </p>
      </template>

      <UForm
        :state="reportForm"
        :validate="reportFormValidate"
        @submit="onSubmit"
        class="px-10"
      >
        <UFormField
          label="目标城市"
          name="city_id"
          size="md"
          required
          class="mb-6"
        >
          <USelect
            v-model="reportForm.city_id"
            :items="citiesOptions"
            placeholder="请选择城市..."
            icon="i-heroicons-map-pin"
            class="w-[360px]"
          />
        </UFormField>

        <UFormField
          label="涉事商家 / 景点名称"
          name="entity_name"
          required
          size="md"
          class="mb-6"
        >
          <UInput
            v-model="reportForm.entity_name"
            placeholder="例如：XX古镇南门水果摊、XX海鲜大排档"
            icon="i-heroicons-building-storefront"
            class="w-[500px]"
            :ui="{ trailing: 'pe-1' }"
          >
            <template
              v-if="reportForm.entity_name?.length"
              #trailing
            >
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="
                  () => {
                    reportForm.entity_name = '';
                  }
                "
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="具体地址 / 商圈 (选填)"
          name="address"
          class="mb-6"
        >
          <UInput
            v-model="reportForm.address"
            placeholder="例如：亚龙湾奥特莱斯B区"
            icon="i-heroicons-map"
          />
        </UFormField>
        <BaiduMap :targetCityPos="editCityPos"></BaiduMap>

        <UFormField
          label="一句话雷点简述"
          name="title"
          required
          hint="请用50字以内概述一下遇到的问题"
          size="md"
          class="mt-6 mb-6"
        >
          <UInput
            v-model="reportForm.title"
            maxlength="50"
            placeholder="如：金锁关天价骑马、切糕斤两骗局"
            icon="i-heroicons-pencil-square"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="消费类别"
          name="category"
          required
          class="mb-6"
        >
          <URadioGroup
            v-model="reportForm.category"
            :items="categories"
            orientation="horizontal"
            variant="card"
            :ui="{ wrapper: 'flex-wrap gap-4' }"
          />
        </UFormField>

        <UFormField
          label="商家 / 景区规模"
          name="entity_scale"
          required
          class="mb-6"
        >
          <URadioGroup
            v-model="reportForm.entity_scale"
            :items="scales"
            orientation="horizontal"
            color="neutral"
            size="sm"
            variant="card"
          />
        </UFormField>

        <UFormField
          label="严重程度"
          name="severity"
          required
          class="mb-6"
        >
          <URadioGroup
            v-model="reportForm.severity"
            :items="severities"
            orientation="horizontal"
            :uiRadio="{ label: 'text-sm font-medium' }"
            variant="card"
            row
          />
        </UFormField>

        <UFormField
          label="详细受骗经过与防坑建议"
          name="content"
          required
          class="mb-6"
        >
          <UTextarea
            v-model="reportForm.content"
            :rows="4"
            autoresize
            placeholder="请详细描述事情经过，比如具体的套路、价格，给其他小伙伴提供精准的防坑指南..."
            class="w-full"
          />
        </UFormField>

        <div
          class="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">隐私发布选项</p>
            <p class="mt-0.5 text-xs text-gray-400">
              {{
                reportForm.is_anonymous
                  ? `匿名开启后，前端页面将隐藏您的用户名，显示为【${ANONMOUS_NAME}】`
                  : "未开启，前端将展示您的登录昵称：" + currentUserNickname
              }}
            </p>
          </div>
          <UCheckbox
            v-model="reportForm.is_anonymous"
            name="is_anonymous"
            label="匿名发布"
          />
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          :loading="isSubmitting"
          class="mt-8"
        >
          {{ isEdit ? "保存修改" : "发布爆料" }}
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { MyPitfallItem } from "~/types";
import type { FormError } from "@nuxt/ui";
import { useAuth } from "@composables/useAuth";
import { useCityOptions } from "@composables/useCityOptions";
import BaiduMap from "@components/common/BaiduMap.vue";

const supabase = useSupabaseClient();
const toast = useToast(); // 使用 Nuxt UI 自带的轻提示组件
const { user } = useAuth();
const ANONMOUS_NAME = "热心避坑群众";
const route = useRoute();

const router = useRouter();

// 编辑态：/report/edit?report_id=xxx；新增态：/report
const isEdit = computed(() => route.params.action === "edit");
const currentEditReportId = computed(() => {
  const raw = route.query.report_id;
  return Array.isArray(raw) ? raw[0] : raw;
});

// 1. 状态控制
const isSubmitting = ref(false);

// 城市下拉选项：SSR 友好、去重、不依赖先访问过首页
const { cities } = await useCityOptions();
const citiesOptions = computed(() =>
  (cities.value ?? []).map((city) => ({
    label: city.name,
    value: city.id,
  }))
);
const currentUserNickname = computed(() => {
  if (!user.value || reportForm.is_anonymous) return "";
  return (
    user.value.user_metadata?.full_name ||
    user.value.user_metadata?.nickname ||
    user.value.email?.split("@")[0]
  );
});

// 2. 静态表单选项映射 (Nuxt UI 的 URadioGroup/USelect 统一接收 { label, value })
const categories = [
  { label: "🍔 餐饮/吃", value: "food" },
  { label: "🏨 住宿/住", value: "accommodation" },
  { label: "🚗 交通/行", value: "traffic" },
  { label: "🛍️ 购物/购", value: "shopping" },
  { label: "⛰️ 景区/娱", value: "attraction" },
];

const scales = [
  { label: "路边摊/个体户", value: "low_tier" },
  { label: "标准商家/饭店", value: "mid_tier" },
  { label: "大景区/五星酒店", value: "top_tier" },
];

const severities = [
  { label: "😅 体验较差", value: "low" },
  { label: "💸 经济损失", value: "medium" },
  { label: "🚨 恶劣宰客/安全威胁", value: "high" },
];

// 3. 使用 reactive 声明表单初始状态
const reportForm = reactive({
  city_id: "",
  title: "",
  content: "",
  entity_name: "",
  address: "",
  category: "food",
  entity_scale: "mid_tier",
  severity: "medium",
  is_anonymous: false, // 默认不匿名
});

// 编辑状态传递坐标
const editCityPos = ref<{ lng: number; lat: number; name: string } | undefined>(undefined);

provide("isEditPage", isEdit.value);

// 表单校验规则
const reportFormValidate = (formState: any): FormError[] => {
  const errors = [];
  if (!formState.city_id) errors.push({ name: "city_id", message: "请选择城市" });

  if (!formState.entity_name?.trim()) {
    errors.push({ name: "entity_name", message: "涉事商家或景区名字不能为空" });
  } else if (formState.entity_name.length < 2) {
    errors.push({ name: "entity_name", message: "商家名字至少需要 2 个字" });
  }

  if (!formState.title?.trim()) {
    errors.push({ name: "title", message: "请填写一句话雷点简述" });
  } else if (formState.title.length > 50) {
    errors.push({ name: "title", message: "简述不能超过 50 个字" });
  }

  if (!formState.content?.trim()) {
    errors.push({ name: "content", message: "请填写详细的受骗经过" });
  } else if (formState.content.length < 15) {
    errors.push({ name: "content", message: "为了爆料真实性，经过描述请至少填写 15 个字" });
  }

  return errors;
};

// 把一条 pitfalls 记录回填进表单
function fillFormFromRecord(record: MyPitfallItem) {
  reportForm.city_id = record.city_id ?? "";
  reportForm.title = record.title ?? "";
  reportForm.content = record.content ?? "";
  reportForm.entity_name = record.entity_name ?? "";
  reportForm.address = record.address ?? "";
  reportForm.category = record.category ?? "food";
  reportForm.entity_scale = record.entity_scale ?? "mid_tier";
  reportForm.severity = record.severity ?? "medium";
  reportForm.is_anonymous = record.is_anonymous ?? false;

  editCityPos.value = {
    lat: record.cities.latitude,
    lng: record.cities.longitude,
    name: record.cities.name,
  };
}

// 编辑态：按 id 拉取原记录回填（入口已由「我的爆料」列表按用户筛过，无需再校验归属）
async function loadReportForEdit() {
  if (!isEdit.value || !currentEditReportId.value) return;

  const { data, error } = await supabase
    .from("pitfalls")
    .select("*, cities(latitude, longitude, name)")
    .eq("id", currentEditReportId.value)
    .maybeSingle();

  if (error) {
    console.error("Load report for edit error:", error);
    toast.add({
      title: "加载失败",
      description: "无法读取该爆料内容，请稍后重试。",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
    return;
  }

  if (!data) {
    toast.add({
      title: "无权编辑",
      description: "未找到该爆料，或它不属于当前账号。",
      color: "warning",
      icon: "i-heroicons-lock-closed",
    });
    router.replace("/user/reports");
    return;
  }

  console.log("[pitfall]", data);

  fillFormFromRecord(data as MyPitfallItem);
}

// 4. 编辑态：挂载后按 id 拉取原记录回填（城市选项已由 useCityOptions 提供，无需手动填充）
onMounted(async () => {
  await loadReportForEdit();
});

// 5. 表单提交方法
async function onSubmit() {
  isSubmitting.value = true;

  try {
    if (!user.value) {
      toast.add({
        title: "未登录",
        description: "请登录后再进行雷点爆料。",
        color: "warning",
        icon: "i-heroicons-lock-closed",
      });
      return;
    }
    // 新增与编辑共用的字段载荷（user_nickname 仅在新增时写入，编辑不覆盖归属）
    const payload = {
      city_id: reportForm.city_id,
      title: reportForm.title,
      content: reportForm.content,
      entity_name: reportForm.entity_name,
      address: reportForm.address || null,
      category: reportForm.category,
      entity_scale: reportForm.entity_scale,
      severity: reportForm.severity,
      is_anonymous: reportForm.is_anonymous,
    };

    if (isEdit.value) {
      // 编辑态：按 id 更新对应记录
      if (!currentEditReportId.value) throw new Error("缺少待编辑爆料的 ID");

      const { data, error } = await supabase
        .from("pitfalls")
        .update(payload as never)
        .eq("id", currentEditReportId.value)
        .select();

      if (error) throw error;

      // data 为空数组 = 匹配到 0 行（RLS 拦截：不是本人的爆料改不了），提示用户
      if (!data || data.length === 0) {
        toast.add({
          title: "未更新任何内容",
          description: "没有匹配到可修改的记录（可能是权限限制）。",
          color: "warning",
          icon: "i-heroicons-exclamation-triangle",
        });
        return;
      }

      toast.add({
        title: "修改已保存！",
        description: "你的爆料内容已更新 ✨",
        color: "success",
        icon: "i-heroicons-check-circle",
        duration: 1500,
      });

      // 编辑完成回到「我的爆料」列表
      router.push("/user/reports");
      return;
    }

    // 新增态：写入一条新记录（user_id 记录真实归属，user_nickname 仅用于前台展示）
    const { error } = await supabase.from("pitfalls").insert([
      {
        ...payload,
        user_id: user.value.sub, // JWT claims 里用户 UUID 是 sub 字段（对应 auth.users.id）
        user_nickname: currentUserNickname.value,
      } as never,
    ]);

    if (error) throw error;

    // Nuxt UI 精美的通知样式
    toast.add({
      title: "爆料成功！",
      description: "感谢你为净化旅游环境贡献的一份力量 🌟",
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    // 重置表单
    reportForm.city_id = "";
    reportForm.title = "";
    reportForm.content = "";
    reportForm.entity_name = "";
    reportForm.address = "";
    reportForm.category = "food";
    reportForm.entity_scale = "mid_tier";
    reportForm.severity = "medium";
  } catch (error: any) {
    console.error("Submit Error:", error);
    toast.add({
      title: "提交失败",
      description: error.message || "数据库写入异常，请稍后再试",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isSubmitting.value = false;
  }
}

useHead({
  title: `避过·${isEdit.value ? "编辑爆料" : "发布爆料"}`,
});
</script>
