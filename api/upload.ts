import { randomUUID } from "node:crypto"
import { dbReady } from "./_lib/db.js"
import { body, clientIp, limited, send, type Req, type Res } from "./_lib/http.js"

const BUCKET = "invitation-media"
const TYPES: Record<string, { kind: "image" | "audio"; ext: string; max: number }> = {
  "image/jpeg": { kind: "image", ext: "jpg", max: 8 },
  "image/png": { kind: "image", ext: "png", max: 8 },
  "image/webp": { kind: "image", ext: "webp", max: 8 },
  "audio/mpeg": { kind: "audio", ext: "mp3", max: 12 },
  "audio/mp4": { kind: "audio", ext: "m4a", max: 12 },
  "audio/wav": { kind: "audio", ext: "wav", max: 12 },
  "audio/x-wav": { kind: "audio", ext: "wav", max: 12 },
  "audio/aac": { kind: "audio", ext: "aac", max: 12 },
}

/** Create a one-time signed upload URL. Privileged credentials never reach the browser. */
export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return send(res, 405, { error: "method" })
  if (!dbReady()) return send(res, 503, { error: "storage_unavailable" })
  if (limited(`upload:${clientIp(req)}`, 8, 3600_000)) return send(res, 429, { error: "slow_down" })

  const b = body(req)
  const mime = typeof b.contentType === "string" ? b.contentType.toLowerCase() : ""
  const type = TYPES[mime]
  const size = Number(b.size)
  if (!type || !Number.isFinite(size) || size <= 0 || size > type.max * 1024 * 1024) {
    return send(res, 400, { error: "invalid_file" })
  }

  const base = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? ""
  const path = `${type.kind}/${randomUUID()}.${type.ext}`

  try {
    const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" }
    if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`
    const response = await fetch(`${base}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    })
    const data = await response.json().catch(() => ({})) as { url?: string; signedURL?: string; message?: string }
    if (!response.ok || !(data.url || data.signedURL)) {
      console.error("upload-sign", response.status, data.message ?? "no signed URL")
      return send(res, 502, { error: "upload_sign_failed" })
    }
    const signedPath = data.url ?? data.signedURL!
    const uploadUrl = /^https?:\/\//i.test(signedPath)
      ? signedPath
      : `${base}/storage/v1${signedPath.startsWith("/") ? "" : "/"}${signedPath}`
    return send(res, 200, {
      uploadUrl,
      publicUrl: `${base}/storage/v1/object/public/${BUCKET}/${path}`,
    })
  } catch (error) {
    console.error("upload-sign", error)
    return send(res, 502, { error: "upload_sign_failed" })
  }
}
