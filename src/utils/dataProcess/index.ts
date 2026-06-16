/**
 * 根据城市的风险分和上报数，动态计算其风险标签及视觉样式
 */
import type { CityTagResult } from "./type";
import type { CityRecord } from "~/types/index";
export function getCityRiskTag(city: CityRecord): CityTagResult {
  // 安全边界处理：防空值
  const score = city.risk_score ?? 0;
  const count = city.report_count ?? 0;

  // 优先级 1：人工干预标签（运营拥有最高决定权）
  if (city.custom_tag) {
    return {
      tag: city.custom_tag,
      tagType: "info",
      tagClass: "bg-orange-50 text-orange-500 border-orange-200 p-1",
    };
  }

  // 优先级 2：高风险（对应红色的 “高风险”）
  if (score >= 80) {
    return {
      tag: "高风险",
      tagType: "danger",
      tagClass: "bg-red-50 text-red-500 border-red-200 p-1 text-xs round-md",
    };
  }

  // 优先级 3：新坑（对应橙色的 “新坑”）
  // 业务逻辑：总分处于中游，但上报基数已经开始增加（这里数值可根据你数据库的真实分布调整）
  if (score >= 30 && score < 60 && count > 50) {
    return {
      tag: "新坑",
      tagType: "info",
      tagClass: "bg-orange-50 text-orange-500 border-orange-200 p-1 text-xs round-md",
    };
  }

  // 优先级 4：注意（对应黄色的 “注意”）
  if (score >= 40) {
    return {
      tag: "注意",
      tagType: "warning",
      tagClass: "bg-amber-50 text-amber-600 border-amber-200 p-1 text-xs round-md",
    };
  }

  // 优先级 5：安全/低风险（默认不显示或显示绿色）
  return {
    tag: "安全",
    tagType: "success",
    tagClass: "bg-green-50 text-green-600 border-green-200 p-1 text-xs round-md",
  };
}
