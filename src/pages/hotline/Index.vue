<template>
  <section class="section">
    <div class="mx-auto w-[760px]">
      <div class="mb-8 text-center">
        <h1 class="heading-1 inline-flex items-center gap-2">
          <Icon
            name="lucide:phone-call"
            size="28"
            class="text-brand-500"
          />
          投诉电话
        </h1>
        <p class="text-muted mt-2">收藏备用，关键时刻一键拨号</p>
      </div>

      <ul class="grid grid-cols-2 gap-3">
        <li
          v-for="h in hotlines"
          :key="h.phone"
          class="shadow-card hover:shadow-soft flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 transition"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              :class="h.color"
            >
              <Icon
                :name="h.icon"
                size="20"
              />
            </span>
            <div class="min-w-0">
              <div class="text-base font-semibold text-gray-900">{{ h.name }}</div>
              <div class="truncate text-xs text-gray-500">{{ h.desc }}</div>
            </div>
          </div>
          <a
            :href="`tel:${h.phone}`"
            class="btn-brand ml-3 flex-shrink-0 text-base"
          >
            <Icon
              name="lucide:phone"
              size="16"
            />
            {{ h.phone }}
          </a>
        </li>
      </ul>

      <p class="text-muted mt-6 text-center text-xs">点击号码可直接拨号；建议保存到联系人</p>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: "投诉电话 · 避过" });

const hotlines = [
  {
    name: "全国 12315",
    phone: "12315",
    desc: "消费者投诉举报热线（市场监管总局）",
    icon: "lucide:shield-check",
    color: "text-brand-600 bg-brand-50",
  },
  {
    name: "全国 12345",
    phone: "12345",
    desc: "政务服务便民热线（含文旅投诉）",
    icon: "lucide:building-2",
    color: "text-blue-600 bg-blue-50",
  },
  {
    name: "文旅举报",
    phone: "12301",
    desc: "全国旅游投诉服务热线",
    icon: "lucide:plane",
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    name: "公安报警",
    phone: "110",
    desc: "人身/财产/治安紧急",
    icon: "lucide:siren",
    color: "text-red-600 bg-red-50",
  },
  {
    name: "医疗急救",
    phone: "120",
    desc: "急救出诊",
    icon: "lucide:cross",
    color: "text-pink-600 bg-pink-50",
  },
  {
    name: "交通报警",
    phone: "122",
    desc: "交通事故",
    icon: "lucide:car-front",
    color: "text-orange-600 bg-orange-50",
  },
];
</script>
