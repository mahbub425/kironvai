-- Enable Read access for all location and category tables
-- This will ensure frontend can fetch the dropdown values

-- 1. Upazilas
ALTER TABLE upazilas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read for upazilas" ON upazilas;
CREATE POLICY "Allow public read for upazilas" ON upazilas FOR SELECT USING (true);

-- 2. Unions
ALTER TABLE unions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read for unions" ON unions;
CREATE POLICY "Allow public read for unions" ON unions FOR SELECT USING (true);

-- 3. Wards
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read for wards" ON wards;
CREATE POLICY "Allow public read for wards" ON wards FOR SELECT USING (true);

-- 4. Categories
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read for categories" ON problem_categories;
CREATE POLICY "Allow public read for categories" ON problem_categories FOR SELECT USING (true);
