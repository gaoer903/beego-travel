<template>
  <section class="section">
    <div class="container-page">
      <div class="mb-8">
        <h1 class="heading-1 flex items-center gap-2">
          <Icon name="lucide:shield-ban" size="28" class="text-red-500" />
          黑名单查询
        </h1>
        <p class="mt-2 text-muted">
          数据来源：12315 公开投诉 + 文旅局公告 + 用户上报 · 数据持续更新中
        </p>
      </div>

      <el-tabs v-model="tab" class="mb-4">
        <el-tab-pane label="旅行社" name="agency" />
        <el-tab-pane label="导游" name="guide" />
        <el-tab-pane label="购物店" name="shop" />
      </el-tabs>

      <el-input
        v-model="keyword"
        placeholder="输入名称或关键词查询"
        size="large"
        clearable
        class="mb-4"
      >
        <template #prefix>
          <Icon name="lucide:search" size="16" class="text-gray-400" />
        </template>
      </el-input>

      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <el-table :data="current" stripe>
          <el-table-column prop="name" label="名称" min-width="220" />
          <el-table-column prop="reason" label="主要问题" min-width="200" />
          <el-table-column prop="count" label="投诉次数" width="120" align="center" />
          <el-table-column label="风险等级" width="120" align="center">
            <template #default="{ row }">
              <el-tag type="danger" effect="dark">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        <Icon name="lucide:triangle-alert" size="16" class="mt-0.5 flex-shrink-0" />
        <span>数据仅供参考，基于公开投诉和用户上报，请理性使用。</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '黑名单查询 · 避过',
  description: '旅行社、导游、购物店黑名单数据库',
})

const tab = ref<'agency' | 'guide' | 'shop'>('agency')
const keyword = ref('')

const mockData = {
  agency: [
    { name: '某某低价游旅行社', reason: '强制购物、行程缩水', count: 23, level: '高风险' },
    { name: '快乐出发旅游公司', reason: '虚假宣传、收取小费', count: 11, level: '高风险' },
  ],
  guide: [
    { name: '导游 王某某（湘 G****）', reason: '辱骂游客、强制消费', count: 8, level: '高风险' },
  ],
  shop: [
    { name: '某丝绸博物馆（云南大理）', reason: '冒充博物馆，强制销售', count: 17, level: '高风险' },
    { name: '某玉石加工厂（云南瑞丽）', reason: '假和田玉、暴利', count: 14, level: '高风险' },
  ],
}

const current = computed(() => {
  const list = mockData[tab.value]
  if (!keyword.value) return list
  return list.filter((i) => i.name.includes(keyword.value) || i.reason.includes(keyword.value))
})
</script>
