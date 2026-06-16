// 1. 定义输入的城市数据接口（与你的 Supabase cities 表结构对应）
export interface CityTagInput {
  risk_score: number | null;
  report_count: number | null;
  custom_tag?: string | null; // 预留的人工干预字段，如果暂无可以不传
}

// 2. 定义输出的标签样式接口
export interface CityTagResult {
  tag: string;
  tagType: "danger" | "warning" | "info" | "success";
  // 适配 Tailwind CSS 的类名，你可以根据你的 UI 框架（如 UnoCSS, Element Plus）自行调整
  tagClass: string;
}
