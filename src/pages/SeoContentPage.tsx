import { useEffect } from "react"
import { Link } from "react-router-dom"
import { templates } from "../data"

const pages = [
  {
    path: "/دعوة-زفاف-الإلكترونية", title: "دعوة زفاف إلكترونية", heading: "دعوة زفاف إلكترونية تليق بيومكم",
    intro: "صمّم دعوة زفاف رقمية بتفاصيلكم وأسلوبكم، وشاركها مع الأهل والأصحاب بصورة مناسبة للستوري أو برابط سهل الإرسال.",
    sections: [
      ["دعوة تجمع تفاصيل يوم الزفاف", "اكتبوا أسماء العروسين وموعد الفرح ومكان الاحتفال وأي رسالة تحبوا توصلوها للمدعوين. تقدروا تشوفوا شكل الدعوة أثناء التعديل."],
      ["تصميم يناسب ذوقكم", "اختاروا من تصاميم متنوعة بين الورد الهادي والألوان الكلاسيكية والستايل العصري، وبعدها خصصوا تفاصيل الدعوة."],
      ["شاركوا الدعوة بسهولة", "بعد تجهيز الدعوة، شاركوها مع ضيوفكم من خلال صورة مناسبة للستوري أو رابط الدعوة."]
    ],
    faqs: [["هل أقدر أكتب أسماء العروسين بنفسي؟", "أيوه، تقدر تدخل الأسماء وتفاصيل المناسبة من المحرر وتشوف المعاينة."], ["هل الدعوة مناسبة لواتساب؟", "تقدر تشارك صورة الدعوة أو رابطها مع المدعوين على واتساب."]]
  },
  {
    path: "/دعوة-فرح", title: "دعوة فرح", heading: "دعوة فرح بسيطة وجميلة",
    intro: "جهّز دعوة الفرح بطريقتك، واكتب أسماء العروسين وميعاد ومكان الاحتفال في تصميم رقمي سهل التعديل والمشاركة.",
    sections: [
      ["كل معلومات الفرح في دعوة واحدة", "خلّي المدعوين يعرفوا اليوم والميعاد والعنوان من أول نظرة. أضف رسالة ترحيب قصيرة وتفاصيل المكان."],
      ["اختار شكل يعبر عن فرحتكم", "من التصاميم الوردية الهادية للتفاصيل الذهبية والستايل العصري، هتلاقي اختيارات تقدر تبدأ منها وتخصصها."],
      ["دعوة جاهزة للإرسال", "بعد مراجعة البيانات، شارك الدعوة مع العيلة والأصحاب كصورة أو لينك."]
    ],
    faqs: [["أقدر أضيف عنوان القاعة؟", "أيوه، اكتب اسم المكان والمدينة أو العنوان المتاح في تفاصيل الدعوة."], ["ينفع أغير البيانات؟", "تقدر تراجع وتعدّل التفاصيل من المحرر قبل إكمال الطلب."]]
  },
  {
    path: "/دعوة-خطوبة", title: "دعوة خطوبة", heading: "دعوة خطوبة تعلنوا بيها فرحتكم",
    intro: "احتفلوا ببداية حكايتكم مع دعوة خطوبة إلكترونية تحمل أسماءكم وموعد ومكان المناسبة، بتصميم تختاروه بنفسكم.",
    sections: [
      ["تفاصيل مناسبة الخطوبة", "أضيفوا أسماء العروسين وتاريخ الخطوبة والميعاد ومكان الاحتفال، واكتبوا جملة لطيفة ترحب بالمدعوين."],
      ["ستايلات مختلفة للمناسبة", "اختاروا تصميم رقيق أو مودرن حسب ذوقكم، وبعدها عدّلوا النصوص والتفاصيل من خلال المحرر."],
      ["ابعتوا الدعوة لكل اللي بتحبوهم", "شاركوا صورة الدعوة أو رابطها مع الأصدقاء والعائلة على تطبيقات التواصل."]
    ],
    faqs: [["هل التصاميم مناسبة للخطوبة؟", "في المعرض تصاميم مناسبة لمناسبات مختلفة، ومنها الخطوبة."], ["هل أقدر أكتب رسالة خاصة؟", "تقدر تضيف رسالة المناسبة في الحقول المتاحة داخل المحرر."]]
  },
  {
    path: "/دعوات-الكترونية", title: "دعوات إلكترونية", heading: "دعوات إلكترونية لمناسباتكم",
    intro: "اختاروا تصميم دعوة رقمية، خصصوا بيانات المناسبة، وشاركوها بسهولة مع العيلة والأصحاب.",
    sections: [
      ["إيه هي الدعوة الإلكترونية؟", "دعوة رقمية بتجمع تفاصيل المناسبة في تصميم واحد، تقدر تشاركها كصورة أو كرابط بدل الاعتماد على كروت ورقية فقط."],
      ["مناسبة لأكتر من احتفال", "استخدموا التصاميم المتاحة للفرح والخطوبة، واختاروا الشكل المناسب لفرحتكم."],
      ["تعديل ومشاركة من مكان واحد", "اكتبوا التفاصيل وشوفوا المعاينة، وبعدها اختاروا الباقة المناسبة وشاركوا الدعوة."]
    ],
    faqs: [["هل الدعوة الإلكترونية بتحتاج تطبيق؟", "لا، تقدر تستخدم الموقع من متصفح الإنترنت."], ["هل أقدر أبعت الدعوة لأكتر من شخص؟", "تقدر تشارك نفس صورة الدعوة أو رابطها مع أي عدد من المدعوين."]]
  },
  {
    path: "/كروت-افراح", title: "كروت أفراح إلكترونية", heading: "كروت أفراح بتصميم رقمي",
    intro: "بديل رقمي لكروت الأفراح، بتفاصيل واضحة وتصميم قابل للتخصيص والمشاركة على الموبايل.",
    sections: [
      ["شكل الكارت على ذوقكم", "اختاروا من أشكال مختلفة بين الكلاسيكي والناعم والعصري، واكتبوا البيانات الأساسية للمناسبة."],
      ["كل التفاصيل في مكان واحد", "بدل ما تعيدوا إرسال الموعد والمكان في كل محادثة، شاركوا صورة الكارت أو رابطه مع المدعوين."],
      ["راجعوا قبل المشاركة", "المعاينة بتساعدكم تتأكدوا من الأسماء والتاريخ والمكان قبل إكمال الطلب."]
    ],
    faqs: [["هل الكارت الإلكتروني ينفع يتبعت واتساب؟", "أيوه، تقدر تشارك الصورة أو الرابط من خلال واتساب."], ["هل أقدر أختار تصميم؟", "تقدر تختار من التصاميم المتاحة في معرض الدعوات."]]
  },
  {
    path: "/صيغ-دعوة-زفاف", title: "صيغ دعوة زفاف", heading: "صيغ دعوة زفاف تقدر تبدأ منها",
    intro: "اختار صيغة مناسبة لأسلوبكم، وعدّل الأسماء والتفاصيل علشان تطلع رسالة دعوة تعبّر عن فرحتكم.",
    sections: [
      ["صيغة رسمية بسيطة", "يتشرف [اسم العائلة] بدعوتكم لمشاركتهم فرحة زفاف [اسم العريس] و[اسم العروس]، وذلك يوم [التاريخ] في [المكان]، ويسعدنا حضوركم."],
      ["صيغة عائلية ودافئة", "فرحتنا تكمل بوجودكم معانا! مستنيينكم تشاركونا يوم فرح [الاسمين] يوم [التاريخ]، الساعة [الميعاد] في [المكان]."],
      ["صيغة قصيرة", "بكل حب، ندعوكم لحضور حفل زفاف [الاسمين] يوم [التاريخ] في [المكان]. في انتظاركم لنحتفل سوا."]
    ],
    faqs: [["أقدر أستخدم صيغة وأغيرها؟", "طبعًا، استخدم الصيغة كنقطة بداية وعدّل الأسماء والموعد والمكان."], ["أكتب إيه في دعوة الزفاف؟", "اكتب أسماء العروسين وموعد ومكان الحفل ورسالة ترحيب مختصرة."]]
  }
]

