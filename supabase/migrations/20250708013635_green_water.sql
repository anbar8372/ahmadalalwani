/*
  # إصلاح مشكلة الاتصال وتحسين المزامنة

  1. تحسينات الجداول
    - إضافة حقول جديدة لتتبع حالة المزامنة
    - تحسين هيكل جدول sync_settings
    - إضافة جدول connection_diagnostics لتسجيل معلومات تشخيصية

  2. الأمان
    - تحسين سياسات RLS للجداول
    - إضافة سياسات للوصول العام للقراءة
    - إضافة سياسات للمستخدمين المصادق عليهم للكتابة

  3. وظائف قاعدة البيانات
    - تحسين وظيفة تشخيص الاتصال
    - إضافة وظيفة لإصلاح مشاكل المزامنة
    - تحسين وظيفة مزامنة البيانات
*/

-- إنشاء جدول تشخيصات الاتصال
CREATE TABLE IF NOT EXISTS connection_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_message TEXT,
  browser_info TEXT,
  network_info JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_details TEXT
);

-- تحسين جدول إعدادات المزامنة
CREATE TABLE IF NOT EXISTS sync_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- إضافة حقول جديدة لجدول الأخبار إذا لم تكن موجودة
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sync_hash') THEN
    ALTER TABLE news ADD COLUMN sync_hash TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'client_modified') THEN
    ALTER TABLE news ADD COLUMN client_modified BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sync_retries') THEN
    ALTER TABLE news ADD COLUMN sync_retries INTEGER DEFAULT 0;
  END IF;
END $$;

-- تمكين RLS على الجداول الجديدة
ALTER TABLE connection_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_settings ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للجداول الجديدة
CREATE POLICY "Allow public read access to connection_diagnostics" ON connection_diagnostics
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert connection_diagnostics" ON connection_diagnostics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update connection_diagnostics" ON connection_diagnostics
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to sync_settings" ON sync_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert sync_settings" ON sync_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sync_settings" ON sync_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- وظيفة لتشخيص مشاكل الاتصال
CREATE OR REPLACE FUNCTION diagnose_connection_issue(
  p_device_id TEXT,
  p_error_message TEXT,
  p_browser_info TEXT,
  p_network_info JSONB
) RETURNS JSONB AS $$
DECLARE
  v_error_type TEXT;
  v_diagnostic_id UUID;
  v_result JSONB;
