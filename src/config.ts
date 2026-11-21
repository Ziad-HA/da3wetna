/** غيّر بيانات التحويل دي قبل نشر الموقع. */
export const site = {
  name: "دعوتنا",
  nameEn: "DA3WETNA",
  whatsapp: "201000000000",
  vodafoneCash: "01000000000",
  instapay: "da3wetna@instapay",
}

export type PackageId = "single" | "basic" | "plus" | "premium"

export const packages = [
  {
    id: "single",
    name: "باقة الدعوة الواحدة",
    quantity: 1,
    price: 250,
    oldPrice: 400,
    discount: "خصم 37%",
    description: "لمناسبة واحدة — دعوة واحدة بالمحرر الكامل، تفضل معاك مدى الحياة.",
    features: [
      "أكتر من 10 خطوط عربي وإنجليزي",
      "تغيير أي صورة في الدعوة",
      "موسيقى من اختيارك",
      "إخفاء أي قسم مش عايزه",
    ],
    benefits: ["معاك مدى الحياة", "تعديل 30 يوم من التفعيل"],
    paymentNote: "تحويل يدوي — بنفعّلها أول ما نشوف إيصال",
    label: "",
  },
  { id: "basic", name: "الباقة الأساسية", quantity: 4, price: 349, oldPrice: 400, description: "لأكتر من مناسبة أو أكتر من نسخة", features: ["إنشاء 4 دعوات مختلفة", "كل دعوة بلينك وصورة مستقلة"], label: "اختيار مناسب" },
  { id: "plus", name: "الباقة المتقدمة", quantity: 9, price: 499, oldPrice: 585, description: "مرونة أكبر لكل مناسباتك", features: ["إنشاء 9 دعوات مختلفة", "تعديل كل دعوة بشكل مستقل"], label: "الأكثر طلبًا" },
  { id: "premium", name: "الباقة الاحترافية", quantity: 50, price: 849, oldPrice: 990, description: "للعائلات والمناسبات الكتير", features: ["إنشاء 50 دعوات مختلفة", "كل دعوة برابط وصورة خاصة"], label: "أكبر توفير" },
] as const

export function getPackage(id: string | null | undefined) {
  return packages.find((item) => item.id === id) ?? packages[0]
}

export const walletsArePlaceholders =
  site.vodafoneCash === "01000000000" || site.instapay === "da3wetna@instapay"
