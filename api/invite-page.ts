import { db, dbReady, eq, type InviteRow, type OrderRow } from "./_lib/db.js"
import { header, param, type Req, type Res } from "./_lib/http.js"

const TEMPLATES = new Set(["seal", "calla", "lace", "envelope", "night", "marble", "garden", "moon", "silk", "ink", "arch", "deco", "henna", "pearl", "nikah", "strip"])
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

type Meta = { groom: string; bride: string; templateId: string; date: string; venue: string }

async function metaFor(code: string): Promise<Meta | null> {
  try {
    if (/^[a-z0-9]{6,12}$/.test(code) && dbReady()) {
      const invites = await db<InviteRow[]>(`invites?id=${eq(code)}&select=*`)
      const invite = invites[0]
      if (!invite) return null
      const orders = await db<OrderRow[]>(`orders?id=${eq(invite.order_id)}&select=status`)
      if (orders[0]?.status !== "paid") return null
      return invite.draft as Meta
    }
    // الدعوات القديمة: البيانات جوّه اللينك نفسه (base64url JSON)
    const json = JSON.parse(Buffer.from(code.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as Meta
    return typeof json?.groom === "string" ? json : null
  } catch {
    return null
  }
}

/** بيرجّع index.html بنفس محتواه + وسوم المعاينة (og) الخاصة بالدعوة، عشان واتساب يبيّن شكل حلو. */
export default async function handler(req: Req, res: Res) {
  const code = param(req, "code").slice(0, 2000)
  const host = header(req, "x-forwarded-host") || header(req, "host")
  const origin = `https://${host}`
  let html = ""
  try {
    const r = await fetch(`${origin}/index.html`)
    html = await r.text()
  } catch { /* نكمل بصفحة بسيطة */ }
  if (!html.includes("</head>")) {
    res.setHeader("Location", "/")
    res.status(302).send("")
    return
  }
  const m = await metaFor(code)
  const names = m ? `${String(m.groom).slice(0, 40)} و${String(m.bride).slice(0, 40)}` : ""
  const tpl = m && TEMPLATES.has(m.templateId) ? m.templateId : "seal"
  const title = names ? `دعوة زفاف ${names}` : "دعوة زفاف"
  const desc = names
    ? `${names} بيدعوكم لحضور فرحهم${m?.venue ? ` في ${String(m.venue).slice(0, 60)}` : ""}. افتح الظرف وشوف الدعوة ♡`
    : "افتح الظرف وشوف الدعوة ♡"
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:image" content="${origin}/og/${tpl}.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${esc(`${origin}/i/${code}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ")
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace("</head>", `    ${tags}\n  </head>`)
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600")
  res.status(200).send(html)
}
