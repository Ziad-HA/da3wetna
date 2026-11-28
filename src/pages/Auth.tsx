import { useEffect } from "react"
import { Link } from "react-router-dom"

export function Auth() {
  useEffect(() => { document.title = "حسابك — دعوتي" }, [])

  return (
    <main id="main" dir="rtl" className="min-h-[75vh] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-md overflow-hidden rounded-[30px] border border-[#f0dce1] bg-white shadow-[0_20px_70px_rgba(74,45,51,.09)]">
        <div className="bg-[linear-gradient(135deg,#fff0f3,#fffaf4)] px-6 py-8 text-center sm:px-9">
          <span className="text-4xl text-[#b83b50]">♡</span>
          <p className="mt-2 text-[11px] font-extrabold tracking-[.22em] text-[#b36a78]">DA3WETY ACCOUNT</p>
          <h1 className="mt-2 font-display text-3xl text-[#4a2d33]">الحسابات قريبًا</h1>
          <p className="mt-2 text-sm leading-7 text-[#806b70]">من غير حساب تقدر تعمل دعوتك وتتابع طلبك بلينك لوحة الطلب.</p>
        </div>
        <div className="grid gap-3 p-5 sm:p-8">
          <Link to="/account" className="btn-gold grid min-h-12 w-full place-items-center">افتح طلباتي</Link>
          <Link to="/templates" className="text-center text-sm font-bold text-[#a64257] underline underline-offset-4">تصفح الدعوات</Link>
        </div>
      </section>
    </main>
  )
}
