/*
  # تحسين نظام المزامنة وإصلاح مشاكل الاتصال

  1. تحسينات الجداول
    - إضافة حقول جديدة لتتبع حالة المزامنة في جدول `news`
    - إنشاء جدول `sync_status` لتخزين معلومات حالة المزامنة
    - إنشاء جدول `connection_logs` لتسجيل أخطاء الاتصال

  2. الأمان
    - تمكين RLS على الجداول الجديدة
    - إضافة سياسات للقراءة العامة والكتابة للمستخدمين المصادق عليهم

  3. الوظائف والمشغلات
    - إنشاء وظائف لتحديث حالة المزامنة
    - إنشاء مشغلات لتسجيل التغييرات
    - إنشاء وظيفة لمزامنة جميع البيانات
*/

-- إنشاء جدول حالة المزامنة
CREATE TABLE IF NOT EXISTS sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول سجلات الاتصال
CREATE TABLE IF NOT EXISTS connection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة حقول جديدة لجدول الأخبار إذا لم تكن موجودة
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sync_version') THEN
    ALTER TABLE news ADD COLUMN sync_version INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'last_synced') THEN
    ALTER TABLE news ADD COLUMN last_synced TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sync_status') THEN
    ALTER TABLE news ADD COLUMN sync_status TEXT DEFAULT 'synced';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sync_error') THEN
    ALTER TABLE news ADD COLUMN sync_error TEXT;
  END IF;
END $$;

-- تمكين RLS على الجداول الجديدة
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_logs ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للجداول الجديدة
CREATE POLICY "Allow public read access to sync_status" ON sync_status
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert sync_status" ON sync_status
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sync_status" ON sync_status
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to connection_logs" ON connection_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert connection_logs" ON connection_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- إنشاء وظيفة لتحديث حالة المزامنة
CREATE OR REPLACE FUNCTION update_sync_status(
  p_device_id TEXT,
  p_status TEXT,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO sync_status (device_id, status, details, updated_at)
  VALUES (p_device_id, p_status, p_details, NOW())
  ON CONFLICT (device_id) DO UPDATE
  SET status = p_status, details = p_details, updated_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء وظيفة لتسجيل أحداث الاتصال
CREATE OR REPLACE FUNCTION log_connection_event(
  p_device_id TEXT,
  p_event_type TEXT,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO connection_logs (device_id, event_type, status, error_message, details)
  VALUES (p_device_id, p_event_type, p_status, p_error_message, p_details)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء وظيفة لمزامنة جميع البيانات
CREATE OR REPLACE FUNCTION sync_all_data() RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_start_time TIMESTAMPTZ;
  v_end_time TIMESTAMPTZ;
  v_news_count INTEGER;
  v_sync_count INTEGER;
BEGIN
  v_start_time := NOW();
  
  -- تحديث حالة المزامنة لجميع الأخبار
  UPDATE news
  SET sync_status = 'synced',
      last_synced = NOW(),
      sync_version = sync_version + 1
  WHERE sync_status = 'modified' OR sync_status IS NULL;
  
  GET DIAGNOSTICS v_news_count = ROW_COUNT;
  
  -- تحديث سجل المزامنة
  INSERT INTO sync_status (device_id, status, details)
  VALUES (
    'server',
    'completed',
    jsonb_build_object(
      'timestamp', extract(epoch from NOW()),
      'items_synced', v_news_count
    )
  );
  
  GET DIAGNOSTICS v_sync_count = ROW_COUNT;
  
  v_end_time := NOW();
  
  -- إعداد نتيجة المزامنة
  v_result := jsonb_build_object(
    'success', true,
    'start_time', v_start_time,
    'end_time', v_end_time,
    'duration_ms', extract(milliseconds from v_end_time - v_start_time),
    'news_synced', v_news_count,
    'sync_records', v_sync_count
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء مشغل لتحديث وقت آخر تحديث
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء مشغل لتحديث وقت آخر تحديث في جدول sync_status
CREATE TRIGGER update_sync_status_updated_at
    BEFORE UPDATE ON sync_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_news_sync_status ON news (sync_status);
CREATE INDEX IF NOT EXISTS idx_news_last_synced ON news (last_synced);
CREATE INDEX IF NOT EXISTS idx_sync_status_device_id ON sync_status (device_id);
CREATE INDEX IF NOT EXISTS idx_connection_logs_device_id ON connection_logs (device_id);
CREATE INDEX IF NOT EXISTS idx_connection_logs_event_type ON connection_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_connection_logs_created_at ON connection_logs (created_at);

-- إضافة قيود فريدة
ALTER TABLE sync_status ADD CONSTRAINT unique_device_id UNIQUE (device_id);

-- إدخال بيانات أولية
INSERT INTO sync_status (device_id, status, details)
VALUES ('server', 'initialized', '{"message": "تم تهيئة نظام المزامنة", "version": "1.0.0"}'::jsonb)
ON CONFLICT (device_id) DO UPDATE
SET status = 'initialized',
    details = '{"message": "تم تحديث نظام المزامنة", "version": "1.0.0"}'::jsonb,
    updated_at = NOW();