import { timingSafeEqual } from "node:crypto"

/** أقل شكل لازم من طلب/رد Vercel (من غير ما نضيف مكتبة). */
export type Req = {
  method?: string
  query: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
  body?: unknown
  socket?: { remoteAddress?: string }
}
export type Res = {
  status(code: number): Res
  json(body: unknown): void
  send(body: string): void
  setHeader(name: string, value: string): void
}

export function param(req: Req, name: string): string {
  const v = req.query[name]
  return (Array.isArray(v) ? v[0] : v) ?? ""
}

export function header(req: Req, name: string): string {
  const v = req.headers[name.toLowerCase()]
  return (Array.isArray(v) ? v[0] : v) ?? ""
}

export function body(req: Req): Record<string, unknown> {
  let b = req.body
  if (typeof b === "string") {
    try { b = JSON.parse(b) } catch { b = {} }
  }
  return b && typeof b === "object" ? (b as Record<string, unknown>) : {}
}

export function clientIp(req: Req): string {
  const fwd = header(req, "x-forwarded-for").split(",")[0]?.trim()
  return fwd || req.socket?.remoteAddress || "unknown"
}

export function send(res: Res, status: number, payload: unknown) {
  res.setHeader("Cache-Control", "no-store")
  res.status(status).json(payload)
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

// حد بسيط للطلبات (في الذاكرة — كفاية ضد الإساءة العادية، مش بديل لـ WAF).
const hits = new Map<string, number[]>()
export function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  return recent.length > max
}
