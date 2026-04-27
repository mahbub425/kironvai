-- [ignoring loop detection]
-- Helper function to convert English numbers to Bengali numbers
CREATE OR REPLACE FUNCTION to_bengali_numeral(num INT) RETURNS TEXT AS $$
DECLARE
    eng TEXT := num::TEXT;
    ben TEXT;
BEGIN
    ben := REPLACE(eng, '0', '০');
    ben := REPLACE(ben, '1', '১');
    ben := REPLACE(ben, '2', '২');
    ben := REPLACE(ben, '3', '৩');
    ben := REPLACE(ben, '4', '৪');
    ben := REPLACE(ben, '5', '৫');
    ben := REPLACE(ben, '6', '৬');
    ben := REPLACE(ben, '7', '৭');
    ben := REPLACE(ben, '8', '৮');
    ben := REPLACE(ben, '9', '৯');
    RETURN ben;
END;
$$ LANGUAGE plpgsql;

-- Ensure read access is public for dropdowns to work
ALTER TABLE upazilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read upazilas" ON upazilas;
CREATE POLICY "Allow public read upazilas" ON upazilas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read unions" ON unions;
CREATE POLICY "Allow public read unions" ON unions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read wards" ON wards;
CREATE POLICY "Allow public read wards" ON wards FOR SELECT USING (true);

DO $$
DECLARE
    upazila_record RECORD;
    union_record RECORD;
    i INT;
BEGIN
    -- 1. Ensure Bhurungamari Upazila exists and get its ID
    SELECT id INTO upazila_record FROM upazilas WHERE name_bn = 'ভূরুঙ্গামারী' LIMIT 1;
    
    IF NOT FOUND THEN
        INSERT INTO upazilas (name_bn) VALUES ('ভূরুঙ্গামারী') RETURNING id INTO upazila_record;
    END IF;

    -- Delete old unions and wards for this upazila to avoid duplicates from previous run
    DELETE FROM wards WHERE upazila_id = upazila_record.id;
    DELETE FROM unions WHERE upazila_id = upazila_record.id;

    -- 2. Insert Union: ভুরুঙ্গামারী সদর (10 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'ভুরুঙ্গামারী সদর') RETURNING id INTO union_record;
    FOR i IN 1..10 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 3. Insert Union: জয়মনিরহাট (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'জয়মনিরহাট') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 4. Insert Union: বলদিয়া (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'বলদিয়া') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 5. Insert Union: পাইকেরছড়া (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'পাইকেরছড়া') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 6. Insert Union: শিলখুড়ী (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'শিলখুড়ী') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 7. Insert Union: চর ভুরুঙ্গামারী (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'চর ভুরুঙ্গামারী') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 8. Insert Union: তিলাই (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'তিলাই') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 9. Insert Union: আন্ধারীঝাড় (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'আন্ধারীঝাড়') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

    -- 10. Insert Union: পাথরডুবী (9 wards)
    INSERT INTO unions (upazila_id, name_bn) VALUES (upazila_record.id, 'পাথরডুবী') RETURNING id INTO union_record;
    FOR i IN 1..9 LOOP
        INSERT INTO wards (upazila_id, union_id, name_bn) VALUES (upazila_record.id, union_record.id, to_bengali_numeral(i) || ' নং ওয়ার্ড');
    END LOOP;

END $$;
