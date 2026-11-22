/** شاشة الافتتاح لقالب "حكاية الحديقة": الظرف كله ملا الشاشة، والصورة فوقه زي ما هي، من غير أي نص. */
export function EstateOpening({ step, onOpen }: { step: number; onOpen: () => void }) {
  return (
    <main className="estate-open" data-step={step}>
      <button type="button" className="estate-env" onClick={onOpen} disabled={step > 0} aria-label="اضغط لفتح الدعوة">
        <span className="eo-liner" aria-hidden="true" />
        <span className="eo-body" aria-hidden="true" />
        <img className="eo-card" src="/estate-card.jpg" alt="" decoding="async" />
        <span className="eo-flap-shadow" aria-hidden="true" />
        <span className="eo-flap" aria-hidden="true" />
        <span className="eo-seal" aria-hidden="true"><span>❧</span></span>
      </button>
    </main>
  )
}
