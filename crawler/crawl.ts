/**
 * 避过 · 合规数据采集脚本
 * =========================
 * 抓取「政府公开公告」并结构化输出 JSON，供人工复核后入库。
 * 合规边界、用法、字段说明见同目录 README.md。
 *
 * 用法：
 *   npm run crawl                 # 抓取全部源，每源默认前 8 条
 *   npm run crawl -- --source=mct # 只抓文旅部
 *   npm run crawl -- --limit=50   # 每源抓 50 条（覆盖数据源默认值）
 *   npm run crawl:full            # 尽量抓满列表分页（每源上限 999）
 *
 * 设计原则：
 *   - 礼貌抓取：自定义 UA、请求间隔限速、超时控制
 *   - 只取「标题 + 发布日期 + 来源 + 正文摘要(截断) + 原文链接」，不落全文
 *   - PII 兜底脱敏（政府公告本已脱敏，这里做双保险）
 *   - 零运行时依赖：仅用 Node 内置能力（fetch / TextDecoder / fs）
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SOURCES, type SourceConfig } from './sources'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = resolve(__dirname, 'output')

const USER_AGENT =
  'BiguoResearchBot/0.1 (+travel-pitfall research; contact: admin@biguo.example)'
const REQUEST_INTERVAL_MS = 1500 // 单源内每次请求间隔，礼貌限速
const REQUEST_TIMEOUT_MS = 20000
const SUMMARY_MAX_LEN = 400 // 正文摘要截断长度（不落全文）

/** 采集到的原始记录（pending 池形态，非最终 Incident） */
interface RawRecord {
  source: string
  sourceName: string
  sourceUrl: string
  title: string
  publishDate: string
  category: string
  /** 正文摘要（截断，注明可见原文链接） */
  summary: string
  crawledAt: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** 把相对链接解析为绝对 URL */
function absUrl(base: string, href: string): string {
  return new URL(href, base).toString()
}

/** 从响应字节按页面声明的 charset 解码（兼容政府站常见的 gb2312/gbk） */
function decodeBody(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 1024))
  const m = head.match(/charset=["']?([\w-]+)/i)
  let enc = (m?.[1] || 'utf-8').toLowerCase()
  if (enc === 'gb2312' || enc === 'gbk') enc = 'gb18030'
  try {
    return new TextDecoder(enc).decode(bytes)
  } catch {
    return new TextDecoder('utf-8').decode(bytes)
  }
}

/** 礼貌抓取单个页面 */
async function fetchHtml(url: string): Promise<string> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return decodeBody(await res.arrayBuffer())
  } finally {
    clearTimeout(timer)
  }
}

/** 检查 robots.txt 是否禁止抓取该路径（无 robots / 解析失败 → 视为允许） */
async function isAllowedByRobots(pageUrl: string): Promise<boolean> {
  const { origin, pathname } = new URL(pageUrl)
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!res.ok) return true
    const txt = await res.text()
    if (/<html/i.test(txt)) return true // 返回的是网页而非 robots
    // 取 User-agent: * 段落里的 Disallow 规则做基础匹配
    const lines = txt.split('\n').map((l) => l.trim())
    let inStar = false
    const disallows: string[] = []
    for (const line of lines) {
      const ua = line.match(/^User-agent:\s*(.+)$/i)
      if (ua) {
        inStar = ua[1].trim() === '*'
        continue
      }
      const dis = line.match(/^Disallow:\s*(.*)$/i)
      if (dis && inStar && dis[1].trim()) disallows.push(dis[1].trim())
    }
    return !disallows.some((rule) => pathname.startsWith(rule))
  } catch {
    return true
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t\u3000]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
}

/** PII 兜底脱敏：手机号、身份证、座机 */
function scrubPII(s: string): string {
  return s
    .replace(/1[3-9]\d{9}/g, '1**********')
    .replace(/\d{17}[\dXx]/g, '****************')
    .replace(/\d{3,4}-\d{7,8}/g, '****')
}

