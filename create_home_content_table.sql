-- =====================================================
-- Home Page Content Management Table
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Create the home_content table
CREATE TABLE IF NOT EXISTS home_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read home_content" ON home_content;
DROP POLICY IF EXISTS "Admin can update home_content" ON home_content;
DROP POLICY IF EXISTS "Admin can insert home_content" ON home_content;
DROP POLICY IF EXISTS "Admin can delete home_content" ON home_content;

-- Public read access
CREATE POLICY "Public can read home_content"
  ON home_content FOR SELECT
  TO public
  USING (true);

-- Authenticated users (admin) can update
CREATE POLICY "Admin can update home_content"
  ON home_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admin) can insert
CREATE POLICY "Admin can insert home_content"
  ON home_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users (admin) can delete
CREATE POLICY "Admin can delete home_content"
  ON home_content FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- Insert default content for all sections
-- =====================================================

INSERT INTO home_content (section_key, content) VALUES
  -- Hero Section
  ('hero_tag', 'উন্নয়ন ও সেবার অঙ্গীকারে'),
  ('hero_title', 'ভূরুঙ্গামারীর মানুষের পাশে, উন্নয়ন ও সেবার অঙ্গীকারে'),
  ('hero_subtitle', 'আপনার এলাকার সমস্যা জানান এবং অভিযোগের বর্তমান অবস্থা সহজেই দেখুন।'),
  ('hero_image', ''),

  -- About/Leader Intro Section
  ('about_name', 'মাহফুজুল ইসলাম কিরন'),
  ('about_designation', 'সমাজসেবক ও জননেতা, কুড়িগ্রাম-১'),
  ('about_description', '"আমার স্বপ্ন একটি আধুনিক, নিরাপদ ও উন্নত কুড়িগ্রাম-১ গড়া। আমি বিশ্বাস করি, সাধারণ মানুষের অংশগ্রহণ এবং সঠিক পরিকল্পনার মাধ্যমেই আমরা এই লক্ষ্য অর্জন করতে পারি। আপনাদের যেকোনো সমস্যা বা পরামর্শ আমাকে জানান, আমি সর্বদা আপনাদের পাশে আছি।"'),
  ('about_image', ''),

  -- Impact Counter / Statistics
  ('stat_resolved_complaints', '১,২৫০+'),
  ('stat_resolved_label', 'সমাধানকৃত অভিযোগ'),
  ('stat_total_projects', '৫০+'),
  ('stat_projects_label', 'উন্নয়নমূলক প্রকল্প'),
  ('stat_people_served', '১০,০০০+'),
  ('stat_people_label', 'সেবা পেয়েছেন'),
  ('stat_areas_covered', '২৫+'),
  ('stat_areas_label', 'এলাকা কভারেজ'),

  -- Contact Information
  ('contact_address', 'ভূরুঙ্গামারী সদর, ভূরুঙ্গামারী, কুড়িগ্রাম-১'),
  ('contact_phone_1', '+880 1700-000000'),
  ('contact_phone_2', '+880 1900-000000'),
  ('contact_email', 'contact@kironvai.com'),
  ('contact_office_hours', 'শনিবার - বৃহস্পতিবার: সকাল ৯টা - সন্ধ্যা ৬টা'),
  ('contact_office_closed', 'শুক্রবার: বন্ধ'),

  -- Social Media Links
  ('social_facebook', ''),
  ('social_twitter', ''),
  ('social_youtube', ''),
  ('social_instagram', ''),
  ('social_linkedin', ''),

  -- Footer Content
  ('footer_description', 'ভূরুঙ্গামারী ও নাগেশ্বরীর মানুষের সমস্যা সংগ্রহ, অভিযোগ ট্র্যাকিং এবং উন্নয়নমূলক কাজ প্রদর্শনের একটি ডিজিটাল প্ল্যাটফর্ম।'),
  ('footer_address', 'কুড়িগ্রাম রোড, ভূরুঙ্গামারী পৌরসভা, কুড়িগ্রাম।'),
  ('footer_phone', '+৮৮০১XXXXXXXXX'),
  ('footer_email', 'contact@kironvai.com'),
  ('footer_copyright', '© ২০২৬ কুড়িগ্রাম-১ জনসেবা প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।'),

  -- CTA Section
  ('cta_title', 'আপনার এলাকার কোনো সমস্যা আছে? আমাদের জানান!'),
  ('cta_subtitle', 'আমরা প্রতিটি অভিযোগ গুরুত্বের সাথে বিবেচনা করি।')

ON CONFLICT (section_key) DO NOTHING;
