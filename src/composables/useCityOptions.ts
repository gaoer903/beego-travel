import type { CityOption } from "~/types";

interface CityOptionsResponse {
  data: CityOption[];
  meta: { cache: string; key: string; ttl: number };
}

/**
 * 城市下拉选项（上报页等表单场景通用）。
 *
 * 用固定 key 的 useAsyncData 封装：
 * - 全站任意页面调用共享同一次请求（Nuxt 按 key 去重）
 * - 服务端拉取的数据随 payload 传给客户端，hydration 不会重复请求
 * - 不依赖「先访问过首页」，直接进上报页也有数据
 */
export async function useCityOptions() {
  const { data, pending, error } = await useAsyncData<CityOption[]>(
    "cities:options",
    async () => {
      const res = await $fetch<CityOptionsResponse>("/api/cities/options");
      return res.data;
    },
    { default: () => [] }
  );

  return { cities: data, pending, error };
}
