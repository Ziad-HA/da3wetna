import { db, dbReady, eq, type InviteRow, type OrderRow } from "./_lib/db.js"
import { body, clientIp, header, limited, safeEqual, send, type Req, type Res } from "./_lib/http.js"

/** لوحة الإدارة: مراجعة التحويلات اليدوية. محمية بمفتاح ADMIN_KEY في إعدادات Vercel. */
export default async function handler(req: Req, res: Res) {
  if (!dbReady()) return send(res, 503, { error: "db_unavailable" })
  const key = process.env.ADMIN_KEY ?? ""
  if (limited(`admin:${clientIp(req)}`, 60, 600_000)) return send(res, 429, { error: "slow_down" })
  if (key.length < 12 || !safeEqual(header(req, "x-admin-key"), key)) return send(res, 401, { error: "unauthorized" })
  try {
    if (req.method === "GET") {
      const orders = await db<OrderRow[]>("orders?select=*&order=created_at.desc&limit=100")
      const ids = orders.map((o) => o.id)
      const invites = ids.length ? await db<InviteRow[]>(`invites?order_id=in.(${ids.join(",")})&select=id,order_id,draft`) : []
      return send(res, 200, {
        orders: orders.map((o) => ({
          id: o.id, packageId: o.package_id, amount: o.amount, method: o.method, status: o.status, refNo: o.ref_no, createdAt: o.created_at, paidAt: o.paid_at,
          invites: invites.filter((i) => i.order_id === o.id).map((i) => ({ id: i.id, draft: i.draft })),
        })),
      })
    }
    if (req.method === "POST") {
      const b = body(req)
      const id = String(b.orderId ?? "")
      const action = String(b.action ?? "")
      if (!["approve", "reject"].includes(action) || !id) return send(res, 400, { error: "bad_request" })
      const patch = action === "approve" ? { status: "paid", paid_at: new Date().toISOString() } : { status: "rejected" }
      const rows = await db<OrderRow[]>(`orders?id=${eq(id)}`, { method: "PATCH", body: patch })
      return rows.length ? send(res, 200, { ok: true, status: rows[0].status }) : send(res, 404, { error: "not_found" })
    }
    return send(res, 405, { error: "method" })
  } catch (error) {
    console.error("admin", error)
    return send(res, 500, { error: "server" })
  }
}
