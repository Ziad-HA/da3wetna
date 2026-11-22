const URL_ = () => (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "")
// Server-only credential. Never expose this value through a VITE_ variable.
const KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? ""

export const dbReady = () => Boolean(URL_() && KEY())
export const eq = (value: string) => `eq.${encodeURIComponent(value)}`

type Init = { method?: "GET" | "POST" | "PATCH"; body?: unknown; prefer?: string }

/** Call Supabase PostgREST with a server-only privileged key. */
export async function db<T = unknown[]>(path: string, init: Init = {}): Promise<T> {
  const key = KEY()
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: init.prefer ?? "return=representation",
  }
  // New sb_secret keys are opaque API keys, not JWTs. Do not send them as Bearer tokens.
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`

  const res = await fetch(`${URL_()}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  if (!res.ok) {
    const err = new Error(`db ${res.status}: ${(await res.text()).slice(0, 300)}`) as Error & { status: number }
    err.status = res.status
    throw err
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : []) as T
}

export type OrderRow = {
  id: string
  package_id: string
  quantity: number
  amount: number
  method: "vodafone" | "instapay" | "paymob"
  status: "pending" | "paid" | "rejected"
  ref_no: string | null
  owner_token: string
  paymob_order_id: string | null
  created_at: string
  paid_at: string | null
}
export type InviteRow = { id: string; order_id: string; draft: unknown; created_at: string }
export type RsvpRow = { id: number; invite_id: string; name: string; attending: boolean; guests: number; note: string | null; created_at: string }
