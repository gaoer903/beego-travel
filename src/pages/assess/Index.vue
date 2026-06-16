<template>
  <section class="section">
    <div class="mx-auto w-[860px]">
      <div class="mb-8 text-center">
        <h1 class="heading-1">
          告诉我你的<span class="gradient-text">行程</span>
        </h1>
        <p class="mt-3 text-muted">越详细越精准 · AI 评估约 3-8 秒</p>
      </div>

      <el-tabs v-model="tab" class="assess-tabs">
        <el-tab-pane name="text">
          <template #label>
            <span class="flex items-center gap-1">
              <Icon name="lucide:pen-line" size="14" />
              粘贴文本
            </span>
          </template>

          <el-input
            v-model="text"
            type="textarea"
            :rows="10"
            :maxlength="2000"
            show-word-limit
            placeholder="示例：&#10;Day1：成都集合，下午锦里夜游&#10;Day2：成都-九寨沟（车程约 8 小时），入住沟口酒店&#10;Day3：九寨沟一日游&#10;Day4：九寨沟-黄龙-返回成都"
            resize="vertical"
          />
        </el-tab-pane>

        <el-tab-pane name="image">
          <template #label>
            <span class="flex items-center gap-1">
              <Icon name="lucide:image" size="14" />
              上传截图
            </span>
          </template>

          <el-upload
            drag
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            class="w-full"
          >
            <div class="flex flex-col items-center text-gray-400">
              <Icon name="lucide:upload-cloud" size="40" />
            </div>
            <div class="el-upload__text">
              拖拽截图到此，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip text-center">
                支持微信、备忘录、Word 等行程截图，AI 自动识别（开发中）
              </div>
            </template>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane name="template">
          <template #label>
            <span class="flex items-center gap-1">
              <Icon name="lucide:file-text" size="14" />
              选择模板
            </span>
          </template>

          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="t in templates"
              :key="t.name"
              class="rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
              @click="handleTemplate(t)"
            >
              <h3 class="font-semibold text-gray-900">{{ t.name }}</h3>
              <p class="mt-2 line-clamp-3 whitespace-pre-line text-sm text-gray-500">
                {{ t.text }}
              </p>
              <div class="mt-3 text-xs text-brand-600">使用此模板 →</div>
            </button>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
        <h3 class="mb-4 text-sm font-semibold text-gray-900">
          补充信息（选填，提升评估准确度）
        </h3>

        <div class="space-y-5">
          <div>
            <label class="mb-2 block text-sm text-gray-600">出行人群</label>
            <el-checkbox-group v-model="travelers">
              <el-checkbox
                v-for="opt in travelerOptions"
                :key="opt"
                :value="opt"
                :label="opt"
              />
            </el-checkbox-group>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-600">出行季节</label>
            <el-radio-group v-model="season">
              <el-radio v-for="opt in seasonOptions" :key="opt" :value="opt">
                {{ opt }}
              </el-radio>
            </el-radio-group>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-600">预算范围</label>
            <el-radio-group v-model="budget">
              <el-radio-button value="low">经济</el-radio-button>
              <el-radio-button value="medium">中等</el-radio-button>
              <el-radio-button value="high">高端</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          已输入 {{ charCount }} 字
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="assessStore.loading"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          <Icon name="lucide:send" size="14" class="mr-1.5" />
          {{ assessStore.loading ? 'AI 评估中...' : '开始 AI 评估' }}
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '行程风险扫描 · 避过',
  description: '粘贴你的旅行行程，AI 一键识别避坑点、隐藏成本、高风险点。',
})

const router = useRouter()
const route = useRoute()
const assessStore = useAssessStore()

const tab = ref<'text' | 'image' | 'template'>('text')
const initialTab = (route.query.tab as string) || 'text'
if (['text', 'image', 'template'].includes(initialTab)) {
  tab.value = initialTab as typeof tab.value
}

const text = ref(assessStore.draft || '')
const travelers = ref<string[]>([])
const season = ref('')
const budget = ref<'low' | 'medium' | 'high'>('medium')

const travelerOptions = ['老人', '小孩', '情侣', '朋友', '一人']
const seasonOptions = ['春季', '夏季', '秋季', '冬季', '春节', '国庆', '暑期']

const templates = [
  { name: '云南 6 日游', text: 'Day1：抵达昆明，石林一日游\nDay2：昆明-大理，洱海骑行\nDay3：大理-丽江，玉龙雪山\nDay4：丽江-香格里拉，普达措\nDay5：返回丽江古城\nDay6：返程' },
  { name: '川西小环线', text: 'Day1：成都-海螺沟\nDay2：海螺沟冰川\nDay3：海螺沟-康定-新都桥\nDay4：新都桥-塔公-丹巴\nDay5：丹巴-四姑娘山\nDay6：四姑娘山-成都' },
  { name: '九寨沟黄龙 4 日', text: 'Day1：成都集合\nDay2：成都-九寨沟（车程8h）\nDay3：九寨沟一日游\nDay4：九寨沟-黄龙-成都' },
  { name: '海南亲子 5 日', text: 'Day1：海口抵达\nDay2：海口-博鳌\nDay3：博鳌-三亚\nDay4：亚龙湾沙滩+蜈支洲岛\nDay5：返程' },
]

const charCount = computed(() => text.value.length)
const canSubmit = computed(() => text.value.trim().length >= 10)

const handleTemplate = (t: typeof templates[number]) => {
  text.value = t.text
  tab.value = 'text'
  ElMessage.success(`已填入：${t.name}`)
}

const handleSubmit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('请输入至少 10 个字的行程描述')
    return
  }
  try {
    const result = await assessStore.createAssessment({
      text: text.value.trim(),
      travelers: travelers.value,
      season: season.value,
      budget: budget.value,
    })
    router.push(`/assess/${result.id}`)
  } catch (e) {
    ElMessage.error('评估失败，请稍后重试')
  }
}

watchEffect(() => {
  if (text.value !== assessStore.draft) {
    assessStore.saveDraft(text.value)
  }
})
</script>

<style scoped>
.assess-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>
