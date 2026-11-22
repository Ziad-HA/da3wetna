import { useState } from "react"
import { uploadInvitationMedia } from "../lib/uploads"

type Props = {
  label: string
  kind: "image" | "audio"
  value: string
  onChange: (url: string) => void
}

export function MediaUploadField({ label, kind, value, onChange }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function choose(file?: File) {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const url = await uploadInvitationMedia(file, kind)
      onChange(url)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حصلت مشكلة أثناء رفع الملف.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[#f0dce1] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#4a2d33]">{label}</p>
          <p className="mt-1 text-[11px] text-[#90777d]">{kind === "image" ? "اختار صورة من موبايلك — حتى 8 ميجابايت" : "اختار ملف موسيقى من جهازك — حتى 12 ميجابايت"}</p>
        </div>
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full bg-[#fff0f2] px-4 text-xs font-extrabold text-[#a64257] transition hover:bg-[#f8e1e6]">
          {busy ? "جاري الرفع..." : value ? "تغيير الملف" : "اختار ملف"}
          <input className="sr-only" type="file" accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "audio/mpeg,audio/mp4,audio/wav,audio/aac"} disabled={busy} onChange={(event) => { void choose(event.target.files?.[0]); event.currentTarget.value = "" }} />
        </label>
      </div>
      {value ? (
        <div className="mt-3 flex items-center gap-3">
          {kind === "image" ? <img src={value} alt={label} className="h-16 w-16 rounded-xl border border-[#f0dce1] object-cover" /> : <audio controls preload="none" src={value} className="min-w-0 flex-1" />}
          <button type="button" onClick={() => onChange("")} className="text-xs font-bold text-[#a64257] underline underline-offset-4">حذف</button>
        </div>
      ) : null}
      {error ? <p role="alert" className="mt-3 text-xs leading-6 text-red-700">{error}</p> : null}
    </div>
  )
}
