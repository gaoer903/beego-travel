<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-12 text-center">
        <el-tag
          type="warning"
          effect="dark"
          round
          size="large"
        >
          <Icon
            name="lucide:trophy"
            size="14"
          />
          <span class="ml-1">避过 VIP</span>
        </el-tag>
        <h1 class="heading-1 mt-4">
          <span class="gradient-text">一杯奶茶钱</span>
          ，省下千元踩坑学费
        </h1>
        <p class="text-muted mt-3">所有 VIP 套餐 7 天无理由退款</p>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div
          v-for="p in plans"
          :key="p.id"
          class="hover:shadow-soft relative cursor-pointer rounded-2xl border-2 bg-white p-8 transition-all hover:-translate-y-1"
          :class="selected === p.id ? 'border-brand-500 shadow-soft' : 'border-gray-200'"
          @click="selected = p.id"
        >
          <div
            v-if="p.badge"
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white"
          >
            {{ p.badge }}
          </div>

          <h3 class="heading-3">{{ p.name }}</h3>
          <div class="mt-4 flex items-baseline gap-1">
            <span class="text-4xl font-bold">¥{{ p.price }}</span>
            <span class="text-gray-500">{{ p.unit }}</span>
          </div>
          <p class="mt-2 text-sm text-gray-500">{{ p.desc }}</p>

          <el-button
            class="mt-6 w-full"
            :type="selected === p.id ? 'primary' : 'default'"
            size="large"
            @click.stop="handleSubscribe(p.id)"
          >
            立即开通
          </el-button>
        </div>
      </div>

      <div class="shadow-card mt-12 rounded-2xl bg-white p-8">
        <h3 class="heading-3 mb-6 text-center">VIP 全部权益</h3>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="b in benefits"
            :key="b"
            class="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
          >
            <Icon
              name="lucide:circle-check"
              size="18"
              class="text-brand-600 mt-0.5 flex-shrink-0"
            />
            <span class="text-sm text-gray-700">{{ b }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "VIP 会员 · 避过",
  description: "解锁全部深度评估，旅行避坑无忧",
});

const plans = [
  { id: "month", name: "月度", price: 19.9, unit: "/月", desc: "随用随订", badge: "" },
  { id: "quarter", name: "季度", price: 49.9, unit: "/季", desc: "相当于 16.6/月", badge: "推荐" },
  { id: "year", name: "年度", price: 168, unit: "/年", desc: "相当于 14/月", badge: "最划算" },
];

const benefits = [
  "无限次行程评估（普通用户每天 3 次）",
  "景点深度差评聚合完全解锁",
  "黑名单数据库完整访问",
  "PDF 报告导出无水印",
  "个性化路线优化推荐",
  "滤镜实拍图对比完全解锁",
  "出行季节性预警通知",
  "客服优先响应",
];

const selected = ref("quarter");

const handleSubscribe = (planId: string) => {
  selected.value = planId;
  ElMessage.success("支付接入开发中，敬请期待");
};
</script>
