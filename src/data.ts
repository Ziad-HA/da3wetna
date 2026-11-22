import type { InviteDraft, Template, TemplateId } from "./types"

export const templates: Template[] = [
  {
    id: "calla",
    name: "زهور الكالا",
    blurb: "عاجي هادي وخطوط زهور ناعمة",
    category: "فرح",
    isNew: true,
    frame: "paper",
    ornament: "calla",
    groom: "آدم",
    bride: "ليلى",
    venue: "حديقة الأوركيد",
    time: "18:00",
    vars: { paper: "#FFFCFA", ink: "#633C47", gold: "#B83B50", soft: "#9A7680", shell: "#F4E3E8" },
    envelope: { body: ["#FBEFF1", "#EBCBD3"], flap: ["#FFF7F8", "#EFD3DA"], liner: "#F9DFE5", linerPattern: "diamonds", seal: "#B83B50", sealKind: "flower", flapShape: "round" },
  },
  {
    id: "envelope",
    name: "ظرف الورد",
    blurb: "ظرف عنابي وبطاقة كريمي",
    category: "خطوبة",
    frame: "envelope",
    ornament: "seal",
    groom: "عمر",
    bride: "هالة",
    venue: "فندق الماريوت",
    time: "19:00",
    vars: { paper: "#FFF8F6", ink: "#5B2637", gold: "#C6A15B", soft: "#865563", shell: "#B83B50" },
    envelope: { body: ["#C45B70", "#873347"], flap: ["#D77C8D", "#A33D55"], liner: "#FFF0EC", linerPattern: "diamonds", seal: "#E5A0A8", sealKind: "heart", flapShape: "v" },
  },
  {
    id: "estate-rose",
    name: "قصر الورد",
    blurb: "نفس تجربة قصر الدير بظرف وردي وتفاصيل ناعمة",
    category: "فرح",
    isNew: true,
    layout: "site",
    frame: "arch",
    ornament: "sprig",
    groom: "أحمد",
    bride: "ليلى",
    venue: "قاعة الياسمين",
    time: "19:00",
    vars: { paper: "#FFF8F6", ink: "#673744", gold: "#B98A61", soft: "#9A7480", shell: "#F2E4E6" },
    envelope: { body: ["#B76C7E", "#8D3D52"], flap: ["#CA8795", "#9E4E63"], liner: "#FFF8F2", linerPattern: "plain", seal: "#762B3D", sealKind: "flower", flapShape: "deep" },
  },
  {
    id: "estate",
    name: "قصر الدير",
    blurb: "دعوة زفاف فخمة بظرف متحرك وصفحة تفاصيل كاملة بالعربي",
    category: "فرح",
    isNew: true,
    layout: "site",
    frame: "arch",
    ornament: "sprig",
    groom: "محمد",
    bride: "سلمى",
    venue: "قاعة النيل",
    time: "19:00",
    vars: { paper: "#FAF6EE", ink: "#5E1C2A", gold: "#8B6B3A", soft: "#7A6A55", shell: "#4F5629" },
    envelope: { body: ["#6F7640", "#4F5629"], flap: ["#7A8248", "#59602F"], liner: "#FAF6EE", linerPattern: "plain", seal: "#7A1F2D", sealKind: "initials", flapShape: "deep", zoom: true },
  },
]

// القوالب الموجودة في الموقع حاليًا فقط.
export const activeTemplates = templates

export function getTemplate(id: string | undefined): Template | undefined {
  return templates.find((item) => item.id === id)
}

export const siteDefaults = {
  program: "٥:٣٠ مساءً | استقبال الضيوف\n٦:٣٠ مساءً | دخول العروسين\n٧:٠٠ مساءً | العشاء\n٩:٠٠ مساءً | تقطيع التورتة والاحتفال",
  story: "بداية حكايتنا كانت صدفة جميلة، ومع الأيام بقت أجمل حكاية في حياتنا.\n\nوالنهارده بنبدأ فصل جديد، ونتمنى تكونوا معانا وتشاركونا فرحتنا.",
  faq: "",
  dressCode: "يسعدنا حضوركم بأجمل إطلالة تليق بليلتنا.",
}

export const defaultProgram = "17:00 | استقبال الضيوف\n18:00 | دخول العروسين\n19:00 | حفل العشاء\n21:00 | قص التورتة والتصوير"

export function draftFor(template: Template): InviteDraft {
  const isSite = template.layout === "site"
  return {
    templateId: template.id,
    groom: template.groom,
    bride: template.bride,
    occasion: template.category,
    hosts: "يتشرف الأهل بدعوتكم لحضور حفل زفاف",
    message: "وجودكم معانا يكمل فرحتنا، ومستنيينكم تشاركونا أجمل يوم في حياتنا.",
    date: isSite ? "2027-10-02" : "2026-12-18",
    time: template.time,
    venue: template.venue,
    city: "القاهرة",
    opening: "بسم الله الرحمن الرحيم",
    rsvpPhone: "",
    mapUrl: "",
    musicUrl: "",
    photoOne: "",
    photoTwo: "",
    program: template.layout === "strip" ? defaultProgram : isSite ? siteDefaults.program : "",
    gallery: "",
    story: isSite ? siteDefaults.story : "",
    faq: isSite ? siteDefaults.faq : "",
    dressCode: isSite ? siteDefaults.dressCode : "",
  }
}

export function isTemplateId(id: string): id is TemplateId {
  return templates.some((item) => item.id === id)
}

export const occasions = ["فرح", "خطوبة", "كتب كتاب", "حنة", "عقد قران"] as const

export const faqs = [
  {
    q: "يعني إيه دعوة رقمية؟",
    a: "تصميم جاهز بتعدّل عليه الأسماء والتاريخ والمكان، وبعدين تنزّله صورة ستوري أو تبعت لينك يفتح الدعوة عند الضيف.",
  },
  {
    q: "محتاج أستنى حد يعدّل لي؟",
    a: "لا. أنت بتكتب كل التفاصيل بنفسك، وتشوفها بتتغير قدامك قبل الدفع.",
  },
  {
    q: "هدفع إزاي؟",
    a: "فودافون كاش أو إنستاباي. بعد التحويل ابعت صورة الإيصال على واتساب، والتفعيل بيتم بعد مراجعة الدفع يدويًا.",
  },
  {
    q: "أقدر أبعت الدعوة لأكتر من حد؟",
    a: "أيوه. اللينك واحد، واتبعتُه على واتساب لأي عدد من الضيوف. كل واحد يفتح نفس الدعوة.",
  },
  {
    q: "لو الاسم اتكتب غلط؟",
    a: "قبل الدفع تعدّل براحتك. بعد الدفع اللينك بيتحفظ بالنص اللي دفعته. لو عايز تغيير، اعمل دعوة جديدة.",
  },
  {
    q: "الصورة تنفع ستوري واتساب؟",
    a: "أيوه. التحميل صورة طويلة بمقاس الستوري، تقدر تنزلها وتنشرها من غير قص زيادة.",
  },
]
