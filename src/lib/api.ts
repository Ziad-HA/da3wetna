import type { InviteDraft } from "../types"

export type Health = { db: boolean; paymob: boolean }

export type Rsvp = { id: number; name: string; attending: boolean; guests: number; note: string | null; createdAt: string }
export type DashboardInvite = {
  id: string
  draft: InviteDraft
  createdAt: string
  summary: { replies: number; attending: number; declined: number; guests: number }
  rsvps: Rsvp[]
}
export type Dashboard = {
  order: { id: string; packageId: string; quantity: number; amount: number; status: "pending" | "paid" | "rejected"; method: string; createdAt: string }
  remaining: number
  invites: DashboardInvite[]
}
export type AdminOrder = {
  id: string; packageId: string; amount: number; method: string; status: "pending" | "paid" | "rejected"
  refNo: string | null; createdAt: string; paidAt: string | null
  invites: { id: string; draft: InviteDraft }[]
}

export type ApiResult<T> = { ok: boolean; status: number; data: T }

async function call<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: { ...(init?.json !== undefined ? { "Content-Type": "application/json" } : {}), ...init?.headers },
      body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
    })
    const data = (await res.json().catch(() => ({}))) as T
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: {} as T }
  }
}

let healthPromise: Promise<Health> | null = null
/** هل قاعدة البيانات والدفع الآلي متفعلين على السيرفر؟ (بنسأل مرة واحدة). */
export function getHealth(): Promise<Health> {
  healthPromise ??= call<Health>("/api/health").then((r) => (r.ok && typeof r.data.db === "boolean" ? r.data : { db: false, paymob: false }))
  return healthPromise
}

export const createOrder = (payload: { draft: InviteDraft; packageId: string; method: string; refNo: string }) =>
  call<{ orderId: string; ownerToken: string; inviteId: string; status: string; error?: string }>("/api/orders", { method: "POST", json: payload })

export const fetchDashboard = (token: string) => call<Dashboard>(`/api/orders?token=${encodeURIComponent(token)}`)

export const addInvite = (token: string, draft: InviteDraft) =>
  call<{ inviteId: string; remaining: number; error?: string }>("/api/invites", { method: "POST", json: { token, draft } })

export const fetchInvite = (id: string) =>
  call<{ status: "ready" | "pending"; inviteId?: string; draft?: InviteDraft }>(`/api/invites?id=${encodeURIComponent(id)}`)

export const submitRsvp = (payload: { inviteId: string; name: string; attending: boolean; guests: number; note: string }) =>
  call<{ ok?: boolean; error?: string }>("/api/rsvp", { method: "POST", json: payload })

export const startPayment = (token: string) =>
  call<{ url?: string; error?: string }>("/api/pay?action=create", { method: "POST", json: { token } })

export const adminList = (key: string) => call<{ orders: AdminOrder[] }>("/api/admin", { headers: { "x-admin-key": key } })
export const adminAct = (key: string, orderId: string, action: "approve" | "reject") =>
  call<{ ok?: boolean }>("/api/admin", { method: "POST", json: { orderId, action }, headers: { "x-admin-key": key } })
