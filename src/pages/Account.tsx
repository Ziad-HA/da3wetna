import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { readOwnerToken } from "../lib/storage"

function extractToken(input: string): string {
  const m = input.match(/dashboard\/([A-Za-z0-9_-]{16,})/)
  if (m) return m[1]
  const t = input.trim()
  return /^[A-Za-z0-9_-]{16,}$/.test(t) ? t : ""
}

export function Account() {
  const navigate = useNavigate()
  const saved = readOwnerToken()
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  useEffect(() => { document.title = "طلبي — دعوتنا" }, [])

  function open(event: React.FormEvent) {
    event.preventDefault()
    const token = extractToken(value)
    if (!token) { setError("الصق لينك لوحة الطلب كامل."); return }
    navigate(`/dashboard/${token}`)
  }

  return (
    <main id="main" className="min-h-[70vh] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#f0dce1] bg-white p-6 text-center shadow-[0_20px_70px_rgba(74,45,51,0.08)] sm:p-9">
        <span className="text-4xl text-[#b83b50]">♡</span>
        <h1 className="mt-3 font-display text-3xl text-[#4a2d33]">طلبي ودعواتي</h1>
        <p className="mt-2 text-sm leading-7 text-[#806b70]">من غير تسجيل حساب — لينك لوحة طلبك هو مفتاحك. افتحه عشان تتابع ردود الضيوف وتضيف دعوات.</p>
        {saved ? <Link to={`/dashboard/${saved}`} className="btn-gold mt-6 w-full">افتح لوحة طلبي</Link> : null}
        <form onSubmit={open} className="mt-6 text-right" noValidate>
          <label className="field"><span>{saved ? "أو الصق لينك لوحة طلب تاني" : "الصق لينك لوحة الطلب"}</span>
            <input dir="ltr" value={value} onChange={(e) => { setValue(e.target.value); setError("") }} placeholder="https://…/dashboard/…" /></label>
          {error ? <p className="mt-2 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
          <button type="submit" className={`${saved ? "btn-ghost" : "btn-gold"} mt-4 w-full`}>فتح</button>
        </form>
        <Link to="/auth" className="mt-6 block text-sm font-bold text-[#a64257] underline underline-offset-4">تسجيل حساب جديد أو الدخول</Link>
        <Link to="/templates" className="mt-3 block text-sm font-bold text-[#a64257] underline underline-offset-4">تصفح الدعوات</Link>
      </div>
    </main>
  )
}
