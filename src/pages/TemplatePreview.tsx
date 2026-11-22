import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { EstateOpening } from "../components/EstateOpening"
import { Invitation } from "../components/Invitation"
import { OpeningEnvelope } from "../components/OpeningEnvelope"
import { SiteInvite } from "../components/SiteInvite"
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
  const [musicOn, setMusicOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const draft = useMemo(() => {
    return template ? draftFor(template) : null
  }, [template])

  useEffect(() => {
    if (template) {
      document.title = `معاينة ${template.name} — دعوتنا`
    }
  }, [template])

  if (!template || !draft) {
    return <Navigate to="/templates" replace />
  }

  function startMusic() {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.7
    audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
  }

  function openEnvelope() {
    if (introStep > 0) return
    startMusic()
    setIntroStep(1)
  }

  function handleStartEditing() {
    clearDraft()
    navigate(`/editor/${template.id}`)
  }

  const isStrip = template.layout === "strip"
  const isSite = template.layout === "site"

  return (
    <div className="preview-page-container relative min-h-dvh">
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
          <div className="hidden sm:block">
            <span className="text-[11px] text-white/70">معاينة تجريبية:</span>
            <strong className="mr-1 text-sm text-white">{template.name}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold text-amber-200 sm:inline-block">
            أسماء تجريبية للعرض
          </span>
          <button
            type="button"
            onClick={handleStartEditing}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#b83b50] px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#a12f43] active:scale-95 sm:px-5 sm:py-2 sm:text-sm"
          >
            <span>ابدأ التعديل الآن</span>
            <span>✦</span>
          </button>
        </div>
      </header>

      {/* Opening Envelope Screens */}
      {!introSkipped && introStep < 3 && template.envelope.zoom ? (
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
      ) : !introSkipped && introStep < 3 ? (
        <main
          className={`invite-opening-screen invite-opening-step-${introStep}`}
          style={
            {
              "--invite-shell": template.vars.shell,
              "--opening-ink": isLight(template.vars.shell) ? template.vars.ink : "#fff6ea",
              "--opening-accent": isLight(template.vars.shell) ? template.vars.gold : "#f2d9a4",
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
          className={`invite-public-page min-h-dvh px-4 pb-28 pt-16 sm:pt-20${
            isStrip ? " strip-page" : ""
          }${isSite ? " site-page" : ""}`}
          style={
            {
              background: isStrip ? "#4b4e30" : isSite ? "#FAF6EE" : template.vars.shell,
              color: isStrip
                ? "#f4efe2"
                : isSite
                ? "#5E1C2A"
                : isLight(template.vars.shell)
                ? template.vars.ink
                : "#fff6ea",
              "--opening-ink": isLight(template.vars.shell) ? template.vars.ink : "#fff6ea",
              "--opening-accent": isLight(template.vars.shell) ? template.vars.gold : "#f2d9a4",
            } as CSSProperties
          }
        >
          <div className="mx-auto grid w-full max-w-md justify-items-center gap-5">
            {isSite ? (
              <SiteInvite draft={draft} template={template} />
            ) : isStrip ? (
              <StripInvite draft={draft} template={template} autoScroll />
            ) : (
              <>
                <header className="invite-public-heading text-center">
                  <span className="invite-public-kicker">دعوة من القلب · بكل الحب</span>
                  <h1 className="mt-2 font-display text-3xl">
                    {draft.groom} <i>و</i> {draft.bride}
                  </h1>
                  <p className="mt-2 text-sm opacity-80">
                    يسعدنا وجودكم ومشاركتنا أجمل لحظاتنا ♡
                  </p>
                </header>
                <div className="invite-public-card">
                  <Invitation draft={draft} />
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {/* Bottom Sticky Action Banner (visible when opened) */}
      {introStep === 3 && (
        <aside
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[#f0dce1] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-6"
          aria-label="تعديل هذا التصميم"
        >
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#4a2d33]">عجبك شكل الدعوة؟</p>
              <p className="text-[11px] text-[#806b70]">تقدر تضيف أساميكم وتاريخكم وتبدأ فوراً</p>
            </div>
            <button
              type="button"
              onClick={handleStartEditing}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#b83b50] px-4 py-2 text-xs font-extrabold text-white shadow-md transition hover:bg-[#a12f43] active:scale-95 sm:px-5 sm:text-sm"
            >
              <span>تعديل التصميم</span>
              <span>←</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
