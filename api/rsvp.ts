import { db, dbReady, eq, type InviteRow, type OrderRow, type RsvpRow } from "./_lib/db.js"
import { body, clientIp, limited, send, type Req, type Res } from "./_lib/http.js"

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(CONTROL, "").replace(/\s+/g, " ").trim().slice(0, max) : "")

/** تأكيد حضور من ضيف. */
export default async function handler(req: Req, res: Res) {
  if (!dbReady()) return send(res, 503, { error: "db_unavailable" })
  if (req.method !== "POST") return send(res, 405, { error: "method" })
  try {
    if (limited(`rsvp:${clientIp(req)}`, 15, 3600_000)) return send(res, 429, { error: "slow_down" })
    const b = body(req)
    const id = String(b.inviteId ?? "")
    const name = clean(b.name, 60)
    const attending = b.attending === true
    const guests = attending ? Math.min(10, Math.max(1, Math.floor(Number(b.guests) || 1))) : 0
    const note = clean(b.note, 200)
    if (!/^[a-z0-9]{6,12}$/.test(id) || name.length < 2 || typeof b.attending !== "boolean") return send(res, 400, { error: "bad_request" })

    const invites = await db<InviteRow[]>(`invites?id=${eq(id)}&select=id,order_id`)
    const invite = invites[0]
    if (!invite) return send(res, 404, { error: "not_found" })
    const orders = await db<OrderRow[]>(`orders?id=${eq(invite.order_id)}&select=status`)
    if (orders[0]?.status !== "paid") return send(res, 403, { error: "inactive" })
    const count = await db<Pick<RsvpRow, "id">[]>(`rsvps?invite_id=${eq(id)}&select=id&limit=1000`)
    if (count.length >= 1000) return send(res, 409, { error: "full" })

    await db("rsvps", { method: "POST", body: { invite_id: id, name, attending, guests, note: note || null }, prefer: "return=minimal" })
    return send(res, 201, { ok: true })
  } catch (error) {
    console.error("rsvp", error)
    return send(res, 500, { error: "server" })
  }
}
