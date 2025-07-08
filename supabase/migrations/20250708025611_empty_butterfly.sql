/*
  # إنشاء جدول أخبار الدكتور أحمد العلواني

  1. جداول جديدة
    - `dr_ahmed_news`
      - `id` (uuid, مفتاح رئيسي)
      - `title` (نص، مطلوب)
      - `content` (نص، مطلوب)
      - `content_html` (نص، اختياري)
      - `summary` (نص، اختياري)
      - `date` (تاريخ، مطلوب)
      - `author` (نص، مطلوب)
      - `image` (نص، اختياري)
      - `imagecaption` (نص، اختياري)
      - `category` (نص، اختياري)
      - `youtubeurl` (نص، اختياري)
      - `media` (json، اختياري)
      - `status` (نص، مطلوب)
      - `views` (عدد صحيح، افتراضي 0)
      - `featured` (منطقي، افتراضي false)
      - `tags` (مصفوفة نصية، اختياري)
      - `created_at` (طابع زمني)
      - `updated_at` (طابع زمني)

  2. الأمان
    - تفعيل RLS على جدول `dr_ahmed_news`
    - إضافة سياسات للقراءة العامة
    - إضافة سياسات للمستخدمين المصادق عليهم لإدارة الأخبار

  3. التخزين
    - إنشاء مجلد `dr-ahmed-news-media` لتخزين الوسائط
    - إعداد سياسات لرفع وعرض وحذف الوسائط
*/

-- إنشاء جدول أخبار الدكتور أحمد العلواني
CREATE TABLE IF NOT EXISTS dr_ahmed_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_html TEXT,
  summary TEXT,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  imagecaption TEXT,
  category TEXT,
  youtubeurl TEXT,
  media JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل نظام أمان الصفوف
ALTER TABLE dr_ahmed_news ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للجدول
CREATE POLICY "Allow public read access" ON dr_ahmed_news
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON dr_ahmed_news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON dr_ahmed_news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON dr_ahmed_news
  FOR DELETE USING (auth.role() = 'authenticated');

-- إنشاء مجلد تخزين للوسائط
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dr-ahmed-news-media', 'dr-ahmed-news-media', true)
ON CONFLICT (id) DO NOTHING;

-- إنشاء سياسات التخزين
CREATE POLICY "Allow authenticated users to upload dr ahmed media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dr-ahmed-news-media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to dr ahmed media" ON storage.objects
  FOR SELECT USING (bucket_id = 'dr-ahmed-news-media');

CREATE POLICY "Allow authenticated users to delete dr ahmed media" ON storage.objects
  FOR DELETE USING (bucket_id = 'dr-ahmed-news-media' AND auth.role() = 'authenticated');

-- إنشاء دالة لتحديث طابع الوقت
CREATE OR REPLACE FUNCTION update_dr_ahmed_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء محفز لتحديث طابع الوقت تلقائياً
CREATE TRIGGER update_dr_ahmed_news_updated_at 
    BEFORE UPDATE ON dr_ahmed_news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_dr_ahmed_news_updated_at();

-- إنشاء دالة لزيادة عدد المشاهدات
CREATE OR REPLACE FUNCTION increment_dr_ahmed_news_views(news_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE dr_ahmed_news
  SET views = views + 1
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء فهرس لتحسين أداء البحث
CREATE INDEX IF NOT EXISTS dr_ahmed_news_title_idx ON dr_ahmed_news USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS dr_ahmed_news_content_idx ON dr_ahmed_news USING gin(to_tsvector('arabic', content));
CREATE INDEX IF NOT EXISTS dr_ahmed_news_category_idx ON dr_ahmed_news(category);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_date_idx ON dr_ahmed_news(date);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_status_idx ON dr_ahmed_news(status);
CREATE INDEX IF NOT EXISTS dr_ahmed_news_featured_idx ON dr_ahmed_news(featured);