import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { Link, useParams } from "react-router-dom"
import { StoryActions } from "../components/StoryActions"
import { VenueMap } from "../components/VenueMap"
import { Invitation } from "../components/Invitation"
import { getTemplate } from "../data"
import { isLight } from "../lib/color"
import { mapLink } from "../lib/maps"
import { EstateOpening } from "../components/EstateOpening"
import { RealisticEnvelopeOpening } from "../components/RealisticEnvelopeOpening"
import { GardenInvite } from "../components/GardenInvite"
import { SiteInvite } from "../components/SiteInvite"
import { ChateauInvite } from "../components/ChateauInvite"
import { RoyalBlueInvite } from "../components/RoyalBlueInvite"
import { StripInvite } from "../components/StripInvite"
import { RsvpForm } from "../components/RsvpForm"
import { InviteAdditions } from "../components/InviteAdditions"
import { useInvite } from "../lib/useInvite"
import type { InviteDraft } from "../types"

export function InviteView() {
  const { code = "" } = useParams()
  const state = useInvite(code)

  useEffect(() => { if (state.status !== "ready") document.title = "دعوة" }, [state.status])

  if (state.status === "loading") {
    return <main className="grid min-h-dvh place-items-center bg-cream px-4 text-center"><p className="font-display text-2xl text-[#a64257]" role="status">بنجهّز الدعوة…</p></main>
  }
  if (state.status === "pending") {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-4 text-center">
        <div className="max-w-sm"><span className="text-4xl text-[#c6a15b]">✦</span><h1 className="mt-3 font-display text-3xl">الدعوة لسه مفعّلتش</h1><p className="mt-3 leading-8 text-[#806b70]">الدعوة هتفتح للضيوف أول ما يتأكد الدفع. جرّب تاني بعد شوية.</p></div>
      </main>
    )
  }
  if (state.status === "missing") {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-4 text-center">
        <div>
          <h1 className="font-display text-4xl">الدعوة دي مش متاحة</h1>
          <Link to="/" className="btn-gold mt-6 inline-flex">اعمل دعوة من دعوتنا</Link>
        </div>
      </main>
    )
  }
  return <InviteBody draft={state.draft} inviteId={state.inviteId} code={code} />
}

