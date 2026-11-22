import { useEffect, useState } from "react"
import type { InviteDraft } from "../types"
import { fetchInvite } from "./api"
import { decodeDraft } from "./codec"

export type InviteState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "pending" }
  | { status: "ready"; draft: InviteDraft; inviteId: string | null }

/** بيجيب الدعوة من اللينك: الدعوات القديمة جوّه اللينك نفسه، والجديدة كود قصير من قاعدة البيانات. */
export function useInvite(code: string): InviteState {
  const [state, setState] = useState<InviteState>(() => {
    const legacy = decodeDraft(code)
    if (legacy) return { status: "ready", draft: legacy, inviteId: null }
    return /^[a-z0-9]{6,12}$/.test(code) ? { status: "loading" } : { status: "missing" }
  })

  useEffect(() => {
    const legacy = decodeDraft(code)
    if (legacy) { setState({ status: "ready", draft: legacy, inviteId: null }); return }
    if (!/^[a-z0-9]{6,12}$/.test(code)) { setState({ status: "missing" }); return }
    let cancelled = false
    setState({ status: "loading" })
    fetchInvite(code).then((r) => {
      if (cancelled) return
      if (r.ok && r.data.status === "ready" && r.data.draft) setState({ status: "ready", draft: r.data.draft, inviteId: r.data.inviteId ?? code })
      else if (r.ok && r.data.status === "pending") setState({ status: "pending" })
      else setState({ status: "missing" })
    })
    return () => { cancelled = true }
  }, [code])

  return state
}
