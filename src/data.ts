import type { InviteDraft, Template, TemplateId } from "./types"

export const templates: Template[] = [
  {
    id: "seal",
    name: "خاتم الذهب",
    blurb: "ورقة عاجية وختم ذهبي في القلب",
    category: "فرح",
    isNew: true,
    frame: "paper",
    ornament: "seal",
    groom: "يوسف",
    bride: "مريم",
    venue: "قاعة النيل",
    time: "19:30",
    vars: { paper: "#FFF8F6", ink: "#5B303C", gold: "#C6A15B", soft: "#936B78", shell: "#F6DDE5" },
  },
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
  },
  {
    id: "lace",
    name: "دانتيل اللؤلؤ",
    blurb: "وردي باهت وإطار لؤلؤ",
    category: "فرح",
    frame: "paper",
    ornament: "lace",
    groom: "كريم",
    bride: "نادين",
    venue: "قصر البارون",
    time: "20:00",
    vars: { paper: "#F8E9ED", ink: "#572B39", gold: "#C6A15B", soft: "#8D5C6B", shell: "#E9B9C8" },
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
  },
  {
    id: "night",
    name: "ليل الزفاف",
    blurb: "أخضر ليلي وخط ذهبي",
    category: "فرح",
    frame: "paper",
    ornament: "stars",
    groom: "سيف",
    bride: "جنى",
    venue: "سطح الزمالك",
    time: "21:00",
    vars: { paper: "#421E2B", ink: "#FFF8F6", gold: "#E2C58B", soft: "#F0D9DF", shell: "#421E2B" },
  },
  {
    id: "marble",
    name: "رخام أبيض",
    blurb: "رخام هادي وخط رفيع",
    category: "كتب كتاب",
    frame: "paper",
    ornament: "marble",
    groom: "علي",
    bride: "سلمى",
    venue: "دار الكتب",
    time: "17:00",
    vars: { paper: "#FFFCFA", ink: "#603C45", gold: "#C6A15B", soft: "#92737A", shell: "#F3E7E9" },
  },
  {
    id: "garden",
    name: "حديقة المريمية",
    blurb: "أخضر حديقة وأغصان على الجنبين",
    category: "خطوبة",
    frame: "paper",
    ornament: "garden",
    groom: "حمزة",
    bride: "رهف",
    venue: "مزرعة الياسمين",
    time: "16:30",
    vars: { paper: "#F9EDEB", ink: "#633C43", gold: "#B83B50", soft: "#9A6F75", shell: "#E9B9C8" },
  },
  {
    id: "moon",
    name: "سماء العرس",
    blurb: "كحلي وهلال ذهبي",
    category: "فرح",
    isNew: true,
    frame: "paper",
    ornament: "moon",
    groom: "ياسر",
    bride: "ملك",
    venue: "كورنيش النيل",
    time: "20:30",
    vars: { paper: "#4A2032", ink: "#FFF7F5", gold: "#E4C98A", soft: "#EFDCE3", shell: "#4A2032" },
  },
  {
    id: "silk",
    name: "حرير الورد",
    blurb: "تدرج وردي دافي لحنة أو فرح",
    category: "حنة",
    frame: "paper",
    ornament: "silk",
    groom: "تامر",
    bride: "دينا",
    venue: "بيت العيلة",
    time: "18:30",
    vars: { paper: "#F8E6E8", ink: "#6A2D3C", gold: "#B83B50", soft: "#905C69", shell: "#F3D5DC" },
  },
  {
    id: "ink",
    name: "الحبر الأسود",
    blurb: "دعوة تحريرية بخط كبير ومساحة فاضية",
    category: "فرح",
    frame: "poster",
    ornament: "rules",
    groom: "كريم",
    bride: "فرح",
    venue: "جاليري تاون هاوس",
    time: "19:00",
    vars: { paper: "#FFFCFA", ink: "#3D3034", gold: "#C6A15B", soft: "#78666C", shell: "#F1E5E7" },
  },
]

export function getTemplate(id: string | undefined): Template | undefined {
  return templates.find((item) => item.id === id)
}

export function draftFor(template: Template): InviteDraft {
  return {
    templateId: template.id,
    groom: template.groom,
    bride: template.bride,
    occasion: template.category,
    hosts: "يتشرف الأهل بدعوتكم",
    message: "ونكون سعداء بوجودكم في يومنا",
    date: "2026-12-18",
    time: template.time,
    venue: template.venue,
    city: "القاهرة",
    opening: "بسم الله الرحمن الرحيم",
    rsvpPhone: "",
    musicUrl: "",
    photoOne: "",
    photoTwo: "",
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
    a: "فودافون كاش، أو إنستاباي، أو بطاقة. بعد التأكيد بتستلم التحميل واللينك على طول.",
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
