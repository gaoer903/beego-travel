<template>
  <UContainer class="py-10">
    <UCard class="px-10">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-megaphone" class="w-6 h-6 text-orange-500" />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">提交避坑爆料</h1>
        </div>
        <p class="text-sm text-gray-500 mt-1">你的爆料将以匿名形式发布，帮助更多小伙伴不再踩坑。</p>
      </template>

      <UForm :state="reportForm" :validate="reportFormValidate" @submit="onSubmit" class="px-10">
        <UFormField label="目标城市" name="city_id" size="md" required class="mb-6">
          <USelect
            v-model="reportForm.city_id"
            :items="citiesOptions"
            placeholder="请选择城市..."
            icon="i-heroicons-map-pin"
            class="w-[360px]"
          />
        </UFormField>

        <UFormField label="涉事商家 / 景点名称" name="entity_name" required size="md" class="mb-6">
          <UInput
            v-model="reportForm.entity_name"
            placeholder="例如：XX古镇南门水果摊、XX海鲜大排档"
            icon="i-heroicons-building-storefront"
            class="w-[500px]"
            :ui="{ trailing: 'pe-1' }"
          >
            <template v-if="reportForm.entity_name?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="reportForm.entity_name = ''"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="具体地址 / 商圈 (选填)" name="address" class="mb-6">
          <UInput
            v-model="reportForm.address"
            placeholder="例如：亚龙湾奥特莱斯B区"
            icon="i-heroicons-map"
          />
        </UFormField>

        <UFormField
          label="一句话雷点简述"
          name="title"
          required
          hint="请用50字以内概述一下遇到的问题"
          size="md"
          class="mb-6"
        >
          <UInput
            v-model="reportForm.title"
            maxlength="50"
            placeholder="如：金锁关天价骑马、切糕斤两骗局"
            icon="i-heroicons-pencil-square"
            class="w-full"
          />
        </UFormField>

        <UFormField label="消费类别" name="category" required class="mb-6">
          <URadioGroup
            v-model="reportForm.category"
            :items="categories"
            orientation="horizontal"
            variant="card"
            :ui="{ wrapper: 'flex-wrap gap-4' }"
          />
        </UFormField>

        <UFormField label="商家 / 景区规模" name="entity_scale" required class="mb-6">
          <URadioGroup
            v-model="reportForm.entity_scale"
            :items="scales"
            orientation="horizontal"
            color="neutral"
            size="sm"
            variant="card"
          />
        </UFormField>

        <UFormField label="严重程度" name="severity" required class="mb-6">
          <URadioGroup
            v-model="reportForm.severity"
            :items="severities"
            orientation="horizontal"
            :uiRadio="{ label: 'text-sm font-medium' }"
            variant="card"
            row
          />
        </UFormField>

        <UFormField label="详细受骗经过与防坑建议" name="content" required class="mb-6">
          <UTextarea
            v-model="reportForm.content"
            :rows="4"
            autoresize
            placeholder="请详细描述事情经过，比如具体的套路、价格，给其他小伙伴提供精准的防坑指南..."
            class="w-full"
          />
        </UFormField>

        <div
          class="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md border border-gray-100 dark:border-gray-700 flex items-center justify-between"
        >
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">隐私发布选项</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{
                reportForm.is_anonymous
                  ? `匿名开启后，前端页面将隐藏您的用户名，显示为【${ANONMOUS_NAME}】`
                  : "未开启，前端将展示您的登录昵称：" + currentUserNickname
              }}
            </p>
          </div>
          <UCheckbox v-model="reportForm.is_anonymous" name="is_anonymous" label="匿名发布" />
        </div>

        <UButton type="submit" block size="lg" color="primary" :loading="isSubmitting" class="mt-8">
          发布爆料 (匿名)
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { CityRecord } from "~/types";
import { useCitiesStore } from "@stores/citiesStore";
import type { FormError } from "@nuxt/ui";
import { useAuth } from "@composables/useAuth";

const citiesStore = useCitiesStore();
const supabase = useSupabaseClient();
const toast = useToast(); // 使用 Nuxt UI 自带的轻提示组件
const { user } = useAuth();
const ANONMOUS_NAME = "热心避坑群众";

// 1. 状态控制
const isSubmitting = ref(false);
const citiesOptions = ref<{ label: string; value: string | number }[]>([]);
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

// 4. 组件挂载时获取城市列表，格式化给 USelect 使用
onMounted(async () => {
  if (citiesStore.citiesList.length) {
    citiesOptions.value = citiesStore.citiesList.map((city: CityRecord) => ({
      label: city.name,
      value: city.id,
    }));
  }
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
    const { error } = await supabase.from("pitfalls").insert([
      {
        city_id: reportForm.city_id,
        title: reportForm.title,
        content: reportForm.content,
        entity_name: reportForm.entity_name,
        address: reportForm.address || null,
        category: reportForm.category,
        entity_scale: reportForm.entity_scale,
        severity: reportForm.severity,
        is_anonymous: reportForm.is_anonymous,
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
</script>
