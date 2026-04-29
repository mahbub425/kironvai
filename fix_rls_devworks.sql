-- RLS for development_works table
-- Run this in Supabase SQL Editor

ALTER TABLE development_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for dev_works" ON development_works;
CREATE POLICY "Allow public read for dev_works" ON development_works FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin insert for dev_works" ON development_works;
CREATE POLICY "Allow admin insert for dev_works" ON development_works FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for dev_works" ON development_works;
CREATE POLICY "Allow admin update for dev_works" ON development_works FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for dev_works" ON development_works;
CREATE POLICY "Allow admin delete for dev_works" ON development_works FOR DELETE TO authenticated USING (true);
