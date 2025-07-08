/*
  # Configuración de sincronización en tiempo real

  1. Nuevas Tablas
    - `sync_settings` - Almacena configuraciones globales del sitio
      - `id` (uuid, clave primaria)
      - `key` (texto, requerido, único)
      - `value` (jsonb, requerido)
      - `last_updated` (timestamp)
      - `updated_by` (texto)
    
    - `sync_logs` - Registra cambios para auditoría y resolución de conflictos
      - `id` (uuid, clave primaria)
      - `entity_type` (texto, requerido)
      - `entity_id` (texto, requerido)
      - `operation` (texto, requerido)
      - `old_value` (jsonb)
      - `new_value` (jsonb)
      - `created_at` (timestamp)
      - `created_by` (texto)
      - `client_info` (jsonb)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Agregar políticas para acceso público y autenticado
    - Configurar permisos para sincronización

  3. Funciones y Disparadores
    - Función para actualizar timestamp automáticamente
    - Función para registrar cambios en el log
    - Disparadores para sincronización en tiempo real
*/

-- Crear tabla de configuraciones de sincronización
CREATE TABLE IF NOT EXISTS sync_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Crear tabla de logs de sincronización
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  client_info JSONB
);

-- Habilitar Row Level Security
ALTER TABLE sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Crear políticas para sync_settings
CREATE POLICY "Allow public read access to sync_settings" ON sync_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert sync_settings" ON sync_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sync_settings" ON sync_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Crear políticas para sync_logs
CREATE POLICY "Allow public read access to sync_logs" ON sync_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert sync_logs" ON sync_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Función para actualizar el timestamp de última actualización
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Disparador para actualizar el timestamp en sync_settings
CREATE TRIGGER update_sync_settings_last_updated
    BEFORE UPDATE ON sync_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Función para registrar cambios en el log
CREATE OR REPLACE FUNCTION log_sync_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO sync_logs (
        entity_type,
        entity_id,
        operation,
        old_value,
        new_value,
        created_by,
        client_info
    ) VALUES (
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT
            ELSE NEW.id::TEXT
        END,
        TG_OP,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN to_jsonb(NEW)
            ELSE NULL
        END,
        COALESCE(auth.uid()::TEXT, 'system'),
        jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'user_agent', current_setting('request.headers', true)::jsonb->'user-agent'
        )
    );
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Disparador para registrar cambios en sync_settings
CREATE TRIGGER log_sync_settings_changes
    AFTER INSERT OR UPDATE OR DELETE ON sync_settings
    FOR EACH ROW
    EXECUTE FUNCTION log_sync_changes();

-- Disparador para registrar cambios en news
CREATE TRIGGER log_news_changes
    AFTER INSERT OR UPDATE OR DELETE ON news
    FOR EACH ROW
    EXECUTE FUNCTION log_sync_changes();

-- Función para publicar eventos de cambio a través de Realtime
CREATE OR REPLACE FUNCTION publish_sync_event()
RETURNS TRIGGER AS $$
DECLARE
    payload JSONB;
BEGIN
    payload = jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'record', CASE
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
            ELSE to_jsonb(NEW)
        END,
        'timestamp', extract(epoch from now())
    );
    
    -- Publicar evento a través de pg_notify
    PERFORM pg_notify('sync_events', payload::TEXT);
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Disparador para publicar eventos de sync_settings
CREATE TRIGGER publish_sync_settings_events
    AFTER INSERT OR UPDATE OR DELETE ON sync_settings
    FOR EACH ROW
    EXECUTE FUNCTION publish_sync_event();

-- Disparador para publicar eventos de news
CREATE TRIGGER publish_news_events
    AFTER INSERT OR UPDATE OR DELETE ON news
    FOR EACH ROW
    EXECUTE FUNCTION publish_sync_event();

-- Insertar configuraciones iniciales
INSERT INTO sync_settings (key, value, updated_by)
VALUES 
('site_info', '{"name": "الدكتور أحمد العلواني", "description": "الموقع الرسمي للدكتور أحمد العلواني", "version": "1.0.0"}', 'system'),
('sync_config', '{"enabled": true, "interval": 5000, "retry_attempts": 3}', 'system'),
('last_sync', '{"timestamp": ' || extract(epoch from now()) || ', "status": "success"}', 'system')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sync_settings_key ON sync_settings (key);
CREATE INDEX IF NOT EXISTS idx_sync_logs_entity ON sync_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_news_date ON news (date);

-- Actualizar la tabla de noticias para mejorar la sincronización
ALTER TABLE news ADD COLUMN IF NOT EXISTS sync_version INTEGER DEFAULT 1;
ALTER TABLE news ADD COLUMN IF NOT EXISTS last_synced TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE news ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'synced';

-- Función para incrementar la versión de sincronización
CREATE OR REPLACE FUNCTION increment_sync_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.sync_version = OLD.sync_version + 1;
    NEW.last_synced = NOW();
    NEW.sync_status = 'modified';
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Disparador para incrementar la versión de sincronización
CREATE TRIGGER increment_news_sync_version
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION increment_sync_version();

-- Función para resolver conflictos de sincronización
CREATE OR REPLACE FUNCTION resolve_sync_conflict(
    entity_type TEXT,
    entity_id TEXT,
    client_version INTEGER,
    server_version INTEGER
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Registrar el conflicto
    INSERT INTO sync_logs (
        entity_type,
        entity_id,
        operation,
        old_value,
        new_value,
        created_by,
        client_info
    ) VALUES (
        entity_type,
        entity_id,
        'CONFLICT',
        jsonb_build_object('client_version', client_version),
        jsonb_build_object('server_version', server_version),
        COALESCE(auth.uid()::TEXT, 'system'),
        jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'resolution', 'server_wins'
        )
    );
    
    -- Obtener la versión del servidor
    IF entity_type = 'news' THEN
        SELECT to_jsonb(n) INTO result
        FROM news n
        WHERE n.id::TEXT = entity_id;
    ELSE
        result = NULL;
    END IF;
    
    RETURN result;
END;
$$ language 'plpgsql';

-- Crear función para obtener cambios recientes
CREATE OR REPLACE FUNCTION get_recent_changes(since_timestamp TIMESTAMPTZ)
RETURNS TABLE (
    entity_type TEXT,
    entity_id TEXT,
    operation TEXT,
    new_value JSONB,
    last_updated TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sl.entity_type,
        sl.entity_id,
        sl.operation,
        sl.new_value,
        sl.created_at AS last_updated
    FROM 
        sync_logs sl
    WHERE 
        sl.created_at > since_timestamp
    ORDER BY 
        sl.created_at ASC;
END;
$$ language 'plpgsql';