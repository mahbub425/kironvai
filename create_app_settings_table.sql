-- App-wide settings, including browser tab title.
-- Run this in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read app_settings" ON app_settings;
CREATE POLICY "Public can read app_settings"
ON app_settings
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admin can insert app_settings" ON app_settings;
CREATE POLICY "Admin can insert app_settings"
ON app_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update app_settings" ON app_settings;
CREATE POLICY "Admin can update app_settings"
ON app_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO app_settings (setting_key, setting_value)
VALUES
  ('site_title', 'কুড়িগ্রাম-১ জনসেবা ও অভিযোগ ব্যবস্থাপনা'),
  ('share_description', 'কুড়িগ্রাম-১ এলাকার জনসেবা, অভিযোগ ব্যবস্থাপনা, উন্নয়নমূলক কাজ এবং স্বেচ্ছাসেবী কার্যক্রমের ডিজিটাল প্ল্যাটফর্ম।'),
  ('share_image', '/favicon.svg'),
  ('site_url', 'https://your-domain.com')
ON CONFLICT (setting_key) DO NOTHING;

NOTIFY pgrst, 'reload schema';
