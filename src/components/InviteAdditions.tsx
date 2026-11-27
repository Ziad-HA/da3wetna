import { useState, type CSSProperties } from "react"
import { RsvpForm } from "./RsvpForm"
import type { InviteDraft } from "../types"

type Props = {
  draft: InviteDraft
  inviteId?: string | null
  shareUrl?: string
  preview?: boolean
  palette?: { paper?: string; ink?: string; gold?: string; soft?: string }
  showRsvp?: boolean
  showShare?: boolean
  showParents?: boolean
  showClosing?: boolean
}

export function InviteAdditions({ draft, inviteId, shareUrl = "", preview = false, palette, showRsvp = true, showShare = true, showParents = true, showClosing = true }: Props) {
  const [notice, setNotice] = useState("")
  const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "")
  const title = `دعوة ${draft.groom} و${draft.bride}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const style = {
    "--add-paper": palette?.paper || "#fffaf5",
    "--add-ink": palette?.ink || "#633c47",
    "--add-gold": palette?.gold || "#b88b58",
    "--add-soft": palette?.soft || "#927b7f",
  } as CSSProperties

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setNotice("تم نسخ رابط الدعوة بنجاح.")
    } catch {
      setNotice("تعذر النسخ تلقائيًا. انسخ رابط الدعوة من شريط المتصفح.")
    }
  }

  const share = async (network: string) => {
    if (network === "instagram" || network === "tiktok") {
      await copyLink()
      return
    }
    if (network === "other" && navigator.share) {
      try { await navigator.share({ title, url }); return } catch { /* user cancelled */ }
    }
    const targets: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      other: url,
    }
    if (network === "other") { await copyLink(); return }
    window.open(targets[network], "_blank", "noopener,noreferrer")
  }

  return (
    <div className={`invite-additions invite-additions-${draft.templateId}`} style={style} dir="rtl" lang="ar">
      {showParents && (preview || draft.groomFather?.trim() || draft.brideFather?.trim()) ? <section className="invite-additions-parents" aria-label="والدا العروسين">
        <img src={draft.templateId === "estate" || draft.templateId === "estate-classic" ? "/vaux/flower_divider.jpg" : "/chateau/royal-blue-floral.webp"} alt="" aria-hidden="true" />
        <p className="invite-additions-parents-intro">بكل الحب يتشرفان بدعوتكم</p>
        <div className="invite-additions-parent">
          <span>والد العريس الأستاذ</span>
          <strong>{draft.groomFather || "—"}</strong>
        </div>
        <span className="invite-additions-parents-heart" aria-hidden="true">♡</span>
        <div className="invite-additions-parent">
          <span>والد العروسة الأستاذ</span>
          <strong>{draft.brideFather || "—"}</strong>
        </div>
        <img src={draft.templateId === "estate" || draft.templateId === "estate-classic" ? "/vaux/flower_divider.jpg" : "/chateau/royal-blue-floral.webp"} alt="" aria-hidden="true" />
      </section> : null}
      {showRsvp ? <section className="invite-additions-rsvp">
        <span className="invite-additions-ornament" aria-hidden="true">✦ ❦ ✦</span>
        <p className="invite-additions-kicker">تأكيد الحضور</p>
        <h2>يسعدنا معرفة تأكيد حضوركم</h2>
        <p className="invite-additions-description">سجّل بياناتك وسيصل تأكيدك مباشرة إلى العروسين.</p>
        {inviteId ? (
          <RsvpForm inviteId={inviteId} />
        ) : preview ? (
          <form className="invite-additions-preview-form" onSubmit={(event) => event.preventDefault()}>
            <label>الاسم<input disabled placeholder="الاسم بالكامل" /></label>
            <label>رقم الهاتف<input disabled placeholder="01xxxxxxxxx" /></label>
            <div className="invite-additions-choice"><span>سأحضر بإذن الله</span><span>أعتذر عن الحضور</span></div>
            <label>عدد الحضور<input disabled value="1" readOnly /></label>
            <label>رسالة للعروسين<textarea disabled placeholder="اكتب رسالتك هنا..." /></label>
            <button type="button" disabled>إرسال تأكيد الحضور ♡</button>
            <small>نموذج معاينة — يتم تفعيل الإرسال بعد إنشاء الدعوة</small>
          </form>
        ) : (
          <p className="invite-additions-description">سيظهر نموذج تأكيد الحضور عند نشر الدعوة.</p>
        )}
      </section> : null}

      {showShare ? <section className="invite-additions-share">
        <span className="invite-additions-ornament" aria-hidden="true">❦</span>
        <p className="invite-additions-kicker">شاركوا فرحتنا</p>
        <h2>شارك الدعوة مع الأهل والأصدقاء</h2>
        <div className="invite-additions-socials" aria-label="مشاركة الدعوة">
          <button type="button" onClick={() => share("whatsapp")}><b>◉</b><span>واتساب</span></button>
          <button type="button" onClick={() => share("facebook")}><b>f</b><span>Facebook</span></button>
          <button type="button" onClick={() => share("x")}><b>𝕏</b><span>X / Twitter</span></button>
          <button type="button" onClick={() => share("instagram")}><b>◎</b><span>Instagram</span></button>
          <button type="button" onClick={() => share("tiktok")}><b>♪</b><span>TikTok</span></button>
          <button type="button" onClick={() => share("other")}><b>↗</b><span>مشاركة أخرى</span></button>
        </div>
        <p className="invite-additions-note">في إنستجرام وتيك توك سيتم نسخ رابط الدعوة تلقائيًا.</p>
        {notice ? <p className="invite-additions-status" role="status" aria-live="polite">{notice}</p> : null}
      </section> : null}

      {showClosing ? <>
      <section className="invite-additions-closing invite-additions-waiting" aria-label="في انتظاركم">
        <div className="invite-additions-floral" aria-hidden="true">❦ ✦ ❦</div>
        <h2>في انتظاركم</h2>
        <p>وجودكم وسطنا هو أجمل هدية لينا</p>
        <span className="invite-additions-monogram" aria-hidden="true">♡</span>
      </section>

      <section className="invite-additions-closing invite-additions-love" aria-label="بكل حب">
        <span className="invite-additions-closing-kicker">بكل حب</span>
        <h2>مستنيين نشوفكم</h2>
        <p>يسعدنا حضوركم بأجمل إطلالة تليق بليلتنا.</p>
        <div className="invite-additions-floral" aria-hidden="true">✦ ❦ ✦</div>
      </section>
      </> : null}

    </div>
  )
}
