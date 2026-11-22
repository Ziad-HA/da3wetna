import { dbReady } from "./_lib/db.js"
import { paymobReady } from "./_lib/paymob.js"
import { send, type Req, type Res } from "./_lib/http.js"

/** الموقع بيسأل هنا: قاعدة البيانات والدفع الآلي شغالين ولا لأ؟ (بنرجع true/false بس). */
export default function handler(_req: Req, res: Res) {
  res.setHeader("Cache-Control", "public, s-maxage=60")
  send(res, 200, { db: dbReady(), paymob: dbReady() && paymobReady() })
}
