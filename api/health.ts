import { db, dbReady } from "./_lib/db.js"
import { paymobReady } from "./_lib/paymob.js"
import { send, type Req, type Res } from "./_lib/http.js"

/** Public diagnostic: verify a real PostgREST read without exposing credentials or database details. */
export default async function handler(_req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store")
  let dbConnected = false
  if (dbReady()) {
    try {
      await db<unknown[]>("orders?select=id&limit=1")
      dbConnected = true
    } catch (error) {
      console.error("health-db", error)
    }
  }
  send(res, 200, { db: dbConnected, paymob: dbConnected && paymobReady() })
}
