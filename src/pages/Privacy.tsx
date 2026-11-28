import { useEffect } from "react"

export function Privacy() {
  useEffect(() => {
    document.title = "سياسة الخصوصية | دعوتي"
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", "تعرف على سياسة الخصوصية في دعوتي وكيفية التعامل مع البيانات التي تدخلها أثناء استخدام الموقع.")
  }, [])
  return (
    <main id="main" className="min-h-[70vh] bg-[#fffdfc]">
      <section className="bg-[#fff5f6] px-4 py-16 text-center">
        <p className="text-sm font-bold text-[#b83b50]">دعوتي</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">سياسة الخصوصية</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">بنحترم خصوصيتك، وهدف الصفحة دي توضيح طريقة التعامل مع المعلومات أثناء استخدام الموقع.</p>
      </section>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 leading-8 text-[#665258]">
        <section><h2 className="text-xl font-extrabold text-[#4a2d33]">المعلومات اللي بتدخلها</h2><p className="mt-3">قد تدخل بيانات لازمة لتجهيز الدعوة، زي أسماء أصحاب المناسبة والتاريخ والميعاد والمكان والنصوص اللي تختار إضافتها. تجنب كتابة أي معلومات شخصية مش ضرورية لعرض الدعوة.</p></section>
        <section><h2 className="text-xl font-extrabold text-[#4a2d33]">استخدام البيانات</h2><p className="mt-3">تُستخدم التفاصيل اللي تدخلها لتكوين معاينة الدعوة وتجهيز المحتوى اللي اخترته. لا تضع بيانات حساسة أو معلومات تخص أشخاص آخرين بدون موافقتهم.</p></section>
        <section><h2 className="text-xl font-extrabold text-[#4a2d33]">المدفوعات</h2><p className="mt-3">عند اختيار وسيلة دفع، اتبع التعليمات المعروضة في صفحة إتمام الطلب. لا ترسل كلمات مرور أو أرقام سرية أو بيانات بطاقات كاملة في رسائل التواصل أو داخل تفاصيل الدعوة.</p></section>
        <section><h2 className="text-xl font-extrabold text-[#4a2d33]">مشاركة الدعوة</h2><p className="mt-3">لو شاركت رابط الدعوة أو صورتها، يقدر الأشخاص اللي وصلهم المحتوى يشوفوا التفاصيل الظاهرة فيه. راجع البيانات قبل المشاركة وتأكد إنها مناسبة للنشر مع المدعوين.</p></section>
        <section><h2 className="text-xl font-extrabold text-[#4a2d33]">التحديثات والتواصل</h2><p className="mt-3">قد يتم تحديث سياسة الخصوصية عند إضافة وظائف جديدة للموقع. لو عندك سؤال عن الخصوصية أو استخدام الموقع، استخدم وسيلة التواصل الموضحة في الموقع.</p></section>
        <p className="border-t border-[#f0dce1] pt-5 text-sm text-[#9a8187]">آخر تحديث: نوفمبر 2026</p>
      </article>
    </main>
  )
}
