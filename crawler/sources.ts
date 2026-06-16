/**
 * 数据源白名单
 *
 * 只收录「政府公开公告」——这是之前可行性 & 合规分析里唯一的零风险区：
 *   ✅ 政府公告：可用，注明来源即可
 *   ❌ 黑猫投诉 / 大众点评 / 美团等商业平台 UGC：诉讼风险，绝不收录
 *
 * 新增数据源时，务必确认其属于「官方主动公示」且不含个人身份信息。
 */

export interface SourceConfig {
  /** 源标识，用作输出文件名与 CLI 选择 */
  key: string
  /** 源名称（写入 record.sourceName，用于前端「来源」标注） */
  name: string
  /** 站点首页（用于 robots.txt 检查与展示） */
  homepage: string
  /** 列表页 URL */
  listUrl: string
  /**
   * 详情页链接判定（非全局）：用于判断列表页里某个 <a> 的 href 是否为目标详情页。
   * 列表页解析会遍历所有 <a>，命中此正则的才收，并同时取其标题文本。
   */
  detailHref: RegExp
  /** 正文容器特征 class（按序匹配，命中后从该处截取，跳过页头导航） */
  contentMarkers: string[]
  /**
   * 关键词预过滤（命中任一即保留）。
   * 综合资讯类列表（如文旅部「文化要闻」混杂各类新闻）需要过滤出旅游维权相关；
   * 专项公示类列表（如北京「旅行社投诉量公示」）整栏目都相关，留空表示全收。
   */
  keywords?: string[]
  /** 默认归类（写入 record.category，人工复核时可改） */
  category: string
  /** 未传 --limit 时，该源默认抓取条数 */
  defaultLimit: number
  /** 列表分页最多翻几页（index / index_1 / index_2 …） */
  maxListPages: number
}

export const SOURCES: Record<string, SourceConfig> = {
  /**
   * 文化和旅游部 · 文化要闻
   * 含「旅游市场强制消费典型案例」「严重失信主体名单」等权威通报。
   * 列表混杂各类文化新闻，需按旅游维权关键词过滤。
   */
  mct: {
    key: 'mct',
    name: '文化和旅游部',
    homepage: 'https://www.mct.gov.cn',
    listUrl: 'https://www.mct.gov.cn/whzx/whyw/index.htm',
    detailHref: /^\.\/20\d{4}\/t\d{8}_\d+\.htm$/,
    contentMarkers: ['TRS_Editor'],
    keywords: ['旅游', '旅行社', '导游', '强制消费', '失信', '不合理低价', '购物', '宰客', '景区'],
    category: '文旅部通报',
    defaultLimit: 30,
    maxListPages: 6,
  },

  /**
   * 北京市文化和旅游局 · 旅行社投诉量公示
   * 每周公示「投诉量前十旅行社」+ 投诉问题类型，整栏目皆为避雷数据。
   */
  beijing: {
    key: 'beijing',
    name: '北京市文化和旅游局',
    homepage: 'https://whlyj.beijing.gov.cn',
    listUrl: 'https://whlyj.beijing.gov.cn/zwgk/zxgs/lxstsgs/',
    detailHref: /^\.\/20\d{4}\/t\d{8}_\d+\.html$/,
    contentMarkers: ['trs_word', 'trs_web', 'view TRS'],
    category: '旅行社投诉公示',
    defaultLimit: 30,
    maxListPages: 4,
  },
}
