import type { CSSProperties } from "react"
import type { InviteDraft } from "../types"

/** كارت قصر الدير: نفس المكوّن للصفحة من جوه وللصورة المصغرة من برا. */
export function EstateCard({ draft, en = false }: { draft: InviteDraft; en?: boolean }) {
  const isEstate = draft.templateId === "estate" || draft.templateId === "estate-classic" || draft.templateId === "estate-rose"
  // Amiri هو الافتراضي، فبنسيب خط القالب؛ لو العميل اختار خط تاني بنستخدمه للأسماء
  const nameFont = draft.arabicFont && draft.arabicFont !== "Amiri" ? ({ "--estate-name-font": `"${draft.arabicFont}"` } as CSSProperties) : undefined

  return (
    <div className={`vaux-hero-inner ${isEstate ? "estate-hero" : ""}`} style={nameFont}>
      <img src="/vaux/hero_card_blank.jpg" alt="" className="vaux-hero-bg" />
      <div className="vaux-hero-content">
        <img src="/vaux/monogram_rose.png" alt="" className="vaux-hero-monogram" />
        {isEstate ? <p className="estate-hero-line">{en ? "United by one love" : "جمعنا الحب بقلبٍ واحد"}</p> : null}
        <h1 className="vaux-hero-names">
          <span>{draft.groom}</span><span className="vaux-amp">و</span><span>{draft.bride}</span>
        </h1>
        {isEstate ? <p className="estate-hero-line">{en ? "Our joy is only complete with you" : "ولا تكتمل فرحتنا إلا بحضوركم"}</p> : null}
        <p className="vaux-hero-hosts">{draft.hosts || (en ? "Together with our families" : "يتشرف الأهل بدعوتكم لحضور حفل الزفاف")}</p>
      </div>
    </div>
  )
}
