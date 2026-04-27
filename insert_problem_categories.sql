-- Enable RLS and setup policy so users can read the categories
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read problem_categories" ON problem_categories;
CREATE POLICY "Allow public read problem_categories" ON problem_categories FOR SELECT USING (true);

-- Insert all categories
DO $$
DECLARE
    cat TEXT;
    idx INT := 1;
    categories TEXT[] := ARRAY[
        'রাস্তা /যোগাযোগ সমস্যা',
        'ব্রিজ/কালভার্ট সমস্যা',
        'বিদ্যুৎ সমস্যা',
        'পানি সমস্যা',
        'স্যানিটেশন/ড্রেনেজ সমস্যা',
        'শিক্ষা প্রতিষ্ঠান সমস্যা',
        'স্বাস্থ্যসেবা সমস্যা',
        'কৃষি সমস্যা',
        'বন্যা/দুর্যোগ সমস্যা',
        'সামাজিক নিরাপত্তা/সহায়তা',
        'আইনশৃঙ্খলা বিষয়ক সমস্যা',
        'প্রশাসনিক/সেবা সংক্রান্ত সমস্যা',
        'পরিবেশ/বর্জ্য সমস্যা',
        'ভূমি/জমি সংক্রান্ত সমস্যা',
        'বাজার/দ্রব্যমূল্য সমস্যা',
        'কর্মসংস্থান/বেকারত্ব সমস্যা',
        'নারী ও শিশু বিষয়ক সমস্যা',
        'যুব ও ক্রীড়া কার্যক্রম সমস্যা',
        'গণপরিবহন/যাতায়াত সমস্যা',
        'ধর্মীয়/সামাজিক প্রতিষ্ঠান সমস্যা',
        'মাদক সংক্রান্ত সমস্যা',
        'খেলার মাঠ/বিনোদন সুবিধা সমস্যা',
        'অন্যান্য'
    ];
BEGIN
    FOREACH cat IN ARRAY categories
    LOOP
        -- Check if category already exists to prevent duplicate entries
        IF NOT EXISTS (SELECT 1 FROM problem_categories WHERE name_bn = cat) THEN
            INSERT INTO problem_categories (name_bn, sort_order) VALUES (cat, idx);
        END IF;
        idx := idx + 1;
    END LOOP;
END $$;
