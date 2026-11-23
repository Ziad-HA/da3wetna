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
      setPreviewError("مش قادر أشغّل المعاينة. اتأكد إن ملف النشيد موجود في مجلد public/audio.")
    }
  }

  return (
    <section id="nasheed-picker" className="scroll-mt-5 overflow-hidden rounded-[26px] border border-[#e9cbd2] bg-[linear-gradient(145deg,#fff7f8_0%,#fff_58%,#fffaf3_100%)] p-4 shadow-[0_12px_32px_rgba(115,65,77,0.07)] sm:p-5" aria-label="اختيار موسيقى الدعوة">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#a64257] text-xl text-white shadow-sm" aria-hidden="true">♫</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-extrabold text-[#4a2d33] sm:text-lg">موسيقى الدعوة</h3>
            <span className="rounded-full bg-[#f8e8ec] px-2.5 py-1 text-[10px] font-bold text-[#a64257]">اختياري</span>
          </div>
          <p className="mt-1 text-xs leading-6 text-[#806b70]">اختار النشيد اللي تحبه، وهيظهر للمدعوين مع فتح الدعوة. تقدر تسمع معاينة قبل الاختيار.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {tracks.map((track, index) => {
          const isSelected = selected?.id === track.id
          return (
            <div key={track.id} className={`nasheed-picker-track flex min-w-0 flex-col gap-3 rounded-2xl border p-3 transition sm:flex-row sm:items-center ${isSelected ? "border-[#b83b50] bg-[#fff1f3] shadow-[0_4px_14px_rgba(184,59,80,.08)]" : "border-[#f0dce1] bg-white/90"}`}>
              <div className="flex min-w-0 items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${isSelected ? "bg-[#a64257] text-white" : "bg-[#f8e8ec] text-[#a64257]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-bold leading-6 text-[#4a2d33]">{track.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#90777d]">{track.artist}</p>
                </div>
                {isSelected ? <span className="shrink-0 text-xs font-bold text-[#a64257]" aria-label="تم الاختيار">✓</span> : null}
              </div>
              <button type="button" onClick={() => onChange(isSelected ? "" : track.file)} className={`min-h-10 w-full shrink-0 rounded-xl px-3 text-xs font-extrabold transition sm:ml-auto sm:w-auto ${isSelected ? "bg-[#a64257] text-white" : "bg-[#fff0f2] text-[#a64257] hover:bg-[#f8e1e6]"}`} aria-pressed={isSelected}>
                {isSelected ? "إلغاء الاختيار" : "اختار النشيد"}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-[#f0dce1] bg-white/85 p-3 sm:flex sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-[#4a2d33]">{selected ? `النشيد المختار: ${selected.title}` : "لسه مفيش نشيد مختار"}</p>
          <p className="mt-1 text-[11px] leading-5 text-[#90777d]">المعاينة مدتها دقيقة ونصف، من جزء مناسب من النشيد.</p>
        </div>
        <button type="button" disabled={!selected} onClick={() => void togglePreview()} className="mt-3 min-h-11 w-full rounded-xl border border-[#e8cbd2] px-4 text-xs font-extrabold text-[#a64257] transition hover:bg-[#fff5f6] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-0 sm:w-auto">
          {previewing ? "إيقاف المعاينة ■" : "▶ اسمع المعاينة"}
        </button>
      </div>
      {selected ? <audio ref={audioRef} src={selected.file} preload="none" onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= NASHEED_END_SECONDS) { event.currentTarget.pause(); event.currentTarget.currentTime = NASHEED_START_SECONDS; setPreviewing(false) } }} onEnded={() => setPreviewing(false)} onError={() => { setPreviewing(false); setPreviewError("مش قادر أشغّل المعاينة. اتأكد إن ملف النشيد موجود في مجلد public/audio.") }} /> : null}
      {previewError ? <p role="alert" className="mt-3 rounded-xl bg-[#fff0f2] px-3 py-2 text-xs leading-6 text-[#a64257]">{previewError}</p> : null}
      <button type="button" onClick={() => onChange("")} disabled={!value} className="mt-3 min-h-9 text-[11px] font-bold text-[#90777d] underline underline-offset-4 disabled:opacity-40">إزالة الموسيقى من الدعوة</button>
    </section>
  )
}
