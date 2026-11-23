import type { ChangeEvent } from "react"

type Props = {
  arabicFont: string
  englishFont: string
  onArabicChange: (font: string) => void
  onEnglishChange: (font: string) => void
}

const arabicFonts = ["Amiri", "Aref Ruqaa", "Cairo", "Changa", "El Messiri", "IBM Plex Sans Arabic", "Almarai", "Alexandria", "Reem Kufi", "Tajawal", "Readex Pro", "Lalezar"]
const englishFonts = ["Cormorant Garamond", "Playfair Display", "Montserrat", "Poppins", "Lora", "Cinzel", "Libre Baskerville", "Great Vibes"]

export function FontPicker({ arabicFont, englishFont, onArabicChange, onEnglishChange }: Props) {
  return (
    <section className="rounded-2xl border border-[#f0dce1] bg-[#fffafa] p-4 sm:col-span-2" aria-label="اختيار الخطوط">
      <div className="flex items-center justify-between gap-3">
        <div><h3 className="font-bold text-[#4a2d33]">اختار الخطوط</h3><p className="mt-1 text-xs leading-6 text-[#806b70]">أكتر من 10 خطوط عربية وإنجليزية، والمعاينة بتتغير فورًا.</p></div>
        <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#a64257]">20 خط</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="field"><span>الخط العربي</span><select value={arabicFont} onChange={(e: ChangeEvent<HTMLSelectElement>) => onArabicChange(e.target.value)}>{arabicFonts.map((font) => <option key={font} value={font}>{font}</option>)}</select></label>
        <label className="field"><span>الخط الإنجليزي</span><select value={englishFont} onChange={(e: ChangeEvent<HTMLSelectElement>) => onEnglishChange(e.target.value)}>{englishFonts.map((font) => <option key={font} value={font}>{font}</option>)}</select></label>
      </div>
      <div className="mt-4 grid gap-2 rounded-xl border border-[#f0dce1] bg-white p-4 text-center">
        <p className="text-xl font-bold text-[#633c47]" style={{ fontFamily: '"' + arabicFont + '", serif' }}>محمد و سلمى — ليلة العمر</p>
        <p className="text-lg text-[#a64257]" style={{ fontFamily: '"' + englishFont + '", serif' }}>Mohamed &amp; Salma</p>
        <span className="text-[10px] text-[#9a8187]">معاينة الخط المختار</span>
      </div>
    </section>
  )
}
