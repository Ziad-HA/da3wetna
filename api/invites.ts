import { sanitizeDraft } from "../src/lib/sanitize.js"
import { db, dbReady, eq, type InviteRow, type OrderRow } from "./_lib/db.js"
import { body, clientIp, limited, param, send, type Req, type Res } from "./_lib/http.js"
import { inviteId } from "./_lib/ids.js"

export default async function handler(req: Req, res: Res) {
  if (!dbReady()) return send(res, 503, { error: "db_unavailable" })
  try {
    if (req.method === "GET") return await read(req, res)
    if (req.method === "POST") return await add(req, res)
    return send(res, 405, { error: "method" })
  } catch (error) {
    console.error("invites", error)
    return send(res, 500, { error: "server" })
  }
}

/** قراءة دعوة عامة (للضيوف). مش بتظهر إلا بعد تفعيل الطلب. */
async function read(req: Req, res: Res) {
  const id = param(req, "id")
  if (!/^[a-z0-9]{6,12}$/.test(id)) return send(res, 404, { error: "not_found" })
  const invites = await db<InviteRow[]>(`invites?id=${eq(id)}&select=*`)
  const invite = invites[0]
  if (!invite) return send(res, 404, { error: "not_found" })
  const orders = await db<OrderRow[]>(`orders?id=${eq(invite.order_id)}&select=status`)
  if (orders[0]?.status !== "paid") return send(res, 200, { status: "pending" })
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300")
  return res.status(200).json({ status: "ready", inviteId: invite.id, draft: invite.draft })
}

/** إضافة دعوة جديدة داخل باقة مدفوعة (صاحب الباقة بيبعت الـ token بتاعه). */
async function add(req: Req, res: Res) {
  if (limited(`inv:${clientIp(req)}`, 30, 3600_000)) return send(res, 429, { error: "slow_down" })
  const b = body(req)
  const token = String(b.token ?? "")
  const draft = sanitizeDraft(b.draft)
  if (token.length < 20 || !draft) return send(res, 400, { error: "bad_request" })
  const orders = await db<OrderRow[]>(`orders?owner_token=${eq(token)}&select=*`)
  const order = orders[0]
  if (!order) return send(res, 404, { error: "not_found" })
  if (order.status !== "paid") return send(res, 402, { error: "not_paid" })
  const existing = await db<InviteRow[]>(`invites?order_id=${eq(order.id)}&select=id`)
  if (existing.length >= order.quantity) return send(res, 409, { error: "package_full" })
  const id = inviteId()
  await db("invites", { method: "POST", body: { id, order_id: order.id, draft }, prefer: "return=minimal" })
  return send(res, 201, { inviteId: id, remaining: order.quantity - existing.length - 1 })
}