BEGIN
  -- تحديد نوع الخطأ
  IF p_error_message LIKE '%timeout%' OR p_error_message LIKE '%مهلة%' THEN
    v_error_type := 'timeout';
  ELSIF p_error_message LIKE '%network%' OR p_error_message LIKE '%شبكة%' OR p_error_message LIKE '%اتصال%' THEN
    v_error_type := 'network';
  ELSIF p_error_message LIKE '%auth%' OR p_error_message LIKE '%مصادقة%' THEN
    v_error_type := 'auth';
  ELSIF p_error_message LIKE '%database%' OR p_error_message LIKE '%قاعدة بيانات%' THEN
    v_error_type := 'database';
  ELSIF p_error_message LIKE '%desconocido%' OR p_error_message LIKE '%غير معروف%' THEN
    v_error_type := 'unknown';
  ELSE
    v_error_type := 'server';
  END IF;
  
  -- تسجيل التشخيص
  INSERT INTO connection_diagnostics (
    device_id,
    error_type,
    error_message,
    browser_info,
    network_info
  ) VALUES (
    p_device_id,
    v_error_type,
    p_error_message,
    p_browser_info,
    p_network_info
  ) RETURNING id INTO v_diagnostic_id;
  
  -- إعداد نتيجة التشخيص
  v_result := jsonb_build_object(
    'diagnostic_id', v_diagnostic_id,
    'error_type', v_error_type,
    'timestamp', extract(epoch from NOW()),
    'recommendations', CASE
      WHEN v_error_type = 'network' THEN jsonb_build_array(
        'تحقق من اتصالك بالإنترنت',
        'تأكد من أن جهازك متصل بشبكة مستقرة',
        'جرب الاتصال بشبكة مختلفة'
      )
      WHEN v_error_type = 'timeout' THEN jsonb_build_array(
        'قد تكون الشبكة بطيئة، حاول مرة أخرى',
        'قد يكون الخادم مشغولاً، انتظر قليلاً ثم حاول مرة أخرى',
        'تحقق من سرعة اتصالك بالإنترنت'
      )
      WHEN v_error_type = 'auth' THEN jsonb_build_array(
        'قد تكون جلستك قد انتهت، حاول تسجيل الخروج وإعادة تسجيل الدخول',
        'تحقق من صحة مفاتيح API',
        'تأكد من أن لديك الصلاحيات المناسبة'
      )
      WHEN v_error_type = 'database' THEN jsonb_build_array(
        'تحقق من تطبيق ملفات الترحيل',
        'تأكد من وجود الجداول المطلوبة',
        'اتصل بمسؤول قاعدة البيانات'
      )
      WHEN v_error_type = 'server' THEN jsonb_build_array(
        'قد يكون الخادم غير متاح مؤقتاً، حاول مرة أخرى لاحقاً',
        'تحقق من حالة خدمة Supabase',
        'تأكد من صحة عنوان URL للخادم'
      )
      ELSE jsonb_build_array(
        'حاول تحديث الصفحة',
        'امسح ذاكرة التخزين المؤقت للمتصفح',
        'حاول استخدام متصفح مختلف',
        'اتصل بمسؤول النظام'
      )
    END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة لإصلاح مشاكل المزامنة
CREATE OR REPLACE FUNCTION fix_sync_issues(
  p_device_id TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_fixed_count INTEGER := 0;
  v_result JSONB;
BEGIN
  -- إعادة تعيين حالة المزامنة للعناصر التي تواجه مشاكل
  UPDATE news
  SET sync_status = 'synced',
      sync_error = NULL,
      sync_retries = 0,
      last_synced = NOW()
  WHERE (sync_status = 'error' OR sync_retries > 3)
    AND (p_device_id IS NULL OR sync_error LIKE '%' || p_device_id || '%');
  
  GET DIAGNOSTICS v_fixed_count = ROW_COUNT;
  
  -- تسجيل الإصلاح
  INSERT INTO connection_diagnostics (
    device_id,
    error_type,
    error_message,
    resolved,
    resolution_details
  ) VALUES (
    COALESCE(p_device_id, 'server'),
    'sync_fix',
    'إصلاح تلقائي لمشاكل المزامنة',
    TRUE,
    'تم إصلاح ' || v_fixed_count || ' عنصر'
  );
  
  -- إعداد نتيجة الإصلاح
  v_result := jsonb_build_object(
    'success', TRUE,
    'fixed_count', v_fixed_count,
    'timestamp', extract(epoch from NOW()),
    'device_id', COALESCE(p_device_id, 'server')
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة محسنة لمزامنة البيانات
CREATE OR REPLACE FUNCTION sync_data(
  p_device_id TEXT,
  p_last_sync TIMESTAMPTZ DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_last_sync TIMESTAMPTZ;
  v_result JSONB;
  v_sync_count INTEGER := 0;
BEGIN
  -- تحديد وقت آخر مزامنة
  IF p_last_sync IS NULL THEN
    SELECT last_synced INTO v_last_sync
    FROM sync_status
    WHERE device_id = p_device_id
    ORDER BY last_synced DESC
    LIMIT 1;
    
    IF v_last_sync IS NULL THEN
      v_last_sync := NOW() - INTERVAL '30 days';
    END IF;
  ELSE
    v_last_sync := p_last_sync;
  END IF;
  
  -- تحديث حالة المزامنة
  INSERT INTO sync_status (device_id, status, details)
  VALUES (
    p_device_id,
    'syncing',
    jsonb_build_object(
      'timestamp', extract(epoch from NOW()),
      'last_sync', v_last_sync
    )
  )
  ON CONFLICT (device_id) DO UPDATE
  SET status = 'syncing',
      details = jsonb_build_object(
        'timestamp', extract(epoch from NOW()),
        'last_sync', v_last_sync
      ),
      updated_at = NOW();
  
  -- الحصول على البيانات المحدثة منذ آخر مزامنة
  v_result := jsonb_build_object(
    'news', (
      SELECT jsonb_agg(to_jsonb(n))
      FROM news n
      WHERE n.updated_at > v_last_sync
    ),
    'sync_settings', (
      SELECT jsonb_agg(to_jsonb(s))
      FROM sync_settings s
      WHERE s.last_updated > v_last_sync
    )
  );
  
  -- تحديث حالة المزامنة
  UPDATE sync_status
  SET status = 'completed',
      last_synced = NOW(),
      details = jsonb_build_object(
        'timestamp', extract(epoch from NOW()),
        'items_count', jsonb_array_length(COALESCE(v_result->'news', '[]'::jsonb)) + 
                       jsonb_array_length(COALESCE(v_result->'sync_settings', '[]'::jsonb))
      )
  WHERE device_id = p_device_id;
  
  -- إضافة معلومات المزامنة إلى النتيجة
  v_result := v_result || jsonb_build_object(
    'sync_info', jsonb_build_object(
      'device_id', p_device_id,
      'last_sync', v_last_sync,
      'current_sync', NOW(),
      'status', 'completed'
    )
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء فهارس إضافية لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_connection_diagnostics_device_id ON connection_diagnostics (device_id);
CREATE INDEX IF NOT EXISTS idx_connection_diagnostics_error_type ON connection_diagnostics (error_type);
CREATE INDEX IF NOT EXISTS idx_connection_diagnostics_timestamp ON connection_diagnostics (timestamp);
CREATE INDEX IF NOT EXISTS idx_connection_diagnostics_resolved ON connection_diagnostics (resolved);

-- إدخال بيانات أولية
INSERT INTO sync_settings (key, value, updated_by)
VALUES 
('connection_config', jsonb_build_object(
  'timeout', 30000,
  'retry_attempts', 3,
  'retry_delay', 5000,
  'auto_reconnect', true
), 'system'),
('error_messages', jsonb_build_object(
  'network', 'خطأ في الاتصال بالشبكة',
  'timeout', 'انتهت مهلة الاتصال',
  'auth', 'خطأ في المصادقة',
  'database', 'خطأ في قاعدة البيانات',
  'server', 'خطأ في الخادم',
  'unknown', 'خطأ غير معروف'
), 'system')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by;

-- تحديث حالة المزامنة للأخبار الحالية
UPDATE news
SET sync_hash = encode(digest(id || title || content || date || author, 'sha256'), 'hex'),
    sync_status = 'synced',
    last_synced = NOW()
WHERE sync_hash IS NULL;

-- إنشاء وظيفة لتحديث sync_hash عند تغيير البيانات
CREATE OR REPLACE FUNCTION update_news_sync_hash()
RETURNS TRIGGER AS $$
BEGIN
    NEW.sync_hash = encode(digest(NEW.id || NEW.title || NEW.content || NEW.date || NEW.author, 'sha256'), 'hex');
    NEW.client_modified = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء مشغل لتحديث sync_hash
CREATE TRIGGER update_news_sync_hash_trigger
    BEFORE INSERT OR UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_news_sync_hash();