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

## سياسة الرفع (مرحلة التطوير فقط)

لو هتختبر الرفع قبل تفعيل حسابات العملاء، أنشئ سياسة INSERT مؤقتة في SQL Editor:

```sql
create policy "temporary invitation media uploads"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] in ('image', 'audio')
);
```

اضبط من إعدادات الـ bucket حدًا أقصى لحجم الملف، واقصر أنواع الملفات على الصور والصوت فقط. هذه السياسة تسمح لأي زائر مجهول برفع ملفات، لذلك هي للاختبار المحدود فقط وليست إعدادًا مناسبًا للإطلاق التجاري العام. قبل استقبال عملاء حقيقيين، اربط الرفع بحساب مسجل أو بوظيفة خادمية تتحقق من الطلب وتحد من عدد الملفات.
