/** 雷点分类（驱动卡片视觉） */
export type IncidentCategory =
  | "traffic" // 交通
  | "stay" // 住宿
  | "food" // 餐饮
  | "ticket" // 门票/景区
  | "shop" // 购物
  | "tour"; // 跟团

export interface CategoryMeta {
  key: IncidentCategory;
  label: string;
  /** Iconify 图标，用作卡片插画兜底 */
  icon: string;
  /** Tailwind 类，bg + ink */
  bg: string;
  ink: string;
}

/** 风险等级 */
export type RiskLevel = "high" | "new" | "warn" | "mid" | "low";

/** 雷点核实状态 */
export type VerifyStatus = "verified" | "pending";

/** 数据来源 */
export interface DataSource {
  label: string; // 12315 / 黑猫 / 文旅通报
  count?: number;
}

/** 今日已核实 - 雷点事件 */
export interface Incident {
  id: string;
  category: IncidentCategory;
  risk: RiskLevel;
  status: VerifyStatus;
  city: string;
  /** 商户/地点名称 */
  place: string;
  /** 一句话描述 */
  summary: string;
  /** 数据来源 */
  sources: DataSource[];
  /** 投诉数 */
  complaintCount: number;
  /** 多久前 */
  postedAt: string;
  /** 替代方案 */
  alternative?: string;
  /** 报案方式 */
  reportChannel?: string;
}

/** 踩坑墙 - 用户实时吐槽（未核实） */
export interface PitTalk {
  id: string;
  /** emoji 标签 */
  emoji: string;
  content: string;
  city?: string;
  tags: string[];
  postedAt: string;
  meTooCount: number;
  status: VerifyStatus;
  /** 推断的分类（用于颜色） */
  category: IncidentCategory;
}

/** 高风险城市榜 */
export interface CityRank {
  rank: number;
  city: string;
  risk: RiskLevel;
  /** 标签文案（高风险 / 新坑 / 注意） */
  badge: string;
}

export interface CityRecord {
  id: string | number;
  name: string;
  slug: string;
  province: string;
  risk_score: number;
  report_count: number;
  latitude: number;
  longitude: number;
  custom_tag?: string;
  updated_at: string;
}

// 上报页城市下拉选项：只含选择器需要的字段（对应 /api/cities/options）
export interface CityOption {
  id: string | number;
  name: string;
  province: string;
}

export interface CityRecordWithTag extends CityRecord {
  tag: string;
  tagType: "danger" | "warning" | "info" | "success";
  tagClass: string;
}

// 我的举报列表项
export interface MyPitfallItem {
  id: number;
  city_id: string;
  title: string;
  content: string;
  entity_name: string;
  address: string | null;
  category: "food" | "accommodation" | "traffic" | "shopping" | "attraction"; // 严格对应 check_category
  entity_scale: "top_tier" | "mid_tier" | "low_tier"; // 严格对应 check_entity_scale
  severity: "low" | "medium" | "high"; // 严格对应 check_severity
  incident_date: string | null;
  verification_type: "none" | "receipt" | "media" | "official";
  images: string[];
  upvotes: number;
  downvotes: number;
  status: "active" | "auditing" | "resolved"; // 严格对应 check_status
  created_at: string;
  user_nickname: string | null;
  user_id: string | null; // 真实归属：auth.users 的 UUID（历史匿名数据可能为 null）
  is_anonymous: boolean | null;
  // 💡 关键：级联查询出来的 cities 对象类型
  cities: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

/** 工具入口 */
export interface ToolEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  to: string;
  highlight?: boolean;
}

/** 用户 */
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  phone?: string;
  isVip: boolean;
}

/* ============================================================
 * Legacy 类型（行程评估 / 景点 / 案例）
 * 设计图中以「工具入口」形式收纳：行程风险扫描 / 景点详情 / 案例库
 * 暂保留以兼容现有 pages/assess、pages/spots、pages/cases
 * ============================================================ */

/** 评分维度 */
export interface ScoreDimensions {
  time: number;
  route: number;
  costPerf: number;
  energy: number;
  season: number;
}

export interface TimelineItem {
  day: number;
  location: string;
  status: "good" | "warn" | "bad";
  note: string;
  advice?: string;
}

export interface RiskItem {
  level: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion?: string;
}

export interface HiddenCostItem {
  name: string;
  amount: number;
  unit: string;
}

export interface AssessmentResult {
  id: string;
  overallScore: number;
  dimensions: ScoreDimensions;
  timeline: TimelineItem[];
  risks: RiskItem[];
  hiddenCosts: HiddenCostItem[];
  optimizedSuggestions: string[];
  createdAt: string;
  isPaid: boolean;
}

export type SpotCategory =
  | "ancient_town"
  | "mountain"
  | "lake"
  | "theme_park"
  | "museum"
  | "natural"
  | "urban";

export interface Spot {
  id: string;
  name: string;
  province: string;
  city: string;
  category: SpotCategory;
  baseScore: number;
  pitScore: number;
  goodTags: string[];
  badTags: string[];
  bestSeason: string[];
  suitableFor: string[];
  unsuitableFor: string[];
  description: string;
  coverUrl: string;
  reviewCount: number;
}

export interface PitCase {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  spotId?: string;
  spotName?: string;
  title: string;
  summary: string;
  coverUrl: string;
  likes: number;
  views: number;
  createdAt: string;
}
