# إعداد رفع الصور والموسيقى في دعوتنا

1. افتح مشروع Supabase الخاص بالموقع.
2. من Storage أنشئ Bucket باسم `invitation-media` واجعله **Public**.
3. أضف سياسة Storage تسمح للمستخدمين المجهولين برفع الملفات إلى هذا الـ bucket (INSERT) وقراءة الملفات (SELECT). لا تضع service-role key في الموقع.
4. في Vercel > Project Settings > Environment Variables أضف:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = Publishable/anon key
5. أعد نشر الموقع.

الرفع يستخدم المفتاح العام فقط. لا تضع `service_role` أو أي سر إداري داخل متغيرات تبدأ بـ `VITE_`.
الحدود في واجهة الموقع: الصور 8MB والصوت 12MB. روابط الملفات العامة تُحفظ داخل بيانات الدعوة، لذلك يقدر الضيوف يشوفوها بعد مشاركة الرابط.