function extractDate(html: string): string {
  const m =
    html.match(/发布时间[:：]\s*(\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2})?)?)/) ||
    html.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1].trim() : ''
}

/**
 * 抽取正文摘要：
 *   - 先定位正文容器（跳过页头导航），再聚合 <p> 与 <td>（表格里的旅行社名单等）
 *   - 去标签 → 脱敏 → 去重 → 截断
 */
function extractSummary(html: string, src: SourceConfig): string {
  // 先剥掉 style/script，避免正文容器定位命中 CSS 里的 .TRS_Editor 等同名规则
  const cleaned = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')

  let slice = cleaned
  for (const marker of src.contentMarkers) {
    const i = cleaned.indexOf(marker)
    if (i >= 0) {
      // 从容器开标签的闭合 `>` 之后开始，避免把 class 名等标签残留带进正文
      const start = cleaned.indexOf('>', i) + 1 || i
      slice = cleaned.slice(start, start + 16000)
      break
    }
  }

  const seen = new Set<string>()
  const NAV_NOISE = /^(上一篇|下一篇|相关链接|扫一扫|打印|关闭|分享)/
  const blocks = [...slice.matchAll(/<(p|td)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => stripTags(m[2]))
    .filter(
      (t) =>
        t.length >= 4 && !NAV_NOISE.test(t) && !seen.has(t) && (seen.add(t), true),
    )

  let text = blocks.join(' ')
  if (!text) text = stripTags(slice)
  text = scrubPII(text).replace(/\s+/g, ' ').trim().slice(0, SUMMARY_MAX_LEN)
  return text + (text.length >= SUMMARY_MAX_LEN ? '…（详见原文链接）' : '')
}

/** 列表项 */
interface ListItem {
  url: string
  /** 列表 anchor 的标题（title 属性优先，否则内文）——比详情页 <title> 可靠 */
  title: string
}

/** 遍历列表页所有 <a>，取命中详情页特征的链接 + 标题（去重） */
function extractListItems(html: string, src: SourceConfig): ListItem[] {
  const items: ListItem[] = []
  const seen = new Set<string>()
  for (const m of html.matchAll(/<a\b([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = m[2]
    if (!src.detailHref.test(href)) continue
    const url = absUrl(src.listUrl, href)
    if (seen.has(url)) continue
    seen.add(url)
    const attrs = m[1] + m[3]
    const title = (attrs.match(/title="([^"]+)"/)?.[1] || stripTags(m[4])).trim()
    items.push({ url, title })
  }
  return items
}

/** 生成分页列表 URL：index.htm / index_1.htm … 或 index.html / index_1.html … */
function buildListPageUrls(src: SourceConfig, maxPages: number): string[] {
  const u = new URL(src.listUrl)
  const path = u.pathname

  if (path.endsWith('/')) {
    const base = src.listUrl.replace(/\/?$/, '')
    return Array.from({ length: maxPages }, (_, i) =>
      i === 0 ? `${base}/index.html` : `${base}/index_${i}.html`,
    )
  }

  const m = path.match(/^(.*\/)index\.(htm|html)$/i)
  if (m) {
    const dir = `${u.origin}${m[1]}`
    const ext = m[2]
    return Array.from({ length: maxPages }, (_, i) =>
      i === 0 ? `${dir}index.${ext}` : `${dir}index_${i}.${ext}`,
    )
  }

  return [src.listUrl]
}

/** 翻页汇总列表项（按 url 去重） */
async function collectListItems(
  src: SourceConfig,
  needCount: number,
): Promise<ListItem[]> {
  const seen = new Set<string>()
  const merged: ListItem[] = []
  const pageUrls = buildListPageUrls(src, src.maxListPages)

  for (const pageUrl of pageUrls) {
    if (merged.length >= needCount) break
    await sleep(REQUEST_INTERVAL_MS)
    try {
      const html = await fetchHtml(pageUrl)
      for (const it of extractListItems(html, src)) {
        if (seen.has(it.url)) continue
        seen.add(it.url)
        merged.push(it)
      }
      console.log(`  列表 ${pageUrl.replace(src.homepage, '')} → 累计 ${merged.length} 条`)
    } catch (err) {
      console.warn(`  列表页跳过 ${pageUrl}：${(err as Error).message}`)
      break
    }
  }
  return merged
}

async function crawlSource(src: SourceConfig, limit: number): Promise<RawRecord[]> {
  const cap = limit > 0 ? limit : src.defaultLimit
  console.log(`\n── 抓取：${src.name}（上限 ${cap} 条，最多 ${src.maxListPages} 页列表）`)

  const allowed = await isAllowedByRobots(src.listUrl)
  if (!allowed) {
    console.warn(`  ⚠ robots.txt 禁止抓取该路径，已跳过：${src.key}`)
    return []
  }

  // 多翻几页列表，关键词过滤后再截断（文旅部列表混杂非旅游新闻）
  const listBuffer = src.keywords ? cap * 4 : cap
  let items = await collectListItems(src, listBuffer)

  if (src.keywords) {
    items = items.filter((it) => src.keywords!.some((k) => it.title.includes(k)))
  }
  items = items.slice(0, cap)
  console.log(`  待抓取详情 ${items.length} 条`)

  const records: RawRecord[] = []
  for (const it of items) {
    await sleep(REQUEST_INTERVAL_MS)
    try {
      const html = await fetchHtml(it.url)
      records.push({
        source: src.key,
        sourceName: src.name,
        sourceUrl: it.url,
        title: it.title,
        publishDate: extractDate(html),
        category: src.category,
        summary: extractSummary(html, src),
        crawledAt: new Date().toISOString(),
      })
      console.log(`  ✓ ${it.title}`)
    } catch (err) {
      console.warn(`  ✗ 抓取失败 ${it.url}：${(err as Error).message}`)
    }
  }
  return records
}

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (name: string) =>
    args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
  const limitRaw = get('limit')
  return {
    source: get('source') || 'all',
    /** 未传 --limit 时各源用 sources.ts 里的 defaultLimit */
    limit: limitRaw !== undefined ? Number(limitRaw) : 0,
  }
}

async function main() {
  const { source, limit } = parseArgs()
  const targets =
    source === 'all'
      ? Object.values(SOURCES)
      : [SOURCES[source]].filter(Boolean)

  if (targets.length === 0) {
    console.error(`未知数据源：${source}，可选：${Object.keys(SOURCES).join(', ')}, all`)
    process.exit(1)
  }

  console.log('避过 · 合规数据采集（仅政府公开公告）')
  const limitDesc =
    limit > 0
      ? `每源上限 ${limit} 条`
      : `每源默认上限（mct ${SOURCES.mct.defaultLimit} / beijing ${SOURCES.beijing.defaultLimit}）`
  console.log(`目标源：${targets.map((t) => t.name).join('、')}　${limitDesc}`)

  await mkdir(OUTPUT_DIR, { recursive: true })
  const all: RawRecord[] = []

  for (const src of targets) {
    try {
      const recs = await crawlSource(src, limit)
      all.push(...recs)
      const file = resolve(OUTPUT_DIR, `${src.key}.json`)
      await writeFile(file, JSON.stringify(recs, null, 2), 'utf-8')
      console.log(`  → 已写入 ${recs.length} 条：${file}`)
    } catch (err) {
      console.error(`  源 ${src.key} 整体失败：${(err as Error).message}`)
    }
  }

  // 控制台预览
  console.log(`\n══ 汇总：共 ${all.length} 条 ══`)
  for (const r of all.slice(0, 12)) {
    console.log(`\n[${r.sourceName} · ${r.publishDate}] ${r.title}`)
    console.log(`  ${r.summary.slice(0, 120).replace(/\n/g, ' ')}…`)
    console.log(`  ${r.sourceUrl}`)
  }
  console.log(`\n完整结果见：${OUTPUT_DIR}/`)
}

main().catch((err) => {
  console.error('采集失败：', err)
  process.exit(1)
})
