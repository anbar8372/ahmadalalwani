# Database Setup Instructions

## تم إنشاء جدول الأخبار

تم إنشاء جدول `news` في قاعدة بيانات Supabase الخاصة بك. هذا الجدول يحتوي على جميع الحقول اللازمة لتخزين أخبار الدكتور أحمد العلواني.

## Current Database Schema

تم إنشاء جدول `news` بالهيكل التالي:

- **Table**: `news`
- **Columns**: id, title, content, date, author, image, imagecaption, category, youtubeurl, content_html, created_at, updated_at
- **Columns Added**: status, views, featured, tags, media, summary
- **Security**: تم تفعيل RLS مع سياسات للقراءة العامة والكتابة للمستخدمين المصادق عليهم

## تم تحديث الكود

تم تحديث كود التطبيق لاستخدام جدول `news` في قاعدة بيانات Supabase. في حالة فشل الاتصال بقاعدة البيانات، سيتم استخدام التخزين المحلي كبديل.

## تحقق من متغيرات البيئة

تأكد من أن ملف `.env` يحتوي على بيانات اتصال Supabase الصحيحة:

```
VITE_SUPABASE_URL=https://fzhprpwkyaatbnwosdab.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## تم إضافة الأعمدة المفقودة

تم إضافة جميع الأعمدة المطلوبة في جدول `news` بما في ذلك:
- status: حالة الخبر (published, draft, archived)
- views: عدد المشاهدات
- featured: مميز
- tags: الوسوم
- media: الوسائط المرفقة
- summary: ملخص الخبر

## ملاحظات إضافية

- التطبيق مصمم للعمل حتى بدون Supabase:
  - إذا كانت قاعدة البيانات غير متاحة، يتم استخدام التخزين المحلي كبديل
  - يتم تحميل بيانات افتراضية تلقائياً للعرض
  - جميع عمليات CRUD تعمل محلياً حتى يتم تكوين Supabase بشكل صحيح
- تم تفعيل المزامنة المباشرة بين الأجهزة المختلفة
- تم تفعيل التحديثات في الوقت الحقيقي باستخدام Supabase Realtime