import { useCallback, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { getPackage, site } from "../config"
import { fetchDashboard, type Dashboard as Data, type DashboardInvite } from "../lib/api"
import { clearDraft, writeOwnerToken } from "../lib/storage"
import { invitePath } from "../lib/codec"

function csv(invite: DashboardInvite) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = [["الاسم", "رقم الهاتف", "الحضور", "العدد", "ملاحظة"], ...invite.rsvps.map((r) => [r.name, r.phone ?? "", r.attending ? "حاضر" : "معتذر", String(r.attending ? r.guests : 0), r.note ?? ""])]
  const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `ردود-${invite.draft.groom}-${invite.draft.bride}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function Dashboard() {
  const { token = "" } = useParams()
  const [params] = useSearchParams()
  const [data, setData] = useState<Data | null>(null)
  const [state, setState] = useState<"loading" | "error" | "ready">("loading")
  const [copied, setCopied] = useState("")

  const load = useCallback(async () => {
    const r = await fetchDashboard(token)
    if (r.ok && r.data.order) { setData(r.data); setState("ready"); return r.data.order.status }
    setState((s) => (s === "ready" ? s : "error"))
    return null
  }, [token])

  useEffect(() => { document.title = "لوحة طلبي — دعوتنا"; writeOwnerToken(token) }, [token])
  useEffect(() => {
    let stop = false
    let tries = 0
    const tick = async () => {
      const status = await load()
      if (stop) return
      if (status === "paid") { window.setTimeout(tick, 15000); return }
      if ((status === "pending" || params.get("paid") === "1") && status !== "rejected" && tries++ < 60) window.setTimeout(tick, 5000)
    }
    void tick()
    return () => { stop = true }
  }, [load, params])

  async function copy(id: string) {
    try { await navigator.clipboard.writeText(`${window.location.origin}${invitePath(id)}`); setCopied(id); window.setTimeout(() => setCopied(""), 1800) } catch { /* ignore */ }
  }

  if (state === "loading") return <main id="main" className="mx-auto max-w-lg px-4 py-20 text-center"><p role="status" className="font-display text-2xl text-[#a64257]">بنفتح لوحة طلبك…</p></main>
  if (state === "error" || !data) {
    return (
      <main id="main" className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-[#4a2d33]">اللينك ده مش صالح</h1>
        <p className="mt-3 text-[#806b70]">تأكد إنك فاتح اللينك كامل، أو كلّمنا على واتساب.</p>
        <Link to="/account" className="btn-gold mt-6 inline-flex">افتح طلبي</Link>
      </main>
    )
  }

  const { order, invites, remaining } = data
  const pkg = getPackage(order.packageId)
  const paid = order.status === "paid"

  return (
    <main id="main" className="mx-auto max-w-4xl px-3 py-8 sm:px-4 md:py-14">
      <header className="text-center">
        <p className="text-xs font-bold text-[#b83b50]">لوحة طلبك</p>
        <h1 className="mt-2 font-display text-4xl text-[#4a2d33]">{pkg.name}</h1>
        <p className="mt-2 text-xs text-[#9a8187]">رقم الطلب: <span className="font-mono">{order.id}</span></p>
      </header>

      <section className={`mt-6 rounded-[24px] border p-5 ${paid ? "border-[#cce4d8] bg-[#f2faf5]" : order.status === "rejected" ? "border-red-200 bg-red-50" : "border-[#e8c9a4] bg-[#fff9ed]"}`} aria-live="polite">
        {paid ? <><h2 className="font-bold text-[#176447]">الطلب متفعّل ✓</h2><p className="mt-1 text-sm text-[#527566]">دعواتك شغالة وتقدر تبعتها للضيوف.</p></> : null}
        {order.status === "pending" ? (
          <>
            <h2 className="font-bold text-[#795a2d]">{order.method === "paymob" ? "بنتأكد من الدفع…" : "مستنيين مراجعة التحويل"}</h2>
            <p className="mt-1 text-sm leading-7 text-[#806b70]">{order.method === "paymob" ? "الصفحة بتتحدّث لوحدها أول ما الدفع يتأكد." : "ابعت إيصال التحويل ورقم الطلب على واتساب وهنفعّل الدعوة بعد المراجعة."}</p>
            <a className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#a64257] px-5 text-sm font-bold text-white" target="_blank" rel="noreferrer" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("طلب دعوتنا " + order.id)}`}>كلّمنا على واتساب</a>
          </>
        ) : null}
        {order.status === "rejected" ? <><h2 className="font-bold text-red-800">الطلب اترفض</h2><p className="mt-1 text-sm text-red-800">تواصل معانا على واتساب ونحلها.</p></> : null}
      </section>

      <p className="mt-4 rounded-2xl bg-[#fff4f5] p-3 text-center text-xs leading-6 text-[#806b70]">احتفظ بلينك الصفحة دي — هو مفتاح طلبك وبه تتابع ردود الضيوف.</p>

      <div className="mt-6 grid gap-5">
        {invites.map((inv) => (
          <article key={inv.id} className="rounded-[24px] border border-[#f0dce1] bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl text-[#4a2d33]">{inv.draft.groom} و{inv.draft.bride}</h3>
                <p className="mt-1 text-xs text-[#9a8187]">{inv.draft.date}</p>
              </div>
              {paid ? (
                <div className="flex flex-wrap gap-2">
                  <Link className="min-h-10 rounded-full border border-[#e8c8cf] px-4 py-2 text-xs font-bold text-[#a64257]" to={invitePath(inv.id)} target="_blank">فتح الدعوة</Link>
                  <button type="button" onClick={() => copy(inv.id)} className="min-h-10 rounded-full bg-[#a64257] px-4 text-xs font-bold text-white">{copied === inv.id ? "تم النسخ ✓" : "نسخ اللينك"}</button>
                  <Link className="min-h-10 rounded-full border border-[#e8c8cf] px-4 py-2 text-xs font-bold text-[#a64257]" to={`/done/${inv.id}`}>ستوري وتحميل</Link>
                </div>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[["ردود", inv.summary.replies], ["حاضرين", inv.summary.attending], ["إجمالي الأفراد", inv.summary.guests]].map(([t, n]) => (
                <div key={t as string} className="rounded-2xl bg-[#fbf7f3] py-3"><strong className="block text-2xl text-[#4a2d33]">{n}</strong><span className="text-xs text-[#806b70]">{t}</span></div>
              ))}
            </div>
            {inv.rsvps.length ? (
              <>
                <ul className="mt-4 divide-y divide-[#f3e6e9]">
                  {inv.rsvps.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div className="min-w-0"><strong className="block truncate text-[#4a2d33]">{r.name}</strong><a href={`tel:${r.phone}`} className="block truncate text-xs text-[#a64257]" dir="ltr">{r.phone}</a>{r.note ? <span className="block truncate text-xs text-[#806b70]">{r.note}</span> : null}</div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${r.attending ? "bg-[#edf7ef] text-[#38764a]" : "bg-[#fdeeee] text-[#a33]"}`}>{r.attending ? `حاضر · ${r.guests}` : "معتذر"}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => csv(inv)} className="mt-3 text-xs font-bold text-[#a64257] underline underline-offset-4">تحميل الردود (Excel)</button>
              </>
            ) : <p className="mt-4 text-center text-sm text-[#9a8187]">لسه مفيش ردود.</p>}
          </article>
        ))}
      </div>

      {paid && remaining > 0 ? (
        <section className="mt-6 rounded-[24px] border border-[#f0dce1] bg-white p-5 text-center">
          <p className="font-bold text-[#4a2d33]">متبقي لك {remaining} دعوة في الباقة</p>
          <Link to="/templates" onClick={clearDraft} className="btn-gold mt-4 inline-flex">أنشئ دعوة جديدة</Link>
        </section>
      ) : null}
    </main>
  )
}
