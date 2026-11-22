import { createHmac } from "node:crypto"
import { safeEqual } from "./http.js"

const BASE = "https://accept.paymob.com/api"

export const paymobReady = () => {
  const integrationId = Number(process.env.PAYMOB_INTEGRATION_ID)
  const iframeId = Number(process.env.PAYMOB_IFRAME_ID)
  return Boolean(
    process.env.PAYMOB_API_KEY?.trim() &&
    process.env.PAYMOB_HMAC?.trim() &&
    Number.isInteger(integrationId) && integrationId > 0 &&
    Number.isInteger(iframeId) && iframeId > 0
  )
}

async function post<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`paymob ${path} ${res.status}`)
  return (await res.json()) as T
}

/** بيعمل طلب دفع عند Paymob ويرجع لينك صفحة الدفع. المبلغ بالجنيه. */
export async function createPaymentUrl(orderId: string, amountEgp: number): Promise<{ url: string; paymobOrderId: string }> {
  const amount_cents = Math.round(amountEgp * 100)
  const auth = await post<{ token: string }>("/auth/tokens", { api_key: process.env.PAYMOB_API_KEY })
  const order = await post<{ id: number }>("/ecommerce/orders", {
    auth_token: auth.token,
    delivery_needed: false,
    amount_cents,
    currency: "EGP",
    merchant_order_id: orderId,
    items: [],
  })
  const key = await post<{ token: string }>("/acceptance/payment_keys", {
    auth_token: auth.token,
    amount_cents,
    expiration: 3600,
    order_id: order.id,
    currency: "EGP",
    integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
    billing_data: {
      apartment: "NA", email: "customer@da3wetna.com", floor: "NA", first_name: "Da3wetna", street: "NA", building: "NA",
      phone_number: "+201000000000", shipping_method: "NA", postal_code: "NA", city: "NA", country: "EG", last_name: "Customer", state: "NA",
    },
  })
  return {
    url: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${key.token}`,
    paymobOrderId: String(order.id),
  }
}

type Obj = Record<string, unknown>
const pick = (o: Obj, path: string): string => {
  const v = path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Obj)[k] : undefined), o)
  return v === undefined || v === null ? "" : String(v)
}

// ترتيب الحقول المطلوب من Paymob لحساب HMAC (ترتيب أبجدي).
const HMAC_FIELDS = [
  "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id", "integration_id",
  "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment", "is_voided", "order.id",
  "owner", "pending", "source_data.pan", "source_data.sub_type", "source_data.type", "success",
]

export function verifyHmac(obj: Obj, received: string): boolean {
  const secret = process.env.PAYMOB_HMAC ?? ""
  if (!secret || !received) return false
  const expected = createHmac("sha512", secret).update(HMAC_FIELDS.map((f) => pick(obj, f)).join("")).digest("hex")
  return safeEqual(expected, received.toLowerCase())
}
