-- Create social_categories table
CREATE TABLE IF NOT EXISTS social_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn TEXT NOT NULL,
    description_bn TEXT,
    icon TEXT,
    is_featured_on_home BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS
ALTER TABLE social_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for social_categories" ON social_categories;
CREATE POLICY "Allow public read for social_categories" ON social_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all for social_categories" ON social_categories;
CREATE POLICY "Allow admin all for social_categories" ON social_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default categories
INSERT INTO social_categories (name_bn, description_bn, icon, is_featured_on_home, sort_order) VALUES
('ত্রাণ বিতরণ', 'দুর্যোগপূর্ণ সময়ে অসহায় মানুষের মাঝে ত্রাণ ও সহায়তা প্রদান।', '🤝', true, 1),
('চিকিৎসা সহায়তা', 'দরিদ্র ও সুবিধা বঞ্চিত মানুষদের জন্য বিনামূল্যে চিকিৎসা ও ঔষধ।', '🏥', true, 2),
('শিক্ষাসামগ্রী বিতরণ', 'দরিদ্র মেধাবী শিক্ষার্থীদের শিক্ষাসামগ্রী ও বৃত্তি প্রদান।', '📚', true, 3),
('বৃক্ষরোপণ', 'পরিবেশ রক্ষায় বৃক্ষরোপণ কর্মসূচি।', '🌳', false, 4),
('পরিষ্কার-পরিচ্ছন্নতা', 'এলাকা পরিষ্কার-পরিচ্ছন্ন রাখার উদ্যোগ।', '🧹', false, 5),
('অন্যান্য', 'অন্যান্য সামাজিক কার্যক্রম।', '✨', false, 6)
ON CONFLICT DO NOTHING;
