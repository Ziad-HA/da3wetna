import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function Account() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  useEffect(() => { document.title = "حسابي — دعوتنا" }, [])

  return (
    <main id="main" className="min-h-[75vh] px-4 py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-[#f0dce1] bg-white shadow-[0_20px_70px_rgba(74,45,51,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.75),transparent_35%),linear-gradient(145deg,#f9e5e9,#fff5f1_65%,#f4e6d7)] p-7 sm:p-10 md:flex md:min-h-[560px] md:flex-col md:justify-between">
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full border border-[#c6a15b]/35" />
          <div className="pointer-events-none absolute -bottom-8 -left-2 h-40 w-40 rounded-full border border-[#c6a15b]/30" />
          <Link to="/" className="relative inline-flex items-center gap-2 text-[#a64257]"><span className="text-3xl">✿</span><span className="font-display text-3xl text-[#4a2d33]">دعوتنا</span></Link>
          <div className="relative mt-9 md:mt-0">
            <p className="text-xs font-bold tracking-[.2em] text-[#a45b69]">YOUR SPECIAL MOMENTS</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.35] text-[#4a2d33] sm:text-5xl">كل تفاصيل فرحتك، في مكان واحد</h1>
            <p className="mt-4 max-w-sm text-sm leading-8 text-[#806b70]">حسابك هيساعدك تتابع دعواتك وتوصل لتصميماتك بسهولة — قريبًا بعد تفعيل تسجيل الحسابات.</p>
          </div>
          <div className="relative mt-8 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 p-4 text-sm text-[#806b70] backdrop-blur">
            <span className="text-2xl text-[#b83b50]">♡</span><span>دعواتك وذكرياتك الحلوة في مكان واحد.</span>
          </div>
        </aside>
        <section className="p-6 sm:p-10 md:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold text-[#b36a78]">أهلاً بيك في دعوتنا</p>
            <h2 className="mt-2 font-display text-3xl text-[#4a2d33]">{mode === "login" ? "سجّل دخولك" : "أنشئ حساب جديد"}</h2>
            <p className="mt-2 text-sm leading-7 text-[#90777d]">استخدم حسابك عشان تتابع كل دعواتك من مكان واحد.</p>
            <div className="mt-7 grid grid-cols-2 rounded-full bg-[#fff4f5] p-1">
              <button type="button" onClick={() => setMode("login")} className={`rounded-full py-3 text-sm font-bold transition ${mode === "login" ? "bg-white text-[#a64257] shadow-sm" : "text-[#90777d]"}`}>تسجيل الدخول</button>
              <button type="button" onClick={() => setMode("signup")} className={`rounded-full py-3 text-sm font-bold transition ${mode === "signup" ? "bg-white text-[#a64257] shadow-sm" : "text-[#90777d]"}`}>حساب جديد</button>
            </div>
            <form className="mt-7 grid gap-4" onSubmit={(event) => event.preventDefault()}>
              {mode === "signup" ? <label className="field"><span>الاسم</span><input type="text" placeholder="اكتب اسمك" autoComplete="name" /></label> : null}
              <label className="field"><span>البريد الإلكتروني</span><input type="email" placeholder="name@example.com" autoComplete="email" /></label>
              <label className="field"><span>كلمة المرور</span><input type="password" placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
              <button type="button" disabled className="mt-2 flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-[#a64257]/55 px-5 text-sm font-bold text-white">تسجيل الحسابات قريبًا</button>
            </form>
            <div className="mt-5 rounded-2xl border border-[#f0dce1] bg-[#fff9f8] p-4 text-xs leading-6 text-[#90777d]">
              <strong className="text-[#704b54]">ملحوظة:</strong> دي واجهة الحساب حاليًا. تسجيل الدخول وإنشاء الحساب هيتفعّلوا بعد ربط Supabase وإعداد مفاتيح المشروع.
            </div>
            <Link to="/templates" className="mt-6 block text-center text-sm font-bold text-[#a64257] underline underline-offset-4">تصفح الدعوات من غير حساب</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
