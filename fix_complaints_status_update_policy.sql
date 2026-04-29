-- Fix complaint status updates from the admin panel.
-- Run this in Supabase SQL Editor.

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert complaints" ON complaints;
CREATE POLICY "Anyone can insert complaints"
ON complaints
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can track complaints" ON complaints;
CREATE POLICY "Anyone can track complaints"
ON complaints
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admin read for complaints" ON complaints;
CREATE POLICY "Allow admin read for complaints"
ON complaints
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admin update for complaints" ON complaints;
CREATE POLICY "Allow admin update for complaints"
ON complaints
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for complaints" ON complaints;
CREATE POLICY "Allow admin delete for complaints"
ON complaints
FOR DELETE
TO authenticated
USING (true);
