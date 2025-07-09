/*
  # إنشاء جدول الأخبار

  1. الجداول الجديدة
    - `news`
      - `id` (uuid, المفتاح الرئيسي)
      - `title` (text, العنوان)
      - `content` (text, المحتوى)
      - `content_html` (text, محتوى HTML)
      - `summary` (text, الملخص)
      - `date` (date, التاريخ)
      - `author` (text, الكاتب)
      - `image` (text, رابط الصورة)
      - `imagecaption` (text, وصف الصورة)
      - `category` (text, التصنيف)
      - `youtubeurl` (text, رابط يوتيوب)
      - `status` (text, الحالة)
      - `views` (integer, عدد المشاهدات)
      - `featured` (boolean, مميز)
      - `tags` (text[], الوسوم)
      - `media` (jsonb, الوسائط)
      - `created_at` (timestamp with time zone, تاريخ الإنشاء)
      - `updated_at` (timestamp with time zone, تاريخ التحديث)
  2. الأمان
    - تفعيل RLS على جدول `news`
    - إضافة سياسات للقراءة العامة والكتابة للمستخدمين المصادق عليهم
*/

-- إنشاء جدول الأخبار
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  content_html text,
  summary text,
  date date NOT NULL,
  author text NOT NULL,
  image text,
  imagecaption text,
  category text,
  youtubeurl text,
  status text DEFAULT 'published',
  views integer DEFAULT 0,
  featured boolean DEFAULT false,
  tags text[],
  media jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء دالة لتحديث وقت التعديل
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفز لتحديث وقت التعديل
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS على جدول الأخبار
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
-- سياسة القراءة العامة
CREATE POLICY "Allow public read access"
ON news
FOR SELECT
TO public
USING (true);

-- سياسة الإدخال للمستخدمين المصادق عليهم
CREATE POLICY "Allow authenticated users to insert"
ON news
FOR INSERT
TO public
WITH CHECK (role() = 'authenticated');

-- سياسة التحديث للمستخدمين المصادق عليهم
CREATE POLICY "Allow authenticated users to update"
ON news
FOR UPDATE
TO public
USING (role() = 'authenticated')
WITH CHECK (role() = 'authenticated');

-- سياسة الحذف للمستخدمين المصادق عليهم
CREATE POLICY "Allow authenticated users to delete"
ON news
FOR DELETE
TO public
USING (role() = 'authenticated');