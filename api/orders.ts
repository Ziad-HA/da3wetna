import { getPackage } from "../src/config.js"
import { sanitizeDraft } from "../src/lib/sanitize.js"
import { db, dbReady, eq, type InviteRow, type OrderRow, type RsvpRow } from "./_lib/db.js"
import { body, clientIp, limited, param, send, type Req, type Res } from "./_lib/http.js"
import { inviteId, orderId, ownerToken } from "./_lib/ids.js"
import { paymobReady } from "./_lib/paymob.js"

const PACKAGES = ["single", "basic", "plus", "premium"]

export default async function handler(req: Req, res: Res) {
  if (!dbReady()) return send(res, 503, { error: "db_unavailable" })
  try {
    if (req.method === "POST") return await create(req, res)
    if (req.method === "GET") return await dashboard(req, res)
    return send(res, 405, { error: "method" })
  } catch (error) {
    console.error("orders", error)
    return send(res, 500, { error: "server" })
  }
}

async function create(req: Req, res: Res) {
  if (limited(`order:${clientIp(req)}`, 12, 3600_000)) return send(res, 429, { error: "slow_down" })
  const b = body(req)
  const draft = sanitizeDraft(b.draft)
  const method = String(b.method ?? "")
  if (!draft) return send(res, 400, { error: "bad_draft" })
  if (!PACKAGES.includes(String(b.packageId))) return send(res, 400, { error: "bad_package" })
  if (!["vodafone", "instapay", "paymob"].includes(method)) return send(res, 400, { error: "bad_method" })
  if (method === "paymob" && !paymobReady()) return send(res, 400, { error: "paymob_unavailable" })
  const refNo = String(b.refNo ?? "").replace(/[^\dA-Za-z-]/g, "").slice(0, 30)
  if (method !== "paymob" && refNo.length < 4) return send(res, 400, { error: "bad_ref" })

  const pkg = getPackage(String(b.packageId))
  const token = ownerToken()
  let order: OrderRow | undefined
  for (let attempt = 0; attempt < 4 && !order; attempt++) {
    try {
      const rows = await db<OrderRow[]>("orders", {
        method: "POST",
        body: { id: orderId(), package_id: pkg.id, quantity: pkg.quantity, amount: pkg.price, method, ref_no: refNo || null, owner_token: token },
      })
      order = rows[0]
    } catch (error) {
      if ((error as { status?: number }).status !== 409) throw error // 409 = رقم الطلب اتكرر، نجرب تاني
    }
  }
  if (!order) return send(res, 500, { error: "server" })

  const id = inviteId()
  await db("invites", { method: "POST", body: { id, order_id: order.id, draft }, prefer: "return=minimal" })
  return send(res, 201, { orderId: order.id, ownerToken: token, inviteId: id, status: order.status })
}

async function dashboard(req: Req, res: Res) {
  const token = param(req, "token")
  if (token.length < 20) return send(res, 400, { error: "bad_token" })
  if (limited(`dash:${clientIp(req)}`, 120, 3600_000)) return send(res, 429, { error: "slow_down" })
  const orders = await db<OrderRow[]>(`orders?owner_token=${eq(token)}&select=*`)
  const order = orders[0]
  if (!order) return send(res, 404, { error: "not_found" })

  const invites = await db<InviteRow[]>(`invites?order_id=${eq(order.id)}&select=*&order=created_at.asc`)
  let rsvps: RsvpRow[] = []
  if (invites.length) {
    rsvps = await db<RsvpRow[]>(`rsvps?invite_id=in.(${invites.map((i) => i.id).join(",")})&select=*&order=created_at.desc&limit=1000`)
  }
  return send(res, 200, {
    order: { id: order.id, packageId: order.package_id, quantity: order.quantity, amount: order.amount, status: order.status, method: order.method, createdAt: order.created_at },
    remaining: Math.max(0, order.quantity - invites.length),
    invites: invites.map((invite) => {
      const mine = rsvps.filter((r) => r.invite_id === invite.id)
      const yes = mine.filter((r) => r.attending)
      return {
        id: invite.id,
        draft: invite.draft,
        createdAt: invite.created_at,
        summary: { replies: mine.length, attending: yes.length, declined: mine.length - yes.length, guests: yes.reduce((n, r) => n + r.guests, 0) },
        rsvps: mine.map((r) => ({ id: r.id, name: r.name, attending: r.attending, guests: r.guests, note: r.note, createdAt: r.created_at })),
      }
    }),
  })
}
