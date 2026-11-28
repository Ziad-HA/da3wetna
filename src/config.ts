/** بيانات التواصل ووسائل الدفع الخاصة بدعوتي. */
export const site = {
  name: "دعوتي",
  nameEn: "DA3WETY",
  whatsapp: "201276390301",
  email: "zh.nobii@gmail.com",
  vodafoneCash: "01098616961",
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
    discount: "خصم 38%",
    description: "لمناسبة واحدة — دعوة واحدة بالمحرر الكامل، صالحة لمدة 30 يومًا من التفعيل.",
    features: [
      "أكتر من 10 خطوط عربي وإنجليزي",
      "تغيير أي صورة في الدعوة",
      "موسيقى من اختيارك",
      "إخفاء أي قسم مش عايزه",
    ],
    benefits: ["صلاحية الدعوة 30 يومًا من التفعيل", "لينك خاص قابل للمشاركة طوال مدة الصلاحية"],
    paymentNote: "تحويل يدوي — بنفعّلها أول ما نشوف إيصال",
    label: "",
  },
  { id: "basic", name: "الباقة الأساسية", quantity: 4, price: 349, oldPrice: 400, description: "لأكتر من مناسبة أو أكتر من نسخة", features: ["إنشاء 4 دعوات مختلفة", "كل دعوة بلينك وصورة مستقلة"], label: "اختيار مناسب" },
  { id: "plus", name: "الباقة المتقدمة", quantity: 9, price: 499, oldPrice: 585, description: "مرونة أكبر لكل مناسباتك", features: ["إنشاء 9 دعوات مختلفة", "تخصيص كل دعوة بشكل مستقل قبل إرسال الطلب"], label: "الأكثر طلبًا" },
  { id: "premium", name: "الباقة الاحترافية", quantity: 50, price: 849, oldPrice: 990, description: "للعائلات والمناسبات الكتير", features: ["إنشاء 50 دعوات مختلفة", "كل دعوة برابط وصورة خاصة"], label: "أكبر توفير" },
] as const

export function getPackage(id: string | null | undefined) {
  return packages.find((item) => item.id === id) ?? packages[0]
}

export function isWalletMethodAvailable(method: "vodafone" | "instapay") {
  return method === "vodafone"
    ? /^01[0-9]{9}$/.test(site.vodafoneCash) && site.vodafoneCash !== "01000000000"
    : site.instapay.includes("@") && site.instapay !== "da3wetna@instapay"
}

export const walletsArePlaceholders =
  !isWalletMethodAvailable("vodafone") && !isWalletMethodAvailable("instapay")
