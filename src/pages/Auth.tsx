import { useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

export function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => { document.title = "حسابك — دعوتنا" }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    setNotice("دي واجهة تجريبية فقط. إنشاء الحساب وتسجيل الدخول هيتفعّلوا بعد ربط Supabase.")
  }

  function google() {
    setNotice("زر Google جاهز في التصميم، ولسه محتاج ربط Google OAuth من إعدادات Supabase.")
  }

  return (
    <main id="main" dir="rtl" className="min-h-[75vh] px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-md overflow-hidden rounded-[30px] border border-[#f0dce1] bg-white shadow-[0_20px_70px_rgba(74,45,51,.09)]">
        <div className="bg-[linear-gradient(135deg,#fff0f3,#fffaf4)] px-6 py-8 text-center sm:px-9">
          <span className="text-4xl text-[#b83b50]">♡</span>
          <p className="mt-2 text-[11px] font-extrabold tracking-[.22em] text-[#b36a78]">DA3WETNA ACCOUNT</p>
          <h1 className="mt-2 font-display text-3xl text-[#4a2d33]">أهلاً بيك في دعوتنا</h1>
          <p className="mt-2 text-sm leading-7 text-[#806b70]">اعمل حسابك عشان تتابع طلباتك وتحتفظ بدعواتك في مكان واحد.</p>
        </div>
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-2 rounded-2xl bg-[#fff5f6] p-1">
            <button type="button" onClick={() => { setMode("signup"); setNotice("") }} className={`min-h-11 rounded-xl text-sm font-bold transition ${mode === "signup" ? "bg-white text-[#a64257] shadow-sm" : "text-[#90777d]"}`}>حساب جديد</button>
            <button type="button" onClick={() => { setMode("login"); setNotice("") }} className={`min-h-11 rounded-xl text-sm font-bold transition ${mode === "login" ? "bg-white text-[#a64257] shadow-sm" : "text-[#90777d]"}`}>تسجيل الدخول</button>
          </div>
          <button type="button" onClick={google} className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#e8dfe0] bg-white px-4 text-sm font-bold text-[#4a2d33] transition hover:bg-[#fffafa]">
            <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#4A90E2" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"/></svg>
            المتابعة باستخدام Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-[#ad989d]"><span className="h-px flex-1 bg-[#f0e4e7]"/><span>أو بالبريد الإلكتروني</span><span className="h-px flex-1 bg-[#f0e4e7]"/></div>
          <form onSubmit={submit} className="grid gap-4">
            <label className="field"><span>البريد الإلكتروني</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" dir="ltr"/></label>
            <label className="field"><span>كلمة المرور</span><input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" dir="ltr"/></label>
            <button type="submit" className="btn-gold min-h-12 w-full">{mode === "signup" ? "إنشاء حساب تجريبي" : "تسجيل الدخول"}</button>
          </form>
          {notice ? <p role="status" className="mt-4 rounded-xl border border-[#f0dce1] bg-[#fff8f8] px-4 py-3 text-xs leading-6 text-[#80545e]">{notice}</p> : null}
          <p className="mt-5 text-center text-[11px] leading-6 text-[#9a8187]">تنبيه: التسجيل غير مفعّل فعليًا حاليًا، ومش هنحفظ أو نبعت بياناتك لأي خدمة.</p>
          <Link to="/account" className="mt-4 block text-center text-xs font-bold text-[#a64257] underline underline-offset-4">عندي لينك طلب قديم؟ افتح طلباتي</Link>
        </div>
      </section>
    </main>
  )
}
