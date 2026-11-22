import { db, dbReady, eq, type OrderRow } from "./_lib/db.js"
import { body, clientIp, limited, param, send, type Req, type Res } from "./_lib/http.js"
import { createPaymentUrl, paymobReady, verifyHmac } from "./_lib/paymob.js"

/**
 * /api/pay?action=create   ← الموقع بيطلب لينك الدفع
 * /api/pay?action=webhook  ← Paymob بيبلّغنا بنتيجة العملية (Transaction processed callback)
 */
export default async function handler(req: Req, res: Res) {
  if (!dbReady() || !paymobReady()) return send(res, 503, { error: "paymob_unavailable" })
  if (req.method !== "POST") return send(res, 405, { error: "method" })
  try {
    return param(req, "action") === "webhook" ? await webhook(req, res) : await create(req, res)
  } catch (error) {
    console.error("pay", error)
    return send(res, 500, { error: "server" })
  }
}

async function create(req: Req, res: Res) {
  if (limited(`pay:${clientIp(req)}`, 20, 3600_000)) return send(res, 429, { error: "slow_down" })
  const b = body(req)
  const token = String(b.token ?? "")
  if (token.length < 20) return send(res, 404, { error: "not_found" })
  const orders = await db<OrderRow[]>(`orders?owner_token=${eq(token)}&select=*`)
  const order = orders[0]
  if (!order) return send(res, 404, { error: "not_found" })
  if (order.status !== "pending") return send(res, 409, { error: "order_not_pending" })
  if (order.method !== "paymob") return send(res, 400, { error: "not_paymob" })
  const { url, paymobOrderId } = await createPaymentUrl(order.id, order.amount)
  await db("orders?id=" + eq(order.id), { method: "PATCH", body: { paymob_order_id: paymobOrderId }, prefer: "return=minimal" })
  return send(res, 200, { url })
}

async function webhook(req: Req, res: Res) {
  const b = body(req)
  const obj = (b.obj && typeof b.obj === "object" ? b.obj : {}) as Record<string, unknown>
  if (!verifyHmac(obj, param(req, "hmac"))) return send(res, 401, { error: "bad_hmac" })

  const paymobOrder = obj.order as { id?: unknown; merchant_order_id?: string } | undefined
  const localOrderId = String(paymobOrder?.merchant_order_id ?? "")
  const rows = await db<OrderRow[]>(`orders?id=${eq(localOrderId)}&select=*`)
  const row = rows[0]
  if (!row) return send(res, 404, { error: "not_found" })

  // تأكد إن الإشعار يخص طلب Paymob المرتبط بنفس الطلب المحلي، مش مجرد merchant_order_id متطابق.
  if (!row.paymob_order_id || String(paymobOrder?.id ?? "") !== row.paymob_order_id) {
    return send(res, 409, { error: "payment_order_mismatch" })
  }

  const integrationOk = Number(obj.integration_id) === Number(process.env.PAYMOB_INTEGRATION_ID)
  const ok = obj.success === true && obj.pending !== true && obj.is_voided !== true && obj.is_refunded !== true
  const amountOk = Number(obj.amount_cents) === row.amount * 100 && obj.currency === "EGP"
  if (ok && amountOk && integrationOk && row.status === "pending") {
    await db("orders?id=" + eq(row.id), { method: "PATCH", body: { status: "paid", paid_at: new Date().toISOString() }, prefer: "return=minimal" })
  }
  return send(res, 200, { received: true })
}