export function SeoContentPage({ pageKey }: { pageKey: string }) {
  const page = pages.find((item) => item.path === pageKey) ?? pages[0]
  useEffect(() => {
    document.title = page.title + " | دعوتنا"
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", page.intro)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.setAttribute("rel", "canonical")
      document.head.appendChild(canonical)
    }
    canonical.setAttribute("href", window.location.origin + encodeURI(page.path))
  }, [page])

  const filtered = templates.filter((item) => page.path.includes("خطوبة") ? item.category === "خطوبة" : page.path.includes("كتب-كتاب") ? item.category === "كتب كتاب" : item.category === "فرح").slice(0, 3)
  return (
    <main id="main" className="bg-[#fffdfc]">
      <section className="border-b border-[#f0dce1] bg-[#fff5f6] px-4 py-16 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">دعوتنا · دعوات رقمية</p>
        <h1 className="mx-auto mt-3 max-w-4xl font-display text-4xl leading-tight text-[#4a2d33] md:text-6xl">{page.heading}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#806b70]">{page.intro}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/templates" className="btn-gold">اختار تصميمك</Link><Link to="/packages" className="btn-ghost">شوف الباقات</Link></div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {page.sections.map(([heading, body], index) => <article key={heading} className="rounded-[26px] border border-[#f0dce1] bg-white p-6 md:p-7"><span className="font-display text-sm text-[#bd8792]">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-3 text-xl font-extrabold text-[#4a2d33]">{heading}</h2><p className="mt-3 leading-8 text-[#806b70]">{body}</p></article>)}
        </div>
        {filtered.length ? <div className="mt-14"><h2 className="font-display text-3xl text-[#4a2d33]">شوف تصاميم مناسبة</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{filtered.map((item) => <Link key={item.id} to={"/editor/" + item.id} className="rounded-2xl border border-[#f0dce1] bg-white p-4 hover:border-[#d9a3ae]"><p className="font-bold text-[#4a2d33]">{item.name}</p><p className="mt-1 text-sm text-[#806b70]">{item.blurb}</p></Link>)}</div></div> : null}
        <div className="mt-14 rounded-[28px] bg-[#fff5f6] p-6 md:p-8"><h2 className="font-display text-3xl text-[#4a2d33]">أسئلة ممكن تفيدك</h2><div className="mt-5 grid gap-3">{page.faqs.map(([q, a]) => <details key={q} className="rounded-2xl border border-[#f0dce1] bg-white px-5 py-4"><summary className="cursor-pointer font-bold text-[#4a2d33]">{q}</summary><p className="mt-3 leading-7 text-[#806b70]">{a}</p></details>)}</div></div>
        <div className="mt-10 text-center"><h2 className="font-display text-3xl text-[#4a2d33]">جهّز دعوتك دلوقتي</h2><p className="mt-3 leading-7 text-[#806b70]">اختار التصميم، اكتب التفاصيل، وشارك فرحتك مع اللي بتحبهم.</p><Link to="/templates" className="btn-gold mt-5">ابدأ تصميم الدعوة</Link></div>
      </section>
    </main>
  )
}
