-- Add location columns to social_works and fix RLS
-- Run this in Supabase SQL Editor

-- Add location relations
ALTER TABLE social_works ADD COLUMN IF NOT EXISTS upazila_id UUID REFERENCES upazilas(id);
ALTER TABLE social_works ADD COLUMN IF NOT EXISTS union_id UUID REFERENCES unions(id);
ALTER TABLE social_works ADD COLUMN IF NOT EXISTS ward_id UUID REFERENCES wards(id);
ALTER TABLE social_works ADD COLUMN IF NOT EXISTS gram_moholla TEXT;

-- RLS for social_works table
ALTER TABLE social_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for social_works" ON social_works;
CREATE POLICY "Allow public read for social_works" ON social_works FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin insert for social_works" ON social_works;
CREATE POLICY "Allow admin insert for social_works" ON social_works FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for social_works" ON social_works;
CREATE POLICY "Allow admin update for social_works" ON social_works FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for social_works" ON social_works;
CREATE POLICY "Allow admin delete for social_works" ON social_works FOR DELETE TO authenticated USING (true);

-- Refresh PostgREST schema cache so newly added columns are immediately available.
NOTIFY pgrst, 'reload schema';
