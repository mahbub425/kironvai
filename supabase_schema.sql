-- Kurigram-1 Community Service and Complaint Management System
-- Database Schema for Supabase (Fresh Start)

-- Drop existing tables to avoid conflicts
DROP TRIGGER IF EXISTS trigger_generate_complaint_id ON complaints;
DROP FUNCTION IF EXISTS generate_complaint_id();
DROP TABLE IF EXISTS homepage_contents;
DROP TABLE IF EXISTS social_works;
DROP TABLE IF EXISTS development_works;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS problem_categories;
DROP TABLE IF EXISTS gram_mohollas;
DROP TABLE IF EXISTS wards;
DROP TABLE IF EXISTS unions;
DROP TABLE IF EXISTS upazilas;

-- 1. Locations: Upazilas
CREATE TABLE upazilas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Locations: Unions
CREATE TABLE unions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upazila_id UUID REFERENCES upazilas(id) ON DELETE CASCADE,
    name_bn TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Locations: Wards
CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upazila_id UUID REFERENCES upazilas(id) ON DELETE CASCADE,
    union_id UUID REFERENCES unions(id) ON DELETE CASCADE,
    name_bn TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Problem Categories
CREATE TABLE problem_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Complaints
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_code SERIAL,
    complaint_id TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    upazila_id UUID REFERENCES upazilas(id),
    union_id UUID REFERENCES unions(id),
    ward_id UUID REFERENCES wards(id),
    gram_moholla TEXT,
    problem_category_id UUID REFERENCES problem_categories(id),
    problem_details TEXT NOT NULL,
    image_path TEXT,
    status TEXT DEFAULT 'এখনো ভিজিট করা হয়নি',
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to generate the CM-0000001 format
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.complaint_id := 'CM-' || LPAD(NEW.complaint_code::TEXT, 7, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate complaint_id before insert
CREATE TRIGGER trigger_generate_complaint_id
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION generate_complaint_id();

-- 6. Development Works
CREATE TABLE development_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_bn TEXT NOT NULL,
    description_bn TEXT,
    image_path TEXT,
    location_text_bn TEXT,
    work_date DATE,
    work_status TEXT DEFAULT 'সম্পন্ন',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Social / Volunteer Works
CREATE TABLE social_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_bn TEXT NOT NULL,
    description_bn TEXT,
    image_path TEXT,
    work_type TEXT,
    location_text_bn TEXT,
    work_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Homepage Content
CREATE TABLE homepage_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL,
    title_bn TEXT,
    subtitle_bn TEXT,
    description_bn TEXT,
    image_path TEXT,
    button_text_bn TEXT,
    button_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data for Kurigram-1
INSERT INTO upazilas (name_bn) VALUES ('ভূরুঙ্গামারী'), ('নাগেশ্বরী');

-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert complaints" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can track complaints" ON complaints FOR SELECT USING (true);