function InviteBody({ draft, inviteId, code }: { draft: InviteDraft; inviteId: string | null; code: string }) {
  const template = getTemplate(draft.templateId)
  const [now, setNow] = useState(() => Date.now())
  const [introStep, setIntroStep] = useState(0)
  const [introSkipped, setIntroSkipped] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  const audioRef = useRef<HTMLAudioElement>(null)
  const eventDate = useMemo(() => draft.date ? new Date(`${draft.date}T${draft.time || "00:00"}:00`) : null, [draft.date, draft.time])
  const remaining = eventDate && !Number.isNaN(eventDate.getTime()) ? Math.max(0, eventDate.getTime() - now) : 0
  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const safeUrl = (value: string) => { try { const url = new URL(value, window.location.origin); return url.protocol === "https:" || url.protocol === "http:" ? url.href : "" } catch { return "" } }
  const musicUrl = safeUrl(draft.musicUrl)
  const photos = [draft.photoOne, draft.photoTwo].map(safeUrl).filter(Boolean)
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [])
  const rsvpNumber = draft.rsvpPhone.replace(/\D/g, "")
  const rsvpLink = rsvpNumber ? `https://wa.me/${rsvpNumber}?text=${encodeURIComponent(`أهلاً، حابب أأكد حضوري لمناسبة ${draft.groom} و${draft.bride}.`)}` : ""

  // الظرف بيستنى ضغطة الضيف (step 0). بعد الضغطة: الرفرف يفتح ← الكارت يطلع ← الدعوة تظهر.
  const hasDraft = true
  useEffect(() => {
    if (!hasDraft || introSkipped || introStep < 1 || introStep >= 3) return
    // Realistic envelopes manage their own shorter animation timeline.
    if (["royal-blue", "emerald-fern", "burgundy-velvet", "magnolia-ivory"].includes(draft.templateId)) return
    const timer = window.setTimeout(() => setIntroStep((step) => Math.min(3, step + 1)), introStep === 1 ? 500 : 650)
    return () => window.clearTimeout(timer)
  }, [hasDraft, introSkipped, introStep, draft.templateId])

  const MUSIC_START_SECONDS = 75
  const MUSIC_END_SECONDS = 165

  function startMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime < MUSIC_START_SECONDS || audio.currentTime >= MUSIC_END_SECONDS) audio.currentTime = MUSIC_START_SECONDS
    audio.volume = 0.7
    audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
  }

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) startMusic()
    else { audio.pause(); setMusicOn(false) }
  }

  function openEnvelope() {
    if (introStep > 0) return
    startMusic()
    setIntroStep(1)
  }

  useEffect(() => {
    document.title = `دعوة ${draft.groom} و${draft.bride}`
  }, [draft])

  if (!template) return null
  const isStrip = template.layout === "strip"
  const isSite = template.layout === "site"
  const isGarden = draft.templateId === "garden-classic"
  const additionsPalette = draft.templateId === "royal-blue"
    ? { paper: "#F1F6FC", ink: "#173B60", gold: "#B99655", soft: "#526A85" }
    : { paper: template.vars.paper, ink: template.vars.ink, gold: template.vars.gold, soft: template.vars.soft }

  const audio = musicUrl ? <audio ref={audioRef} src={musicUrl} preload="auto" onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= MUSIC_END_SECONDS) { event.currentTarget.pause(); event.currentTarget.currentTime = MUSIC_START_SECONDS; setMusicOn(false) } }} onEnded={() => setMusicOn(false)} /> : null

  if (!introSkipped && introStep < 3) {
    if (
      draft.templateId === "royal-blue" ||
      draft.templateId === "emerald-fern" ||
      draft.templateId === "burgundy-velvet" ||
      draft.templateId === "magnolia-ivory"
    ) {
      return (
        <>
          {audio}
          <RealisticEnvelopeOpening
            themeId={draft.templateId}
            draft={draft}
            template={template}
            onOpen={openEnvelope}
            onComplete={() => setIntroStep(3)}
            onSkip={() => { startMusic(); setIntroSkipped(true); setIntroStep(3) }}
          />
        </>
      )
    }

    // قصر الدير يحتفظ بفتحته الأصلية دون أي تغيير.
    const isQasrElDeir = draft.templateId === "estate" || draft.templateId === "estate-classic"
    const colorway = isQasrElDeir
      ? undefined
      : draft.templateId === "garden-classic"
        ? "sage"
        : draft.templateId === "envelope" || draft.templateId === "chateau"
          ? "burgundy"
          : "blush"

    return (
      <>
        {audio}
        <EstateOpening
          draft={draft}
          step={introStep}
          colorway={colorway}
          onOpen={openEnvelope}
          onComplete={() => setIntroStep(3)}
          onSkip={() => { startMusic(); setIntroSkipped(true); setIntroStep(3) }}
        />
      </>
    )
  }

  return (
    <>
    {audio}
    <main className={`invite-public-page min-h-dvh px-4 py-8${isStrip ? " strip-page" : ""}${isSite ? " site-page" : ""}${draft.templateId === "royal-blue" ? " royal-blue-page" : ""}`} style={{ background: isStrip ? "#4b4e30" : isSite ? (draft.templateId === "chateau" ? "#F5F2EA" : draft.templateId === "royal-blue" ? "#EAF0F7" : "#EFE7D1") : template.vars.shell, color: isStrip ? "#f4efe2" : isSite ? (draft.templateId === "chateau" ? "#1E4030" : "#5E1C2A") : isLight(template.vars.shell) ? template.vars.ink : "#fff6ea", "--invite-font-ar": `"${draft.arabicFont || "Amiri"}"`, "--invite-font-en": `"${draft.englishFont || "Cormorant Garamond"}"`, "--opening-ink": isLight(template.vars.shell) ? template.vars.ink : "#fff6ea", "--opening-accent": isLight(template.vars.shell) ? template.vars.gold : "#f2d9a4" } as CSSProperties}>
      <div className={`mx-auto grid w-full ${isSite ? (draft.templateId === "royal-blue" ? "max-w-5xl" : "max-w-6xl") : "max-w-md"} justify-items-center gap-5`}>
        {isGarden ? (
          <>
          <GardenInvite
            draft={draft}
            rsvp={inviteId ? <RsvpForm inviteId={inviteId} language="ar" /> : undefined}
            shareUrl={window.location.href}
          />
          <InviteAdditions draft={draft} shareUrl={window.location.href} palette={additionsPalette} showRsvp={false} />
          </>
        ) : isSite ? (
          <>
            {draft.templateId === "chateau" ? (
              <>
              <ChateauInvite
                draft={draft}
                rsvp={inviteId ? <RsvpForm inviteId={inviteId} /> : null}
                shareUrl={window.location.href}
              />
              <InviteAdditions draft={draft} shareUrl={window.location.href} palette={additionsPalette} showRsvp={false} />
                <div className="w-full"><StoryActions draft={draft} code={code} language={language} /></div>
              </>
            ) : draft.templateId === "royal-blue" ? (
              <>
                <RoyalBlueInvite
                  draft={draft}
                  endingAdditions={<>
                    <InviteAdditions draft={draft} inviteId={inviteId} shareUrl={window.location.href} palette={additionsPalette} showParents={false} />
                    <div className="w-full"><StoryActions draft={draft} code={code} language={language} /></div>
                  </>}
                />
              </>
            ) : (
              <SiteInvite
                draft={draft}
                template={template}
                preview={false}
                rsvp={inviteId ? (formLanguage) => <RsvpForm inviteId={inviteId} language={formLanguage} /> : undefined}
                shareUrl={window.location.href}
                showRsvpSection={false}
                showShareSection={false}
                musicOn={musicOn}
                hasMusic={Boolean(musicUrl)}
                onToggleMusic={toggleMusic}
                language={language}
                onToggleLanguage={() => setLanguage((current) => current === "ar" ? "en" : "ar")}
                endingAdditions={<>
                  {["estate", "emerald-fern", "burgundy-velvet", "magnolia-ivory"].includes(draft.templateId) ? (
                    <InviteAdditions draft={draft} inviteId={inviteId} shareUrl={window.location.href} palette={additionsPalette} showParents={draft.templateId !== "estate" && draft.templateId !== "estate-classic"} />
                  ) : null}
                  <div className="w-full"><StoryActions draft={draft} code={code} language={language} /></div>
                </>}
              />
            )}
          </>
        ) : isStrip ? (
          <>
            <StripInvite draft={draft} template={template} autoScroll />
            <InviteAdditions draft={draft} inviteId={inviteId} shareUrl={window.location.href} palette={additionsPalette} />
          </>
        ) : (
          <>
        <header className="invite-public-heading text-center">
          <span className="invite-public-kicker">دعوة من القلب · بكل الحب</span>
          <h1 className="mt-2 font-display text-3xl">{draft.groom} <i>و</i> {draft.bride}</h1>
          <p className="mt-2 text-sm opacity-80">يسعدنا وجودكم ومشاركتنا أجمل لحظاتنا ♡</p>
        </header>
        <div className="invite-public-card w-full overflow-hidden rounded-[28px] shadow-2xl">
          <Invitation draft={draft} />
        </div>
        <InviteAdditions draft={draft} inviteId={inviteId} shareUrl={window.location.href} palette={additionsPalette} />
        <section className="invite-welcome-message w-full rounded-[26px] border border-white/70 bg-white/80 p-5 text-center shadow-lg">
          <span className="text-2xl text-[#b83b50]">❦</span>
          <p className="mt-2 text-base font-bold leading-8 text-[#633c47]">{draft.message || "وجودكم هو أجمل هدية، وبتكتمل فرحتنا بيكم."}</p>
          <p className="mt-3 text-sm leading-7 text-[#806b70]">مستنيينكم تشاركونا يوم مميز من أيام العمر. حضوركم هيضيف لفرحتنا معنى أجمل وذكرى تفضل معانا دايمًا.</p>
        </section>
        <section className="w-full rounded-[26px] border border-white/70 bg-white/75 p-4 text-center shadow-lg backdrop-blur">
          <p className="text-xs font-bold tracking-wide opacity-70">الوقت المتبقي على فرحتنا</p>
          {eventDate && !Number.isNaN(eventDate.getTime()) ? <div className="mt-3 grid grid-cols-4 gap-2" dir="rtl">{[[days,"يوم"],[hours,"ساعة"],[minutes,"دقيقة"],[seconds,"ثانية"]].map(([value,label]) => <div key={String(label)} className="rounded-2xl bg-white px-1 py-3 shadow-sm"><strong className="block font-display text-2xl text-[#a64257]">{String(value).padStart(2,"0")}</strong><span className="mt-1 block text-[10px] text-[#806b70]">{label}</span></div>)}</div> : <p className="mt-3 text-sm">ميعاد المناسبة هيتحدد قريبًا</p>}
        </section>
        {photos.length ? <section className="invite-photo-moments w-full rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-lg"><p className="mb-3 text-center font-bold text-[#4a2d33]">صور من حكايتنا ♡</p><div className="grid grid-cols-2 gap-2">{photos.map((photo, index) => <img key={photo} src={photo} alt={`صورة من المناسبة ${index + 1}`} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />)}</div></section> : null}
          </>
        )}
        {!isSite ? <>
          <VenueMap draft={draft} />
          <a href={mapLink(draft)} target="_blank" rel="noreferrer" className="btn-ghost w-full justify-center bg-white/80">📍 افتح الموقع على الخريطة</a>
          {inviteId ? <RsvpForm inviteId={inviteId} /> : null}
          {rsvpLink ? <a href={rsvpLink} target="_blank" rel="noreferrer" className={`${inviteId ? "btn-ghost bg-white/80" : "btn-gold"} w-full justify-center`}>{inviteId ? "أو كلّمنا على واتساب" : "أكد حضورك على واتساب ♡"}</a> : null}
          <div className="w-full"><StoryActions draft={draft} code={code} /></div>
          <section className="w-full rounded-[26px] border border-white/70 bg-white/80 p-4 text-center shadow-lg">
            <p className="font-bold text-[#4a2d33]">احتفظ بالدعوة وشاركها</p>
            <p className="mt-1 text-xs text-[#806b70]">امسح رمز QR لفتح نفس الدعوة بسهولة.</p>
            <img className="mx-auto mt-3 h-36 w-36 rounded-xl border border-[#f0dce1] bg-white p-2" loading="lazy" alt="رمز QR لفتح الدعوة" src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(`${window.location.origin}/i/${code}`)}`} />
            <p className="mt-2 break-all text-[10px] text-[#9a8187]">{`${window.location.origin}/i/${code}`}</p>
          </section>
          <Link to="/" className="text-sm font-bold underline-offset-4 hover:underline">دعوة من دعوتنا</Link>
        </> : null}
      </div>
      {!isSite && musicUrl ? <button type="button" onClick={toggleMusic} className="invite-music-toggle" aria-pressed={musicOn} aria-label={musicOn ? "إيقاف موسيقى الدعوة" : "تشغيل موسيقى الدعوة"}>{musicOn ? "♫" : "♪"}</button> : null}
    </main>
    </>
  )
}
