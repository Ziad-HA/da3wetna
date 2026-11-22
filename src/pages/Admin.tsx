import { useEffect, useState } from "react"
import { adminAct, adminList, type AdminOrder } from "../lib/api"

const KEY = "da3wetna-admin-key"

export function Admin() {
  const [key, setKey] = useState(() => { try { return sessionStorage.getItem(KEY) ?? "" } catch { return "" } })
  const [orders, setOrders] = useState<AdminOrder[] | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")

  async function load(k = key) {
    setError("")
    const r = await adminList(k)
    if (!r.ok) { setOrders(null); setError(r.status === 401 ? "المفتاح غلط." : "السيرفر مش متاح أو الإدارة مش متفعلة."); return }
    try { sessionStorage.setItem(KEY, k) } catch { /* ignore */ }
    setOrders(r.data.orders)
  }
  useEffect(() => { document.title = "إدارة الطلبات"; if (key) void load(key) /* eslint-disable-next-line */ }, [])

  async function act(id: string, action: "approve" | "reject") {
    setBusy(id)
    const r = await adminAct(key, id, action)
    setBusy("")
    if (!r.ok) { setError("فشلت العملية."); return }
    await load()
  }

  return (
    <main id="main" className="mx-auto max-w-4xl px-3 py-8 sm:px-4">
      <h1 className="font-display text-3xl text-[#4a2d33]">إدارة الطلبات</h1>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); void load() }}>
        <input className="min-h-12 flex-1 rounded-2xl border border-[#ecd5da] px-4" type="password" dir="ltr" placeholder="ADMIN_KEY" value={key} onChange={(e) => setKey(e.target.value)} />
        <button className="btn-gold" type="submit">دخول</button>
      </form>
      {error ? <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
      <ul className="mt-5 grid gap-3">
        {orders?.map((o) => (
          <li key={o.id} className="rounded-2xl border border-[#f0dce1] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#a64257]">{o.id}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.status === "paid" ? "bg-[#edf7ef] text-[#38764a]" : o.status === "rejected" ? "bg-red-50 text-red-800" : "bg-[#fff4de] text-[#795a2d]"}`}>{o.status}</span>
            </div>
            <p className="mt-2 text-sm text-[#4a2d33]">{o.invites.map((i) => `${i.draft.groom} و${i.draft.bride}`).join("، ")}</p>
            <p className="mt-1 text-xs text-[#806b70]">{o.packageId} · {o.amount} ج · {o.method}{o.refNo ? ` · عملية ${o.refNo}` : ""} · {new Date(o.createdAt).toLocaleString("ar-EG")}</p>
            {o.status === "pending" ? (
              <div className="mt-3 flex gap-2">
                <button disabled={busy === o.id} onClick={() => act(o.id, "approve")} className="min-h-10 rounded-full bg-[#08745d] px-5 text-sm font-bold text-white">تفعيل</button>
                <button disabled={busy === o.id} onClick={() => act(o.id, "reject")} className="min-h-10 rounded-full border border-red-200 px-5 text-sm font-bold text-red-800">رفض</button>
              </div>
            ) : null}
          </li>
        ))}
        {orders && !orders.length ? <li className="text-center text-sm text-[#806b70]">مفيش طلبات.</li> : null}
      </ul>
    </main>
  )
}
