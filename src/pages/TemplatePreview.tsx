import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { EstateOpening } from "../components/EstateOpening"
import { ChateauOpening } from "../components/ChateauOpening"
import { GardenOpening } from "../components/GardenOpening"
import { GardenInvite } from "../components/GardenInvite"
import { Invitation } from "../components/Invitation"
import { OpeningEnvelope } from "../components/OpeningEnvelope"
import { SiteInvite } from "../components/SiteInvite"
import { ChateauInvite } from "../components/ChateauInvite"
import { RoyalBlueInvite } from "../components/RoyalBlueInvite"
import { InviteAdditions, InviteClosingSections } from "../components/InviteAdditions"
import { RealisticEnvelopeOpening } from "../components/RealisticEnvelopeOpening"
import { StripInvite } from "../components/StripInvite"
import { draftFor, getTemplate } from "../data"
import { isLight } from "../lib/color"
import { clearDraft } from "../lib/storage"

export function TemplatePreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const template = getTemplate(id)

  const [introStep, setIntroStep] = useState(0)
  const [introSkipped, setIntroSkipped] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicError, setMusicError] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)

  const draft = useMemo(() => {
    if (!template) return null
    const previewDraft = draftFor(template)
    previewDraft.groom = "محمد"
    previewDraft.bride = "سلمى"
    previewDraft.groomFather = "أحمد"
    previewDraft.brideFather = "محمد"
    previewDraft.date = "2027-01-10"
    return previewDraft
  }, [template])

  useEffect(() => {
    if (template) {
      document.title = `معاينة ${template.name} — دعوتنا`
    }
  }, [template])

  function playFrom75() {
    const audio = audioRef.current
    if (!audio || !draft?.musicUrl) return
    setMusicError("")
    audio.volume = 0.7

    const seekToStart = () => {
      if (audio.duration && audio.duration <= 75) {
        setMusicError("ملف الأغنية أقصر من 75 ثانية، اختار ملف أطول.")
        return
      }
      try {
        audio.currentTime = 75
      } catch {
        setMusicError("تعذر الانتقال إلى الثانية 75 في ملف الأغنية.")
      }
    }

    // Keep the seek tied to the metadata event when the file is not ready yet.
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      seekToStart()
      audio.play().then(() => setMusicPlaying(true)).catch(() => {
        setMusicPlaying(false)
        setMusicError("مش قادرين نشغّل النشيد. جرّب زر التشغيل مرة تانية.")
      })
      return
    }

    const onMetadata = () => {
      audio.removeEventListener("loadedmetadata", onMetadata)
      seekToStart()
    }
    audio.addEventListener("loadedmetadata", onMetadata, { once: true })
    const playback = audio.play()
    playback.then(() => setMusicPlaying(true)).catch(() => {
      audio.removeEventListener("loadedmetadata", onMetadata)
      setMusicPlaying(false)
      setMusicError("مش قادرين نشغّل النشيد. جرّب زر التشغيل مرة تانية.")
    })
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !draft?.musicUrl) return
    audio.volume = 0.7
    playFrom75()
  }, [template?.id, draft?.musicUrl])

  if (!template || !draft) {
    return <Navigate to="/templates" replace />
  }

  function startMusic() {
    playFrom75()
  }

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      startMusic()
    } else {
      audio.pause()
      setMusicPlaying(false)
    }
  }

  function openEnvelope() {
    if (introStep > 0) return
    startMusic()
    setIntroStep(1)
  }

  function handleStartEditing() {
    if (!template) return
    clearDraft()
    navigate(`/editor/${template.id}`)
  }

  const isStrip = template.layout === "strip"
  const isSite = template.layout === "site"
  const isGarden = template.id === "garden-classic"

  return (
    <div className="preview-page-container relative min-h-dvh">
      <audio ref={audioRef} src={draft.musicUrl || undefined} preload="auto" onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= 165) { event.currentTarget.pause(); setMusicPlaying(false) } }} onEnded={() => setMusicPlaying(false)} onError={() => { setMusicPlaying(false); setMusicError("ملف النشيد مش متاح حاليًا. تقدر تختار نشيد تاني من التعديل.") }} />
      {/* Top Floating Bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/20 bg-black/40 px-3 py-2.5 backdrop-blur-md sm:px-6 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/templates"
            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/30"
          >
            <span>←</span>
            <span>التصميمات</span>
          </Link>
          <div className="min-w-0 sm:block">
            <span className="block text-[9px] text-white/70 sm:inline sm:text-[11px]">معاينة تجريبية</span>
            <strong className="block max-w-[118px] truncate text-xs text-white sm:mr-1 sm:inline sm:max-w-none sm:text-sm">{template.name}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleMusic} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-white/25" aria-label={musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}>
            <span aria-hidden="true">{musicPlaying ? "Ⅱ" : "♫"}</span>
            <span>{musicPlaying ? "إيقاف الأغنية" : "تشغيل الأغنية"}</span>
          </button>
          <span className="hidden rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold text-amber-200 sm:inline-block">
            أسماء تجريبية للعرض
          </span>
          <button
            type="button"
            onClick={handleStartEditing}
            className="hidden items-center gap-1.5 rounded-full bg-[#b83b50] px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#a12f43] active:scale-95 sm:inline-flex sm:px-5 sm:py-2 sm:text-sm"
          >
            <span>ابدأ التعديل الآن</span>
            <span>✦</span>
          </button>
        </div>
      </header>

      {musicError ? <p role="status" className="fixed right-3 top-[58px] z-[70] max-w-[calc(100%-24px)] rounded-xl bg-black/75 px-3 py-2 text-xs font-bold text-white shadow-lg sm:right-6">{musicError}</p> : null}

      {/* Opening Envelope Screens */}
      {!introSkipped && introStep < 3 && (template.id === "royal-blue" || template.id === "emerald-fern" || template.id === "burgundy-velvet" || template.id === "magnolia-ivory") ? (
        <RealisticEnvelopeOpening
          themeId={template.id}
          draft={draft}
          template={template}
          onOpen={openEnvelope}
          onComplete={() => setIntroStep(3)}
          onSkip={() => {
            startMusic()
            setIntroSkipped(true)
            setIntroStep(3)
          }}
        />
      ) : !introSkipped && introStep < 3 && isGarden ? (
        <GardenOpening draft={draft} onOpen={() => setIntroStep(3)} />
      ) : !introSkipped && introStep < 3 && template.envelope.zoom ? (
        template.id === "chateau" ? (
          <ChateauOpening
            draft={draft}
            step={introStep}
            onOpen={openEnvelope}
            onComplete={() => setIntroStep(3)}
            onSkip={() => {
              startMusic()
              setIntroSkipped(true)
              setIntroStep(3)
            }}
          />
        ) : (
          <EstateOpening
            draft={draft}
            step={introStep}
            onOpen={openEnvelope}
            onComplete={() => setIntroStep(3)}
            onSkip={() => {
              startMusic()
              setIntroSkipped(true)
              setIntroStep(3)
            }}
          />
        )
      ) : !introSkipped && introStep < 3 ? (
        <main
          className={`invite-opening-screen invite-opening-step-${introStep}`}
          style={
            {
              "--invite-shell": template.vars.shell,
              "--opening-ink": isLight(template.vars.shell) ? template.vars.ink : "#fff6ea",
              "--opening-accent": isLight(template.vars.shell) ? template.vars.gold : "#f2d9a4",
              "--flow-paper": template.vars.paper,
              "--flow-ink": template.vars.ink,
              "--flow-gold": template.vars.gold,
              "--flow-shell": template.vars.shell,
            } as CSSProperties
          }
        >
          <div className="invite-opening-glow" aria-hidden="true" />
          <div className="invite-opening-copy">
            <span>بكل الحب ندعوكم لمشاركتنا</span>
            <h1>
              {draft.groom} <i>و</i> {draft.bride}
            </h1>
            <p>
              {draft.occasion} · {draft.venue}
            </p>
          </div>
          <OpeningEnvelope
            template={template}
            draft={draft}
            step={introStep}
            onOpen={openEnvelope}
          />
          <p className="invite-opening-hint" data-step={introStep}>
            {introStep === 0
              ? "اضغط على الظرف لفتح الدعوة"
              : introStep === 1
              ? "بنفتح الظرف…"
              : "دعوتكم وصلت ♡"}
          </p>
          <button
            type="button"
            className="invite-skip-opening"
            onClick={() => {
              startMusic()
              setIntroSkipped(true)
              setIntroStep(3)
            }}
          >
            تخطي المقدمة ←
          </button>
        </main>
      ) : (
        /* Full Invitation View once envelope is opened */
        <main
          className={`invite-public-page invite-floral-flow min-h-dvh px-4 pb-36 pt-16 sm:pb-32 sm:pt-20${template.id === "emerald-fern" ? " emerald-fern-page" : ""}${
            isStrip ? " strip-page" : ""
          }${isSite ? " site-page" : ""}${template.id === "royal-blue" ? " royal-blue-page" : ""}`}
          style={
            {
              background: template.id === "emerald-fern" ? "#10291D" : isStrip ? "#4b4e30" : isSite ? (template.id === "chateau" ? "#F5F2EA" : template.id === "royal-blue" ? "#EAF0F7" : "#FAF6EE") : template.vars.shell,
              color: isStrip
                ? "#f4efe2"
                : isSite
                ? (template.id === "chateau" ? "#1E4030" : template.id === "emerald-fern" ? "#F4F0E4" : "#5E1C2A")
                : isLight(template.vars.shell)
                ? template.vars.ink
                : "#fff6ea",
              "--opening-ink": isLight(template.vars.shell) ? template.vars.ink : "#fff6ea",
              "--opening-accent": isLight(template.vars.shell) ? template.vars.gold : "#f2d9a4",
            } as CSSProperties
          }
        >
          <div className={`preview-content mx-auto grid w-full ${isSite ? (template.id === "royal-blue" ? "preview-content-site max-w-5xl" : "preview-content-site max-w-6xl") : "max-w-3xl"} justify-items-center gap-5` }>
            {isGarden ? (
              <GardenInvite draft={draft} />
            ) : isSite ? (
              template.id === "chateau" ? (
                <ChateauInvite draft={draft} />
              ) : template.id === "royal-blue" ? (
                <RoyalBlueInvite
                  draft={draft}
                  preview
                  endingAdditions={<InviteAdditions draft={draft} preview shareUrl={window.location.href} palette={{ paper: "#F1F6FC", ink: "#173B60", gold: "#B99655", soft: "#526A85" }} showParents={false} />}
                />
              ) : (
                <SiteInvite
                  draft={draft}
                  template={template}
                  preview={template.id === "estate" || template.id === "estate-classic"}
                  endingAdditions={(template.id === "estate" || template.id === "estate-classic") ? <InviteAdditions draft={draft} preview shareUrl={window.location.href} palette={{ paper: template.vars.paper, ink: template.vars.ink, gold: template.vars.gold, soft: template.vars.soft }} showParents={false} /> : undefined}
                />
              )
            ) : isStrip ? (
              <StripInvite draft={draft} template={template} autoScroll />
            ) : (
              <>
                {draft.templateId === "emerald-fern" ? null : (
                  <header className="invite-public-heading text-center">
                    <span className="invite-public-kicker">دعوة من القلب · بكل الحب</span>
                    <h1 className="mt-2 font-display text-3xl">
                      {draft.groom} <i>و</i> {draft.bride}
                    </h1>
                    <p className="mt-2 text-sm opacity-80">
                      يسعدنا وجودكم ومشاركتنا أجمل لحظاتنا ♡
                    </p>
                  </header>
                )}
                <div className={draft.templateId === "emerald-fern" ? "fern-full" : "invite-public-card w-full max-w-[390px] overflow-hidden rounded-[24px] shadow-2xl"}>
                  <Invitation draft={draft} />
                </div>
                {draft.templateId === "emerald-fern" ? <SiteInvite draft={draft} template={template} preview sectionsOnly /> : null}
              </>
            )}
            {template.id !== "royal-blue" && template.id !== "estate" && template.id !== "estate-classic" ? (
              <InviteAdditions
                draft={draft}
                preview
                shareUrl={window.location.href}
                palette={{ paper: template.vars.paper, ink: template.vars.ink, gold: template.vars.gold, soft: template.vars.soft }}
              />
            ) : null}
            <InviteClosingSections palette={{ paper: template.vars.paper, ink: template.vars.ink, gold: template.vars.gold, soft: template.vars.soft }} />
          </div>
        </main>
      )}

      {/* Sticky action stays visible on phones and desktop throughout the demo. */}
      <aside
        className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#f0dce1] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-6"
        aria-label="ابدأ تعديل الدعوة"
      >
        <div className="mx-auto flex max-w-md flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="text-center sm:text-right">
            <p className="text-xs font-bold text-[#4a2d33]">
              {introStep === 3 || introSkipped ? "عجبك شكل الدعوة؟" : "دي معاينة بأسماء تجريبية"}
            </p>
            <p className="mt-0.5 text-[10px] text-[#806b70] sm:text-[11px]">
              {introStep === 3 || introSkipped ? "ابدأ التعديل واكتب بيانات مناسبتك" : "افتح الظرف وشوف الدعوة كاملة قبل ما تبدأ"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartEditing}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#b83b50] px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#a12f43] active:scale-[.98] sm:w-auto"
          >
            <span>ابدأ التعديل الآن</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
