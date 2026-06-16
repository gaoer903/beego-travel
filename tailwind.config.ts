import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/components/**/*.{vue,js,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/app.vue',
    './src/error.vue',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // 主品牌色：避雷绿
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // 风险等级色
        risk: {
          high: '#dc2626',      // 高风险红
          new: '#ea580c',       // 新坑橙
          warn: '#facc15',      // 注意黄
          mid: '#f97316',
          low: '#10b981',
        },
        // 分类视觉色（雷点 category 主题色）
        cat: {
          traffic: '#dbeafe',   // 交通蓝
          'traffic-ink': '#1d4ed8',
          stay: '#ede9fe',      // 住宿紫
          'stay-ink': '#6d28d9',
          food: '#ffedd5',      // 餐饮橙
          'food-ink': '#c2410c',
          ticket: '#fef3c7',    // 门票/景区黄
          'ticket-ink': '#a16207',
          shop: '#fce7f3',      // 购物粉
          'shop-ink': '#be185d',
          tour: '#dcfce7',      // 旅行团绿
          'tour-ink': '#15803d',
        },
        // 便签纸黄
        sticky: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde68a',
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"Microsoft YaHei"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        // 标题手写体（fallback 到中文系统手写字体）
        brush: [
          '"Ma Shan Zheng"',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          'cursive',
        ],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(16, 185, 129, 0.08)',
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
        sticky: '0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        tape: '0 2px 6px rgba(220, 38, 38, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
        'bounce-slow': 'bounce 2.4s ease-in-out infinite',
        'tilt-1': 'tilt1 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tilt1: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
      },
      backgroundImage: {
        'hero-sky':
          'linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 40%, #ffffff 100%)',
        'pit-paper':
          'linear-gradient(180deg, #fffceb 0%, #fef9c3 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
