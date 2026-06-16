# 拔草君 · Travel Keng

> 小红书种草，拔草君拔草。AI 帮你看穿网红景点的滤镜。

旅行避坑评估平台，基于大模型对用户行程进行多维度评估，输出隐藏成本、高风险点、优化建议等。

---

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | Nuxt 3 (Vue 3 + SSR) |
| 语言 | TypeScript |
| UI 组件 | Element Plus（复杂交互） |
| 样式 | Tailwind CSS（布局/工具类） |
| 图标 | @element-plus/icons-vue + @nuxt/icon (Iconify) |
| 状态管理 | Pinia |
| 工具库 | @vueuse/core |
| AI | DeepSeek（待接入） |
| 数据库 | Postgres + Prisma（待接入，可选 Supabase） |
| 部署 | Vercel / 阿里云函数计算 |

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 类型检查
npm run typecheck

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 环境变量

复制 `.env.example` 为 `.env` 并填入：

```bash
cp .env.example .env
```

```
NUXT_DEEPSEEK_API_KEY=sk-xxx
NUXT_DEEPSEEK_BASE_URL=https://api.deepseek.com
```

> 当前 AI 评估接口走 mock 数据，未配 key 也能跑通完整链路。

---

## 目录结构

```
travel-keng/
├── app.vue                  # 根组件
├── error.vue                # 全局错误页
├── nuxt.config.ts           # Nuxt 配置（模块/SEO/AI key）
├── tailwind.config.ts
├── tsconfig.json
│
├── assets/css/main.css      # 全局样式（含 EP 主题色覆盖）
├── public/                  # 静态资源（favicon 等）
│
├── layouts/
│   └── default.vue          # 主布局（含 Header/Footer）
│
├── pages/                   # 文件路由
│   ├── index.vue            # 首页
│   ├── assess/
│   │   ├── index.vue        # 行程评估输入
│   │   └── [id].vue         # 评估结果（核心付费页）
│   ├── spots/
│   │   ├── index.vue        # 景点搜索
│   │   └── [id].vue         # 景点详情
│   ├── cases/
│   │   ├── index.vue        # 拔草案例库
│   │   └── [id].vue         # 案例详情
│   ├── blacklist.vue        # 黑名单查询
│   ├── vip.vue              # VIP 订阅
│   ├── user/index.vue       # 个人中心
│   └── login.vue            # 登录注册
│
├── components/              # Vue 组件（自动按目录前缀注册）
│   ├── AppHeader.vue        # → <AppHeader />
│   ├── AppFooter.vue
│   ├── PagePlaceholder.vue
│   └── home/                # → <HomeXxx />
│       ├── HeroSection.vue
│       ├── PitRanking.vue
│       ├── FeatureCards.vue
│       ├── CaseShowcase.vue
│       └── VipBanner.vue
│
├── composables/
│   └── useNavigation.ts     # 导航数据
│
├── stores/                  # Pinia stores
│   ├── user.ts
│   └── assess.ts
│
├── server/                  # Nitro server
│   └── api/
│       ├── health.get.ts
│       └── assess/
│           ├── create.post.ts   # AI 评估（mock）
│           └── [id].get.ts
│
├── types/index.ts           # 全局类型
└── utils/
    ├── format.ts            # 评分/时间格式化
    └── mock.ts              # mock 数据
```

---

## 路由清单（11 个核心页面）

| 路由 | 说明 | 优先级 |
|---|---|---|
| `/` | 首页（已实现完整版） | P0 ✅ |
| `/assess` | 行程评估输入（已实现） | P0 ✅ |
| `/assess/:id` | 评估结果（已实现） | P0 ✅ |
| `/spots` | 景点搜索（已实现） | P0 ✅ |
| `/spots/:id` | 景点详情（已实现） | P0 ✅ |
| `/cases` | 拔草案例库 | P1 ✅ |
| `/cases/:id` | 案例详情 | P1 ✅ |
| `/blacklist` | 黑名单查询 | P1 ✅ |
| `/vip` | VIP 订阅 | P0 ✅ |
| `/user` | 个人中心 | P1 ✅ |
| `/login` | 登录/注册 | P0 ✅ |

---

## 后续路线图

### Phase 1 - 接入真实 AI（最优先）
- [ ] `server/api/assess/create.post.ts` 接入 DeepSeek
- [ ] Prompt 工程 + 测试用例
- [ ] AI 流式响应（SSE）提升体验

### Phase 2 - 数据落地
- [ ] Prisma + Postgres（推荐 Supabase / Neon）
- [ ] 6 张核心表：users / spots / spot_reviews / assessments / cases / orders
- [ ] 景点数据冷启动（爬虫 + AI 清洗 Top 200 景点）

### Phase 3 - 用户与支付
- [ ] 手机号短信验证码登录
- [ ] 微信扫码登录（OAuth）
- [ ] 微信扫码支付 / 支付宝当面付
- [ ] VIP 订阅状态机

### Phase 4 - 内容与运营
- [ ] 案例 UGC 投稿系统
- [ ] 后台管理（Admin）
- [ ] SEO 优化（动态 sitemap）
- [ ] CPS 接入（携程联盟）

---

## 设计原则

1. **Tailwind 管布局，Element Plus 管组件** —— 不互相覆盖
2. **服务端能渲染就 SSR** —— 利于 SEO 长尾词
3. **数据 mock 先行** —— 跑通链路再接真实数据
4. **路由文件即页面** —— 不搞过度抽象
5. **品牌主色** = `brand-500 (#10b981)`，VIP 用 `warning (#f59e0b)`

---

## License

Private. © 2026 拔草君
