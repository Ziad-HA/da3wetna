const bucket = "invitation-media"

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "")
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("رفع الملفات محتاج إعداد التخزين مرة واحدة من إدارة الموقع.")
  return { url, key }
}

export async function uploadInvitationMedia(file: File, kind: "image" | "audio"): Promise<string> {
  const { url, key } = config()
  const allowed = kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("audio/")
  if (!allowed) throw new Error(kind === "image" ? "اختار صورة بصيغة JPG أو PNG أو WebP." : "اختار ملف صوتي بصيغة MP3 أو M4A أو WAV.")
  const max = kind === "image" ? 8 : 12
  if (file.size > max * 1024 * 1024) throw new Error(`حجم الملف لازم يكون أقل من ${max} ميجابايت.`)

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || (kind === "image" ? "jpg" : "mp3")
  const path = `${kind}/${crypto.randomUUID()}.${extension}`
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: file,
  })
  if (!response.ok) {
    const details = await response.text().catch(() => "")
    throw new Error(response.status === 413 ? "الملف حجمه كبير." : `تعذر رفع الملف. راجع إعدادات Supabase Storage. ${details.slice(0, 140)}`)
  }
  return `${url}/storage/v1/object/public/${bucket}/${path}`
}
