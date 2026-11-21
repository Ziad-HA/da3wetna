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
    vars: { paper: "#F3EADF", ink: "#3F2E22", gold: "#8A5A12", soft: "#6B5344", shell: "#E7DCC8" },
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
    vars: { paper: "#F7F4EE", ink: "#2C3330", gold: "#7D6A48", soft: "#5C6560", shell: "#E7E2D8" },
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
    vars: { paper: "#F8EFEA", ink: "#4A2C33", gold: "#8E5E55", soft: "#7A4E58", shell: "#F0DDD6" },
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
    vars: { paper: "#FBF6F1", ink: "#3C242C", gold: "#8C6A3A", soft: "#6E5360", shell: "#5A2036" },
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
    vars: { paper: "#0E1C18", ink: "#F6F0E4", gold: "#E0C48A", soft: "#DDD0BA", shell: "#0E1C18" },
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
    vars: { paper: "#F4F2EF", ink: "#2A2826", gold: "#8C7344", soft: "#5C564F", shell: "#E6E1DA" },
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
    vars: { paper: "#E7F0E6", ink: "#1C3328", gold: "#5E6B38", soft: "#3E5648", shell: "#D5E4D4" },
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
    vars: { paper: "#0C1428", ink: "#F4EFE4", gold: "#E4C98A", soft: "#D5D8EA", shell: "#0C1428" },
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
    vars: { paper: "#F8E6E2", ink: "#5A2434", gold: "#8C4A42", soft: "#7A4452", shell: "#F3D5CF" },
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
    vars: { paper: "#F6F3EE", ink: "#161513", gold: "#8A6A32", soft: "#4A453F", shell: "#E8E2D8" },
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
