const maxByKind = { image: 8, audio: 12 } as const

export async function uploadInvitationMedia(file: File, kind: "image" | "audio"): Promise<string> {
  const allowed = kind === "image"
    ? ["image/jpeg", "image/png", "image/webp"]
    : ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-wav", "audio/aac"]

  if (!allowed.includes(file.type)) {
    throw new Error(kind === "image"
      ? "اختار صورة بصيغة JPG أو PNG أو WebP."
      : "اختار ملف صوتي بصيغة MP3 أو M4A أو WAV أو AAC.")
  }
  if (file.size <= 0 || file.size > maxByKind[kind] * 1024 * 1024) {
    throw new Error(`حجم الملف لازم يكون أقل من ${maxByKind[kind]} ميجابايت.`)
  }

  // The server validates the file and signs a one-time upload URL.
  const signed = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  })
  const payload = await signed.json().catch(() => ({})) as { uploadUrl?: string; publicUrl?: string; error?: string }
  if (!signed.ok || !payload.uploadUrl || !payload.publicUrl) {
    throw new Error(signed.status === 503
      ? "رفع الملفات غير متاح حاليًا. إعداد التخزين على السيرفر لسه ناقص."
      : "تعذر تجهيز رفع الملف. حاول مرة تانية.")
  }

  const uploaded = await fetch(payload.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type, "x-upsert": "false" },
    body: file,
  })
  if (!uploaded.ok) {
    throw new Error(uploaded.status === 413
      ? "الملف حجمه كبير."
      : "تعذر رفع الملف إلى التخزين. حاول مرة تانية.")
  }
  return payload.publicUrl
}
