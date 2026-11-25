import { useEffect, useRef, useState } from "react"

type NasheedTrack = {
  id: string
  title: string
  artist: string
  file: string
}

const NASHEED_START_SECONDS = 75
const NASHEED_END_SECONDS = 165

const tracks: NasheedTrack[] = [
  { id: "baraka-allahu", title: "بارك الله لكما", artist: "ماهر زين", file: "/audio/Baraka%20Allahu%20Lakuma.mp3" },
  { id: "masha-allah", title: "ما شاء الله", artist: "ماهر زين", file: "/audio/Masha%20Allah.mp3" },
  { id: "rabbi-yebarek", title: "ربي يبارك", artist: "ماهر زين", file: "/audio/Rabbi%20Yebarek.mp3" },
  { id: "geena-nefrah", title: "For The Rest Of My Life", artist: "ماهر زين", file: "/audio/For%20The%20Rest%20Of%20My%20Life%20.wav" },
]

type Props = {
  value: string
  onChange: (file: string) => void
}

export function NasheedPicker({ value, onChange }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [previewing, setPreviewing] = useState(false)
  const [previewError, setPreviewError] = useState("")
  const selected = tracks.find((track) => track.file === value)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setPreviewing(false)
    setPreviewError("")
  }, [value])

  async function togglePreview() {
    const audio = audioRef.current
    if (!audio || !selected) return
    setPreviewError("")
    if (!audio.paused) {
      audio.pause()
      setPreviewing(false)
      return
    }
    try {
      if (audio.currentTime < NASHEED_START_SECONDS || audio.currentTime >= NASHEED_END_SECONDS) audio.currentTime = NASHEED_START_SECONDS
      await audio.play()
      setPreviewing(true)
    } catch {
      setPreviewing(false)
      setPreviewError("ملف النشيد لسه مش موجود. ضيفه في مجلد public/audio بنفس اسم الملف الموضح في تعليمات المشروع.")
    }
  }

  return (
    <section className="rounded-2xl border border-[#f0dce1] bg-white p-4" aria-label="اختيار نشيد الدعوة">
      <div className="mb-3">
        <p className="text-sm font-bold text-[#4a2d33]">اختار نشيد الدعوة</p>
        <p className="mt-1 text-[11px] leading-6 text-[#90777d]">اختار نشيد واحد، واسمع معاينة من منتصفه لمدة دقيقة ونصف. تقدر كمان تسيب الدعوة من غير موسيقى.</p>
      </div>
      <div className="grid gap-2">
        {tracks.map((track, index) => {
          const isSelected = selected?.id === track.id
          return (
            <div key={track.id} className={`flex items-center gap-3 rounded-xl border p-3 transition ${isSelected ? "border-[#b83b50] bg-[#fff5f6]" : "border-[#f0dce1] bg-[#fffdfd]"}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f8e8ec] text-xs font-extrabold text-[#a64257]">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#4a2d33]">{track.title}</p>
                <p className="mt-0.5 text-[11px] text-[#90777d]">{track.artist}</p>
              </div>
              <button type="button" onClick={() => onChange(isSelected ? "" : track.file)} className={`min-h-9 rounded-full px-3 text-[11px] font-extrabold transition ${isSelected ? "bg-[#a64257] text-white" : "bg-[#fff0f2] text-[#a64257] hover:bg-[#f8e1e6]"}`} aria-pressed={isSelected}>
                {isSelected ? "تم الاختيار ✓" : "اختار"}
              </button>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" disabled={!selected} onClick={() => void togglePreview()} className="min-h-10 rounded-full border border-[#e8cbd2] px-4 text-xs font-bold text-[#a64257] disabled:cursor-not-allowed disabled:opacity-40">
          {previewing ? "إيقاف المعاينة" : "▶ اسمع النشيد المختار"}
        </button>
        {selected ? <span className="text-[11px] text-[#806b70]">المختار: {selected.title}</span> : <span className="text-[11px] text-[#90777d]">لم يتم اختيار نشيد</span>}
      </div>
      {selected ? <audio ref={audioRef} src={selected.file} preload="none" onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= NASHEED_END_SECONDS) { event.currentTarget.pause(); event.currentTarget.currentTime = NASHEED_START_SECONDS; setPreviewing(false) } }} onEnded={() => setPreviewing(false)} onError={() => { setPreviewing(false); setPreviewError("ملف النشيد لسه مش موجود. ضيفه في مجلد public/audio بنفس اسم الملف الموضح في تعليمات المشروع.") }} /> : null}
      {previewError ? <p role="alert" className="mt-2 text-xs leading-6 text-[#a64257]">{previewError}</p> : null}
      <button type="button" onClick={() => onChange("")} disabled={!value} className="mt-3 text-[11px] font-bold text-[#90777d] underline underline-offset-4 disabled:opacity-40">إزالة النشيد من الدعوة</button>
    </section>
  )
}
