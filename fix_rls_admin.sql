-- Fix RLS policies for Admin CRUD operations
-- Run this in your Supabase SQL Editor

-- ========== UPAZILAS ==========
DROP POLICY IF EXISTS "Allow admin insert for upazilas" ON upazilas;
CREATE POLICY "Allow admin insert for upazilas" ON upazilas FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for upazilas" ON upazilas;
CREATE POLICY "Allow admin update for upazilas" ON upazilas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for upazilas" ON upazilas;
CREATE POLICY "Allow admin delete for upazilas" ON upazilas FOR DELETE TO authenticated USING (true);

-- ========== UNIONS ==========
DROP POLICY IF EXISTS "Allow admin insert for unions" ON unions;
CREATE POLICY "Allow admin insert for unions" ON unions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for unions" ON unions;
CREATE POLICY "Allow admin update for unions" ON unions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for unions" ON unions;
CREATE POLICY "Allow admin delete for unions" ON unions FOR DELETE TO authenticated USING (true);

-- ========== WARDS ==========
DROP POLICY IF EXISTS "Allow admin insert for wards" ON wards;
CREATE POLICY "Allow admin insert for wards" ON wards FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for wards" ON wards;
CREATE POLICY "Allow admin update for wards" ON wards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for wards" ON wards;
CREATE POLICY "Allow admin delete for wards" ON wards FOR DELETE TO authenticated USING (true);

-- ========== PROBLEM CATEGORIES ==========
DROP POLICY IF EXISTS "Allow admin insert for categories" ON problem_categories;
CREATE POLICY "Allow admin insert for categories" ON problem_categories FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for categories" ON problem_categories;
CREATE POLICY "Allow admin update for categories" ON problem_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for categories" ON problem_categories;
CREATE POLICY "Allow admin delete for categories" ON problem_categories FOR DELETE TO authenticated USING (true);

-- ========== COMPLAINTS (Admin update status) ==========
DROP POLICY IF EXISTS "Allow admin update for complaints" ON complaints;
CREATE POLICY "Allow admin update for complaints" ON complaints FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read for complaints" ON complaints;
CREATE POLICY "Allow admin read for complaints" ON complaints FOR SELECT TO authenticated USING (true);
